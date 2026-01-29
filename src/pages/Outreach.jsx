import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadsAPI, templatesAPI, emailAPI } from '../utils/api';
import MapPreview from '../components/MapPreview';
import { FiUsers, FiMail, FiSend, FiChevronRight, FiMapPin, FiPhone, FiGlobe } from 'react-icons/fi';
import './Dashboard.css';
import './DashboardOverview.css';
import './Outreach.css';

const Outreach = () => {
    const [leads, setLeads] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [emailContent, setEmailContent] = useState({ subject: '', body: '' });
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [leadsData, templatesData] = await Promise.all([
                leadsAPI.getAll(),
                templatesAPI.getAll()
            ]);
            setLeads(leadsData.leads || []);
            setTemplates(templatesData.templates || []);
        } catch (error) {
            console.error('Error fetching outreach data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
        if (selectedTemplate) {
            applyTemplate(selectedTemplate, lead);
        }
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        if (selectedLead) {
            applyTemplate(template, selectedLead);
        } else {
            setEmailContent({
                subject: template.subject,
                body: template.body
            });
        }
    };

    const applyTemplate = (template, lead) => {
        const replaceVars = (text) => {
            return text.replace(/\{\{business_name\}\}/g, lead.business_name || 'there');
        };

        setEmailContent({
            subject: replaceVars(template.subject),
            body: replaceVars(template.body)
        });
    };

    const handleSend = async () => {
        if (!selectedLead) {
            alert('Please select a lead first');
            return;
        }

        const emailAddress = selectedLead.email || 'bjfajardo01@gmail.com';

        if (!window.confirm(`Send real email to ${emailAddress}? (Ensure SMTP is configured in .env)`)) return;

        setSending(true);
        try {
            await emailAPI.send(emailAddress, emailContent.subject, emailContent.body);
            alert(`Email sent successfully to ${selectedLead.business_name}!`);

            // Update lead status to 'Contacted'
            await leadsAPI.update(selectedLead._id, { status: 'Contacted' });

            // Refresh leads list
            const leadsData = await leadsAPI.getAll();
            setLeads(leadsData.leads || []);

        } catch (error) {
            console.error('Error sending email:', error);
            const msg = error.response?.data?.message || 'Failed to send email. Check your SMTP settings in .env';
            alert(msg);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="dashboard-content"><div className="spinner"></div></div>;

    return (
        <div className="dashboard-content outreach-page">
            <div className="dashboard-header">
                <div>
                    <h1 className="gradient-text">Outreach Manager</h1>
                    <p>Integrated prospecting with live map verification</p>
                </div>
            </div>

            <div className="outreach-grid">
                {/* Left Panel: Leads & Map */}
                <div className="outreach-left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' }}>
                    <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                            <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                                <FiUsers style={{ color: 'var(--primary)' }} /> Select Prospect
                            </h3>
                        </div>
                        <div className="leads-list-mini" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                            {leads.length === 0 ? (
                                <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <p style={{ marginBottom: '16px' }}>No leads found.</p>
                                    <Link to="/dashboard/search" className="btn btn-secondary">Search Leads</Link>
                                </div>
                            ) : (
                                leads.map(lead => (
                                    <div
                                        key={lead._id}
                                        className={`mini-lead-card ${selectedLead?._id === lead._id ? 'active' : ''}`}
                                        onClick={() => handleSelectLead(lead)}
                                    >
                                        <div className="lead-name" style={{ fontWeight: 600, fontSize: '15px' }}>{lead.business_name}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            <FiMapPin style={{ fontSize: '11px', marginRight: '4px' }} /> {lead.address}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="map-section glass-card" style={{ padding: '8px', height: '300px' }}>
                        <MapPreview
                            businessName={selectedLead?.business_name}
                            address={selectedLead?.address}
                        />
                    </div>
                </div>

                {/* Right Panel: Email outreach */}
                <div className="outreach-right-panel">
                    <div className="glass-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '0' }}>
                        <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="step-badge">1</div>
                                <select
                                    className="input"
                                    style={{ minWidth: '240px', margin: 0 }}
                                    onChange={(e) => {
                                        const template = templates.find(t => t._id === e.target.value);
                                        if (template) handleSelectTemplate(template);
                                    }}
                                    value={selectedTemplate?._id || ''}
                                >
                                    <option value="" disabled>Choose an Email Template</option>
                                    {templates.map(t => (
                                        <option key={t._id} value={t._id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedLead && (
                                <div className="selected-lead-pill">
                                    <FiChevronRight /> Prospect: <strong>{selectedLead.business_name}</strong>
                                </div>
                            )}
                        </div>

                        <div className="email-composer">
                            <div className="form-group" style={{ margin: 0 }}>
                                <label style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Email Subject</label>
                                <input
                                    type="text"
                                    className="composer-subject"
                                    placeholder="Subject line will appear here..."
                                    value={emailContent.subject}
                                    onChange={(e) => setEmailContent({ ...emailContent, subject: e.target.value })}
                                />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <label style={{ color: 'var(--text-dim)', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Email Body</label>
                                <textarea
                                    className="composer-body"
                                    placeholder="Draft your message..."
                                    value={emailContent.body}
                                    onChange={(e) => setEmailContent({ ...emailContent, body: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="composer-footer" style={{ padding: '24px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="composer-tools" style={{ display: 'flex', gap: '24px', fontSize: '14px', color: 'var(--text-dim)' }}>
                                {selectedLead?.phone && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiPhone style={{ color: 'var(--success)' }} /> {selectedLead.phone}</span>
                                )}
                                {selectedLead?.website && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiGlobe style={{ color: 'var(--accent)' }} /> {selectedLead.website.replace(/^https?:\/\//, '').split('/')[0]}</span>
                                )}
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={handleSend}
                                disabled={sending || !selectedLead}
                                style={{ padding: '14px 40px' }}
                            >
                                {sending ? 'Sending...' : <><FiSend /> Send Campaign</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Outreach;
