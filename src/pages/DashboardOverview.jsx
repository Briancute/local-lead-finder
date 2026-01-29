import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { FaSearch, FaList, FaEnvelope, FaRocket, FaChevronDown, FaArrowUp, FaArrowDown, FaEllipsisV } from 'react-icons/fa';
import { leadsAPI, authAPI } from '../utils/api';
import './DashboardOverview.css';

const DashboardOverview = () => {
    const { user: contextUser } = useOutletContext();
    const [user, setUser] = useState(contextUser);
    const [leads, setLeads] = useState([]);
    const [stats, setStats] = useState({
        totalLeads: 0,
        newLeads: 0,
        contacted: 0,
        apiUsed: 0,
        apiLimit: 1000
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Fetch updated user data
            const userData = await authAPI.getMe();
            setUser(userData.user);

            // Fetch leads stats
            const leadsData = await leadsAPI.getAll();
            const fetchedLeads = leadsData.leads;
            setLeads(fetchedLeads);

            setStats({
                totalLeads: fetchedLeads.length,
                newLeads: fetchedLeads.filter(l => l.status === 'New').length,
                contacted: fetchedLeads.filter(l => l.status === 'Contacted').length,
                apiUsed: userData.user.apiQuotaUsed,
                apiLimit: userData.user.apiQuotaLimit
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quotaPercentage = (stats.apiUsed / stats.apiLimit) * 100;

    return (
        <div className="dashboard-overview-monera">
            {/* Stats Bar */}
            <div className="stats-strip-monera">
                <div className="monera-stat-mini glass-card-v2">
                    <span className="stat-label">Total Leads</span>
                    <div className="stat-row">
                        <span className="stat-val">{loading ? '...' : stats.totalLeads}</span>
                        <span className="stat-trend trend-up">Agency</span>
                    </div>
                </div>
                <div className="monera-stat-mini glass-card-v2">
                    <span className="stat-label">New Discovery</span>
                    <div className="stat-row">
                        <span className="stat-val">{loading ? '...' : stats.newLeads}</span>
                        <span className="stat-trend trend-down">Recent</span>
                    </div>
                </div>
                <div className="monera-stat-mini glass-card-v2">
                    <span className="stat-label">Outreach</span>
                    <div className="stat-row">
                        <span className="stat-val">{loading ? '...' : stats.contacted}</span>
                        <span className="stat-trend trend-up">Active</span>
                    </div>
                </div>
                <div className="monera-stat-mini glass-card-v2">
                    <span className="stat-label">API Quota</span>
                    <div className="stat-row">
                        <span className="stat-val">{Math.round(quotaPercentage)}%</span>
                        <span className="stat-trend trend-up">Used</span>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="monera-charts-row">
                <div className="monera-main-chart glass-card-v2">
                    <div className="chart-header">
                        <h3>Lead Discovery <span className="trend-up">+Weekly Growth</span></h3>
                        <div className="time-filters">
                            <button className="active">7d</button>
                            <button>1m</button>
                            <button>3m</button>
                        </div>
                    </div>
                    <div className="chart-visual-mockup">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                            <div key={day} className="chart-col">
                                <div
                                    className={`chart-bar-glow ${day === 'Fri' ? 'highlight' : ''}`}
                                    style={{ height: `${[30, 45, 60, 40, 85, 20, 30][idx]}%` }}
                                >
                                    {day === 'Fri' && (
                                        <div className="chart-tooltip">
                                            <span className="dot"></span>
                                            <span>{stats.totalLeads} Leads</span>
                                            <small>Search peak</small>
                                        </div>
                                    )}
                                </div>
                                <span className="day-label">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="monera-pie-chart glass-card-v2">
                    <div className="chart-header">
                        <h3>Leads Breakdown</h3>
                        <FaChevronDown size={12} />
                    </div>
                    <div className="pie-visual-mockup">
                        <div className="pie-circle" style={{
                            background: `conic-gradient(
                                var(--accent-purple) 0% ${Math.round((stats.contacted / stats.totalLeads || 0) * 100)}%,
                                #C0FF33 ${Math.round((stats.contacted / stats.totalLeads || 0) * 100)}% 100%
                            )`
                        }}>
                        </div>
                        <div className="segment-label-center">
                            {stats.totalLeads}<br /><small>Total</small>
                        </div>
                    </div>
                    <div className="pie-legend">
                        <span className="legend-item"><span className="dot misc"></span> Discovery</span>
                        <span className="legend-item"><span className="dot util"></span> Outreach</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="monera-table-section glass-card-v2">
                <div className="table-header">
                    <h3>Recent Leads</h3>
                    <div className="table-actions">
                        <div className="search-pill">
                            <FaSearch size={12} />
                            <input type="text" placeholder="Search leads..." />
                        </div>
                        <button className="filter-btn"><FaList size={12} /> Filter</button>
                        <button className="sort-btn">Date Found <FaChevronDown size={10} /></button>
                    </div>
                </div>
                <table className="monera-table">
                    <thead>
                        <tr>
                            <th>Company Name</th>
                            <th>Phone</th>
                            <th>Category</th>
                            <th>Address</th>
                            <th>Rating</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>Loading leads...</td></tr>
                        ) : leads.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>No leads found. Start a search to populate the dashboard!</td></tr>
                        ) : (
                            leads.slice(0, 5).map((lead, i) => (
                                <tr key={lead._id || i}>
                                    <td className="amt-cell">{lead.business_name}</td>
                                    <td>{lead.phone || 'N/A'}</td>
                                    <td>{lead.category || 'Lead'}</td>
                                    <td className="address-cell">{lead.address}</td>
                                    <td>⭐ {lead.rating || 'N/A'}</td>
                                    <td><span className={`status-pill ${lead.status?.toLowerCase() === 'contacted' ? 'scheduled' : lead.status?.toLowerCase() === 'new' ? 'new' : 'completed'}`}>{lead.status || 'New'}</span></td>
                                    <td><FaEllipsisV className="more-icon" /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashboardOverview;
