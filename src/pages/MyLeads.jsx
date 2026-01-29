import React, { useState, useEffect } from 'react';
import { leadsAPI } from '../utils/api';
import { FiSearch, FiFilter, FiTrash2, FiExternalLink, FiDownload, FiRefreshCw, FiMapPin, FiPhone, FiGlobe, FiStar, FiMail } from 'react-icons/fi';
import { gsap } from 'gsap';
import './Dashboard.css';
import './DashboardOverview.css';
import './MyLeads.css';

const MyLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshingId, setRefreshingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const data = await leadsAPI.getAll();
            setLeads(data.leads || []);

            setTimeout(() => {
                gsap.from('.lead-row', {
                    opacity: 0,
                    y: 10,
                    stagger: 0.02,
                    duration: 0.3,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }, 50);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshDetails = async (id) => {
        try {
            setRefreshingId(id);
            const updated = await leadsAPI.update(id, { refreshDetails: true });
            setLeads(leads.map(l => l._id === id ? updated.lead : l));
        } catch (error) {
            console.error('Error refreshing details:', error);
            alert('Failed to fetch updated details from Google.');
        } finally {
            setRefreshingId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;

        try {
            await leadsAPI.delete(id);
            setLeads(leads.filter(l => l._id !== id));
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const updated = await leadsAPI.update(id, { status });
            setLeads(leads.map(l => l._id === id ? { ...l, status: updated.lead.status } : l));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const blob = await leadsAPI.exportCSV();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setExporting(false);
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.business_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || lead.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusClass = (status) => {
        switch (status) {
            case 'New': return 'status-new';
            case 'Contacted': return 'status-contacted';
            case 'Closed': return 'status-closed';
            default: return 'status-default';
        }
    };

    return (
        <div className="dashboard-content my-leads-page">
            <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className="gradient-text">My Leads</h1>
                    <p>Manage and track your high-intent business prospects</p>
                </div>
                <button
                    className="export-btn"
                    onClick={handleExport}
                    disabled={exporting || leads.length === 0}
                >
                    <FiDownload size={18} />
                    <span>{exporting ? 'Exporting...' : 'Export Results'}</span>
                </button>
            </div>

            <div className="leads-filters">
                <div className="search-input-wrapper">
                    <FiSearch size={20} />
                    <input
                        type="text"
                        placeholder="Search leads by business name..."
                        className="input"
                        style={{ margin: 0 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div style={{ position: 'relative', width: '220px' }}>
                    <FiFilter style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select
                        className="input"
                        style={{ width: '100%', paddingLeft: '3.5rem', margin: 0 }}
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="leads-table-container animate-scaleIn">
                <div style={{ overflowX: 'auto' }}>
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Business</th>
                                <th>Location</th>
                                <th>Contact</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center' }}>
                                        <div className="spinner"></div>
                                        <p style={{ marginTop: '1rem', color: 'var(--text-dim)' }}>Loading your vault...</p>
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-dim)' }}>
                                        <FiSearch size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                        <p>{searchTerm || filterStatus !== 'All' ? 'No matches found for your criteria' : 'Your lead vault is empty. Start your search now!'}</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead._id} className="lead-row">
                                        <td>
                                            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.05rem' }}>{lead.business_name}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                {lead.website ? (
                                                    <a href={lead.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <FiGlobe size={12} /> {lead.website.replace(/^https?:\/\//, '').split('/')[0]}
                                                    </a>
                                                ) : <span style={{ fontStyle: 'italic' }}>No website found</span>}
                                            </div>
                                        </td>
                                        <td className="address-cell-v2">
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                                <FiMapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                                                <span>{lead.address}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {lead.phone ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                                                        <FiPhone size={14} style={{ color: 'var(--success)' }} /> {lead.phone}
                                                    </div>
                                                ) : <span style={{ opacity: 0.3, fontSize: '0.85rem' }}>No Phone</span>}
                                                {lead.email && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                                                        <FiMail size={14} style={{ color: 'var(--primary)' }} /> Available
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <FiStar size={16} fill={lead.rating > 0 ? "#fbbf24" : "none"} color={lead.rating > 0 ? "#fbbf24" : "var(--text-muted)"} />
                                                <span style={{ fontWeight: 700 }}>{lead.rating || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <select
                                                value={lead.status}
                                                onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                                                className={`status-badge ${getStatusClass(lead.status)}`}
                                                style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                                            >
                                                <option value="New">New</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Qualified">Qualified</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                                                {(!lead.phone || !lead.website) && (
                                                    <button
                                                        onClick={() => handleRefreshDetails(lead._id)}
                                                        className="btn-icon-alt"
                                                        title="Refresh Details from Google"
                                                        style={{ color: 'var(--primary)' }}
                                                        disabled={refreshingId === lead._id}
                                                    >
                                                        <FiRefreshCw size={18} className={refreshingId === lead._id ? 'spin' : ''} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(lead._id)}
                                                    className="btn-icon-alt"
                                                    title="Delete Lead"
                                                    style={{ color: 'var(--error)' }}
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .btn-icon-alt {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 8px;
                    transition: var(--transition-fast);
                }
                .btn-icon-alt:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: scale(1.1);
                }
                .animate-scaleIn {
                    animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}} />
        </div>
    );
};

export default MyLeads;
