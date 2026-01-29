import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaSearch,
    FaEnvelope,
    FaChartLine,
    FaRocket,
    FaShieldAlt,
    FaChevronRight,
    FaCheck,
    FaPlus,
    FaMapMarkedAlt,
    FaMagic,
    FaMapMarkerAlt,
    FaDatabase,
    FaGlobe,
    FaRegFileAlt,
    FaUsers
} from 'react-icons/fa';
import ScrollReveal from '../components/ScrollReveal';
import Spline from '@splinetool/react-spline';
import './LandingPage.css';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div className="landing-page">
            <div className="spline-background">
                <Spline
                    scene="https://prod.spline.design/Y5Jr2ArxUmo5LgkU/scene.splinecode"
                    style={{ width: '100%', height: '100%' }}
                    onLoad={() => console.log('Spline 3D Scene Loaded Successfully 🚀')}
                />
                <div className="spline-overlay-gradient"></div>
            </div>

            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-left">
                        <Link to="/" className="nav-brand">
                            <FaRocket className="logo-icon" />
                            <span>LeadFinder</span>
                        </Link>
                    </div>

                    <div className="nav-center">
                        <a href="#product" className="nav-link">Product</a>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                        <a href="#customers" className="nav-link">Customers</a>
                    </div>

                    <div className="nav-right">
                        <Link to="/login" className="nav-link">Log in</Link>
                        <Link to="/register" className="btn btn-white btn-sm">Sign up</Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section id="product" className="hero-section">
                <div className="hero-content">
                    <ScrollReveal animation="fade-up">
                        <div className="hero-announcement">
                            <span className="announcement-pill">New: AI Lead Scoring Beta</span>
                            <span className="announcement-link">Read the roadmap <FaChevronRight size={8} /></span>
                        </div>
                        <h1 className="hero-title-main">Meet the system for <br /> modern lead generation</h1>
                        <p className="hero-description">
                            Streamline discovery, outreach, and agency growth <br />
                            with the definitive platform for business developers.
                        </p>
                        <div className="hero-btns-row">
                            <Link to="/register" className="btn btn-white">Start building</Link>
                            <Link to="/register" className="btn btn-ghost-link">
                                <span>Advanced CRM Integration (Beta)</span>
                                <FaChevronRight size={10} />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>

                {/* Tilted Mockup with 3D Effect */}
                <div className="hero-mockup-container">
                    <ScrollReveal animation="fade-up" delay={0.4}>
                        <div className="hero-mockup-perspective">
                            <div className="hero-mockup-3d-side"></div>
                            <div className="hero-mockup-image glass-card">
                                <div className="mockup-header">
                                    <div className="mockup-dots">
                                        <span></span><span></span><span></span>
                                    </div>
                                    <div className="mockup-address">dashboard.leadfinder.app/outreach</div>
                                </div>
                                <div className="mockup-body">
                                    <div className="mockup-sidebar">
                                        <div className="sidebar-logo-sm"></div>
                                        <div className="sidebar-links-sm">
                                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="link-shimmer"></div>)}
                                        </div>
                                    </div>
                                    <div className="mockup-content">
                                        <div className="mockup-title-shimmer"></div>
                                        <div className="mockup-grid-v2">
                                            <div className="mockup-stat-card"></div>
                                            <div className="mockup-stat-card"></div>
                                            <div className="mockup-stat-card"></div>
                                            <div className="mockup-chart-main"></div>
                                            <div className="mockup-table-shimmer"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* FEATURES (BENTO 2.0 - LINEAR CONCEPT) */}
            <section id="features" className="features-section">
                <div className="aurora-glow glow-1"></div>
                <div className="aurora-glow glow-2"></div>

                <div className="section-header">
                    <ScrollReveal animation="fade-up">
                        <h2 className="glow-text silver-text">High-performance <br /> lead infrastructure</h2>
                    </ScrollReveal>
                </div>

                <div className="bento-grid-v2">
                    {/* Top Row: Two Small Cards */}
                    <div className="bento-row-top">
                        {/* CARD 1: SCRAPER ENGINE */}
                        <ScrollReveal animation="fade-up" className="bento-card-v2 scale-hover" onMouseMove={handleMouseMove}>
                            <div className="spotlight-overlay"></div>
                            <div className="bento-card-text">
                                <h3>Manage leads end-to-end</h3>
                                <p>Consolidate specs, emails, and deep extraction data in one centralized location.</p>
                            </div>
                            <div className="bento-visual-wrapper property-visual">
                                <ScrollReveal animation="rotate-in" delay={0.2}>
                                    <div className="linear-property-card">
                                        <div className="card-inner-header">Lead Intelligence</div>
                                        <div className="property-group">
                                            <div className="prop-label">Properties</div>
                                            <div className="prop-tags">
                                                <span className="p-tag"><FaMapMarkerAlt size={10} /> In Progress</span>
                                                <span className="p-tag gray"><FaDatabase size={10} /> DATA</span>
                                            </div>
                                        </div>
                                        <div className="property-group">
                                            <div className="prop-label">Resources</div>
                                            <div className="prop-tags">
                                                <span className="p-tag figma"><FaMagic size={10} /> AI Enrichment</span>
                                                <span className="p-tag lime"><FaGlobe size={10} /> Verified</span>
                                            </div>
                                        </div>
                                        <div className="property-group">
                                            <div className="prop-label">Milestones</div>
                                            <div className="milestone-item">
                                                <span className="m-dot purple"></span>
                                                <span className="m-text">Extraction Review <small>100%</small></span>
                                            </div>
                                            <div className="milestone-item">
                                                <span className="m-dot purple"></span>
                                                <span className="m-text">Email Discovery <small>100% of 10</small></span>
                                            </div>
                                            <div className="milestone-item">
                                                <span className="m-dot outline"></span>
                                                <span className="m-text gray">GA <small>25% of 53</small></span>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </ScrollReveal>

                        {/* CARD 2: AI UPDATES */}
                        <ScrollReveal animation="fade-up" delay={0.1} className="bento-card-v2 scale-hover" onMouseMove={handleMouseMove}>
                            <div className="spotlight-overlay"></div>
                            <div className="bento-card-text">
                                <h3>Real-time discovery sync</h3>
                                <p>Communicate progress and pipeline health with built-in status updates.</p>
                            </div>
                            <div className="bento-visual-wrapper stack-visual">
                                <ScrollReveal animation="fade-up" delay={0.3}>
                                    <div className="status-stack-container">
                                        <div className="status-pill-v2 off-track">
                                            <span className="s-dot redact"></span>
                                            <span className="s-label">Off track</span>
                                        </div>
                                        <div className="status-pill-v2 at-risk">
                                            <span className="s-dot yellow"></span>
                                            <span className="s-label">At risk</span>
                                        </div>
                                        <div className="status-pill-v2 on-track">
                                            <span className="s-dot-v2">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                    <path d="M5 12l5 5L20 7" />
                                                </svg>
                                            </span>
                                            <span className="s-label">On track</span>
                                            <p className="s-msg">Verified 50+ New Decision Makers</p>
                                            <span className="s-date">Sep 8</span>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Bottom Row: One Large Card */}
                    <div className="bento-row-bottom">
                        <ScrollReveal animation="fade-up" delay={0.2} className="bento-card-v2 large scale-hover" onMouseMove={handleMouseMove}>
                            <div className="spotlight-overlay"></div>
                            <div className="bento-card-text">
                                <h3>Unified Agency Workspace</h3>
                                <p>Ideate, specify, and automate what to scrape next in a collaborative environment.</p>
                                <div className="feature-list-linear">
                                    <div className="f-item-v2 active">Collaborative documents</div>
                                    <div className="f-item-v2">Inline comments</div>
                                    <div className="f-item-v2">Scraper-to-CRM commands</div>
                                </div>
                            </div>
                            <div className="bento-visual-wrapper workspace-visual">
                                <ScrollReveal animation="scale" delay={0.4}>
                                    <div className="workspace-editor-mockup">
                                        <div className="editor-nav">
                                            <FaRegFileAlt size={12} />
                                            <span>Discovery Specs</span>
                                            <FaChevronRight size={8} />
                                            <span>Agency Growth</span>
                                        </div>
                                        <div className="editor-content-area">
                                            <div className="user-group-icon">
                                                <FaUsers size={14} />
                                            </div>
                                            <h4 className="editor-title">
                                                Collaborate on <span className="presence-tag zoe">zoe</span> leads
                                            </h4>
                                            <p className="editor-para">
                                                Write down target industries and work together on
                                                search parameters in realtime. Add <span className="presence-tag quinn">quinn</span>
                                                <strong> **styles**</strong> and <em>##structures</em> with multiplayer support.
                                            </p>
                                        </div>
                                        <div className="editor-sidebar-dots">
                                            <span></span><span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* ROADMAP / DISCOVERY CONCEPT (LINEAR STYLE) */}
            <section id="roadmap" className="roadmap-section">
                <div className="section-container">
                    <div className="roadmap-content">
                        <ScrollReveal animation="fade-up">
                            <div className="roadmap-badge-linear">
                                <span className="gold-dot"></span>
                                <span>Lead tracking and pipeline management</span>
                                <FaChevronRight size={10} style={{ opacity: 0.5 }} />
                            </div>
                            <h2 className="linear-heading">Set your growth <br /> in motion</h2>
                            <div className="linear-description-group">
                                <p className="description-lead">Optimized for speed and high-precision outreach.</p>
                                <p className="description-sub">
                                    Track every interaction in seconds, manage massive lead pipelines
                                    in context, and breeze through your outreach in views tailored
                                    to your agency's velocity.
                                </p>
                            </div>
                            <button className="btn btn-secondary btn-sm" style={{ padding: '10px 24px', borderWidth: '1px' }}>
                                Learn more <FaChevronRight size={10} style={{ marginLeft: '8px', opacity: 0.7 }} />
                            </button>
                        </ScrollReveal>
                    </div>

                    <div className="roadmap-visual-linear">
                        <ScrollReveal animation="fade-up" delay={0.2}>
                            <div className="cards-perspective-container">
                                {/* Card 1: High Priority */}
                                <div className="linear-card card-top-left">
                                    <div className="card-header">
                                        <span className="card-id">LDR-1025</span>
                                        <div className="priority-pill high">High Priority</div>
                                    </div>
                                    <h4 className="card-title">Optimize outreach sequences</h4>
                                    <div className="card-footer-tags">
                                        <span className="tag-icon"><FaMagic size={12} /></span>
                                        <span className="tag-pill">AI Optimization</span>
                                    </div>
                                </div>

                                {/* Card 2: Urgent */}
                                <div className="linear-card card-middle-right">
                                    <div className="card-header">
                                        <span className="card-id">LDR-902</span>
                                        <div className="priority-pill urgent">Urgent</div>
                                    </div>
                                    <h4 className="card-title">Follow up with tech founders</h4>
                                    <div className="card-footer-tags">
                                        <span className="tag-icon"><FaEnvelope size={12} /></span>
                                        <span className="tag-pill">Outreach</span>
                                    </div>
                                </div>

                                {/* Card 3: Qualifying */}
                                <div className="linear-card card-bottom-center">
                                    <div className="card-header">
                                        <span className="card-id">LDR-1012</span>
                                        <div className="status-indicator-circle"></div>
                                        <span className="status-text">Qualifying</span>
                                    </div>
                                    <h4 className="card-title">Automate LinkedIn discovery</h4>
                                    <div className="card-footer-tags">
                                        <span className="tag-icon"><FaSearch size={12} /></span>
                                        <span className="tag-pill">Discovery</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            <section id="pricing" className="pricing-section">
                <div id="customers" className="pricing-top">
                    <ScrollReveal animation="fade-up">
                        <div className="pricing-header-split">
                            <div className="header-left">
                                <h2 className="glow-text">Flexible plans for <br /> every scale</h2>
                            </div>
                            <div className="header-right">
                                <p>Whether you're a solo founder or a global enterprise. <a href="/register" className="link-hover">Compare plans <FaChevronRight size={10} /></a></p>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

                <div className="pricing-grid-new">
                    {[
                        { name: 'Starter', price: '$0', desc: 'Free forever for solo explorers', features: '100 leads/mo', color: 'rgba(255,255,255,0.02)' },
                        { name: 'Pro', price: '$59', desc: 'Our most popular plan for growth', features: 'Unlimited discovery', color: 'rgba(182, 102, 210, 0.05)' },
                        { name: 'Enterprise', price: '$199', desc: 'For high-volume agency operations', features: 'Dedicated API access', color: 'rgba(192, 255, 51, 0.03)' }
                    ].map((plan, index) => (
                        <div key={index} className="pricing-card-modern">
                            <ScrollReveal animation="fade-up" delay={index * 0.1}>
                                <div className="card-top" style={{ background: plan.color }}>
                                    <div className="price-massive">{plan.price}</div>
                                    <div className="price-desc">{plan.desc}</div>
                                    <div className="price-highlight">{plan.features}</div>
                                </div>
                                <div className="card-footer">
                                    <h3>{plan.name}</h3>
                                    <div className="action-circle">
                                        <FaPlus size={12} />
                                    </div>
                                </div>
                            </ScrollReveal>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-grid">
                        <div className="footer-brand-col">
                            <Link to="/" className="footer-logo">
                                <FaRocket className="logo-icon" />
                                <span>LeadFinder</span>
                            </Link>
                            <p>The system for modern lead generation. <br /> Built for agencies and creators.</p>
                        </div>

                        <div className="footer-links-col">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#roadmap">Roadmap</a>
                        </div>

                        <div className="footer-links-col">
                            <h4>Company</h4>
                            <a href="#">About</a>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>

                        <div className="footer-links-col">
                            <h4>Connect</h4>
                            <a href="#">Twitter</a>
                            <a href="#">LinkedIn</a>
                            <a href="#">GitHub</a>
                        </div>
                    </div>

                    <div className="footer-bottom-new">
                        <p>© 2024 LeadFinder Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
