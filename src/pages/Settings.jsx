import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaUser, FaEnvelope, FaShieldAlt, FaKey, FaChartPie } from 'react-icons/fa';
import { authAPI } from '../utils/api';
import './DashboardOverview.css'; // Reuse glass styles

const Settings = () => {
    const { user: contextUser } = useOutletContext();
    const [user, setUser] = useState(contextUser);
    const [loading, setLoading] = useState(false);

    const quotaUsed = user?.apiQuotaUsed || 0;
    const quotaLimit = user?.apiQuotaLimit || 1000;
    const quotaPercent = (quotaUsed / quotaLimit) * 100;

    return (
        <div className="dashboard-overview-monera">
            <div className="settings-container-v2">
                <div className="settings-header-monera">
                    <h2>Account Settings</h2>
                    <p>Manage your agency profile and system preferences.</p>
                </div>

                <div className="monera-charts-row">
                    {/* Profile Section */}
                    <div className="monera-main-chart glass-card-v2" style={{ height: 'auto' }}>
                        <div className="chart-header">
                            <h3><FaUser style={{ marginRight: '10px', color: 'var(--accent-purple)' }} /> Basic Information</h3>
                        </div>
                        <div className="settings-form">
                            <div className="form-group-monera">
                                <label>Full Name</label>
                                <input type="text" defaultValue={user?.name} className="monera-input" />
                            </div>
                            <div className="form-group-monera">
                                <label>Email Address</label>
                                <input type="email" defaultValue={user?.email} className="monera-input" readOnly />
                            </div>
                            <button className="btn-linear primary" style={{ marginTop: '20px', width: '200px', justifyContent: 'center' }}>Save Changes</button>
                        </div>
                    </div>

                    {/* AI Credits Section */}
                    <div className="monera-pie-chart glass-card-v2" style={{ height: 'auto' }}>
                        <div className="chart-header">
                            <h3><FaChartPie style={{ marginRight: '10px', color: 'var(--accent-lime)' }} /> AI Discovery Credits</h3>
                        </div>
                        <div className="credits-usage-v2">
                            <div className="usage-stat-monera">
                                <span className="usage-val">{quotaUsed.toLocaleString()}</span>
                                <span className="usage-slash">/</span>
                                <span className="usage-limit">{quotaLimit.toLocaleString()}</span>
                            </div>
                            <div className="usage-bar-monera">
                                <div className="usage-fill-monera" style={{ width: `${quotaPercent}%`, background: 'var(--accent-purple)' }}></div>
                            </div>
                            <p className="usage-desc">Credits refresh on the 1st of every month. Your current plan: <strong>Professional Agency</strong></p>
                        </div>
                    </div>
                </div>

                <div className="monera-table-section glass-card-v2" style={{ marginTop: '20px' }}>
                    <div className="chart-header">
                        <h3><FaShieldAlt style={{ marginRight: '10px', color: 'var(--accent-purple)' }} /> Security & API</h3>
                    </div>
                    <div className="settings-form">
                        <div className="form-group-monera">
                            <label>Current Password</label>
                            <input type="password" placeholder="••••••••" className="monera-input" />
                        </div>
                        <div className="form-group-monera">
                            <label>New Password</label>
                            <input type="password" placeholder="Min 8 characters" className="monera-input" />
                        </div>
                        <button className="btn-linear primary" style={{ marginTop: '20px', width: '200px', justifyContent: 'center' }}>Update Password</button>
                    </div>
                </div>
            </div>

            <style>{`
                .settings-header-monera { margin-bottom: 32px; }
                .settings-header-monera h2 { font-size: 1.8rem; font-weight: 700; color: #fff; margin-bottom: 8px; }
                .settings-header-monera p { color: var(--text-muted-monera); }
                
                .form-group-monera { margin-bottom: 20px; display: flex; flex-direction: column; gap: 8px; }
                .form-group-monera label { font-size: 0.85rem; color: var(--text-muted-monera); font-weight: 600; }
                .monera-input { 
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid var(--border-glass); 
                    border-radius: 12px; 
                    padding: 12px 16px; 
                    color: #fff; 
                    font-size: 0.9rem;
                    outline: none;
                    transition: all 0.2s ease;
                }
                .monera-input:focus { border-color: var(--accent-purple); background: rgba(255,255,255,0.05); }
                .monera-input[readOnly] { opacity: 0.6; cursor: not-allowed; }

                .credits-usage-v2 { padding: 10px 0; }
                .usage-stat-monera { display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px; }
                .usage-val { font-size: 2.5rem; font-weight: 800; color: #fff; }
                .usage-slash { font-size: 1.5rem; color: var(--text-muted-monera); }
                .usage-limit { font-size: 1.5rem; color: var(--text-muted-monera); font-weight: 600; }
                
                .usage-bar-monera { height: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; margin-bottom: 20px; }
                .usage-fill-monera { height: 100%; border-radius: 4px; box-shadow: 0 0 15px rgba(182, 102, 210, 0.3); }
                .usage-desc { font-size: 0.85rem; color: var(--text-muted-monera); line-height: 1.5; }
                .usage-desc strong { color: #fff; }
                @media (max-width: 768px) {
                    .monera-charts-row { grid-template-columns: 1fr; }
                    .usage-val { font-size: 2rem; }
                    .usage-limit, .usage-slash { font-size: 1.2rem; }
                    .btn-linear { width: 100% !important; }
                }
            `}</style>
        </div>
    );
};

export default Settings;
