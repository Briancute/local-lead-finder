import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation, NavLink } from 'react-router-dom';
import { FaRocket, FaSearch, FaList, FaEnvelope, FaUser, FaSignOutAlt, FaChartLine, FaChartBar, FaCreditCard, FaFileAlt, FaCog, FaChevronDown } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            navigate('/login');
            return;
        }

        setUser(JSON.parse(userData));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: <FaChartLine />, label: 'Overview' },
        { path: '/dashboard/search', icon: <FaSearch />, label: 'Lead Discovery' },
        { path: '/dashboard/leads', icon: <FaList />, label: 'Lead CRM' },
        { path: '/dashboard/outreach', icon: <FaRocket />, label: 'Automation' },
        { path: '/dashboard/templates', icon: <FaEnvelope />, label: 'Email Templates' },
    ];

    if (!user) return null;

    return (
        <div className={`dashboard-container ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
            {/* Mobile Header */}
            <header className="monera-mobile-header">
                <div className="logo-circle-sm">
                    <FaRocket />
                </div>
                <h2>LeadFinder</h2>
                <button className="menu-toggle-v2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <FaList />
                </button>
            </header>

            {/* Mobile Overlay */}
            {sidebarOpen && typeof window !== 'undefined' && window.innerWidth <= 1024 && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
            )}

            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-brand-monera">
                    <div className="logo-circle">
                        <FaRocket className="logo-icon-svg" />
                    </div>
                    <span className="logo-text-monera">LeadFinder</span>
                </div>

                <nav className="sidebar-nav-v2">
                    <div className="nav-section-title">MAIN MENU</div>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `nav-item-v2 ${isActive ? 'active' : ''}`}
                            end={item.path === '/dashboard'}
                            onClick={() => typeof window !== 'undefined' && window.innerWidth <= 1024 && setSidebarOpen(false)}
                        >
                            <span className="nav-icon-v2">{item.icon}</span>
                            <span className="nav-label-v2">{item.label}</span>
                        </NavLink>
                    ))}

                    <div className="nav-section-title" style={{ marginTop: '32px' }}>SYSTEM</div>
                    <NavLink to="/dashboard/settings" className="nav-item-v2" onClick={() => typeof window !== 'undefined' && window.innerWidth <= 1024 && setSidebarOpen(false)}>
                        <span className="nav-icon-v2"><FaCog /></span>
                        <span className="nav-label-v2">Settings</span>
                    </NavLink>
                    <button onClick={handleLogout} className="nav-item-v2 logout-btn-v2" style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                        <span className="nav-icon-v2"><FaSignOutAlt /></span>
                        <span className="nav-label-v2">Logout</span>
                    </button>
                </nav>

                <div className="sidebar-footer-v2">
                    {/* AI Credits Mini Card */}
                    <div className="credits-micro-card glass-card-v2">
                        <div className="micro-header">
                            <span>AI Credit Usage</span>
                            <span className="credit-pill">{Math.round((user?.apiQuotaUsed / user?.apiQuotaLimit) * 100 || 0)}%</span>
                        </div>
                        <div className="micro-bar">
                            <div className="micro-bar-fill" style={{ width: `${(user?.apiQuotaUsed / user?.apiQuotaLimit) * 100}%` }}></div>
                        </div>
                        <span className="micro-limit">{user?.apiQuotaUsed || 0} / {user?.apiQuotaLimit || 1000}</span>
                    </div>

                    <div className="help-card-monera" style={{ marginTop: '16px' }}>
                        <h4>Support</h4>
                        <button className="contact-btn-monera" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Open Ticket</button>
                    </div>
                </div>
            </aside>

            <main className="dashboard-main-monera">
                <header className="monera-top-header desktop-only">
                    <h2>{navItems.find(i => location.pathname === i.path)?.label || (location.pathname.includes('settings') ? 'Settings' : 'Overview')}</h2>
                    <div className="user-profile-monera">
                        <div className="profile-initials">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="profile-name">{user?.name}</span>
                        <FaChevronDown size={12} className="chevron-icon" />
                    </div>
                </header>
                <div className="content-scroll-area">
                    <Outlet context={{ user }} />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
