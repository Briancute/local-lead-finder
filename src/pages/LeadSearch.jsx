import { useState, useEffect } from 'react';
import { FiSearch, FiStar, FiMapPin, FiPhone, FiGlobe, FiPlus, FiCheck, FiInfo } from 'react-icons/fi';
import { leadsAPI } from '../utils/api';
import { gsap } from 'gsap';
import './LeadSearch.css';

const LeadSearch = () => {
    const [searchForm, setSearchForm] = useState({
        keyword: '',
        location: ''
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quota, setQuota] = useState(null);
    const [savedLeads, setSavedLeads] = useState(new Set());
    const [nextPageToken, setNextPageToken] = useState(null);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();

        if (!searchForm.keyword) {
            alert('Please enter a search keyword');
            return;
        }

        setLoading(true);
        try {
            const data = await leadsAPI.search(searchForm.keyword, searchForm.location);
            setResults(data.results);
            setNextPageToken(data.nextPageToken);
            setQuota(data.quota);

            // Animate results in
            setTimeout(() => {
                // Animation for new results
                gsap.from('.lead-card-new', {
                    opacity: 0,
                    y: 20,
                    stagger: 0.03,
                    duration: 0.3,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }, 100);
        } catch (error) {
            console.error('Search error:', error);
            alert(error.response?.data?.message || 'Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        if (!nextPageToken || loading) return;

        setLoading(true);
        try {
            const data = await leadsAPI.search(searchForm.keyword, searchForm.location, nextPageToken);
            const newResults = data.results;
            setResults(prev => [...prev, ...newResults]);
            setNextPageToken(data.nextPageToken);
            setQuota(data.quota);

            // Animate only new results
            setTimeout(() => {
                const cards = document.querySelectorAll('.lead-card');
                const newCards = Array.from(cards).slice(results.length);
                gsap.from(newCards, {
                    opacity: 0,
                    y: 30,
                    stagger: 0.05,
                    duration: 0.6,
                    ease: 'expo.out',
                    clearProps: 'all'
                });
            }, 100);
        } catch (error) {
            console.error('Load more error:', error);
            alert('Failed to load more results. Google Maps API requires a short delay between pages.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLead = async (lead) => {
        try {
            await leadsAPI.save({
                businessName: lead.name,
                address: lead.address,
                rating: lead.rating,
                googlePlaceId: lead.placeId,
                phone: lead.phone,
                website: lead.website
            });

            setSavedLeads(prev => new Set([...prev, lead.placeId]));
            // Minimalist feedback could be better but sticking to alert for parity
        } catch (error) {
            console.error('Save error:', error);
            alert(error.response?.data?.message || 'Failed to save lead');
        }
    };

    return (
        <div className="lead-search">
            <div className="search-header">
                <h1 className="gradient-text">Lead Prospecting</h1>
                <p>Global business discovery powered by Google Maps Intelligence</p>
                <div className="tip-pill" style={{
                    marginTop: '1.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'rgba(99, 102, 241, 0.08)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    color: 'var(--primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    fontWeight: 600
                }}>
                    <FiInfo size={16} /> Google Maps provides instant access to Phone & Website data.
                </div>
            </div>

            {/* Search Form */}
            <div className="search-form-container">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-inputs">
                        <div className="form-group">
                            <label htmlFor="keyword">Target Industry / Service</label>
                            <input
                                type="text"
                                id="keyword"
                                className="input"
                                placeholder="e.g., HVAC repair, luxury hotels, dental clinics"
                                value={searchForm.keyword}
                                onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Target Location</label>
                            <input
                                type="text"
                                id="location"
                                className="input"
                                placeholder="e.g., Manila, Quezon City, or Makati"
                                value={searchForm.location}
                                onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                        {quota ? (
                            <div className="quota-info">
                                <span>API Credits: <strong className="quota-remaining">{quota.remaining.toLocaleString()}</strong> remaining</span>
                            </div>
                        ) : <div />}

                        <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', minWidth: '180px' }} disabled={loading}>
                            {loading && !nextPageToken ? 'Analyzing...' : <><FiSearch /> Execute Search</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Search Results */}
            {results.length > 0 && (
                <div className="search-results">
                    <div className="results-header">
                        <div>
                            <h2>Discovered {results.length} Prospects</h2>
                            <p>Premium business data extracted and ready for outreach</p>
                        </div>
                    </div>

                    <div className="results-grid">
                        {results.map((lead, index) => (
                            <div key={lead.placeId + index} className="lead-card glass-card lead-card-new">
                                <div className="lead-header">
                                    <h3>{lead.name}</h3>
                                    {savedLeads.has(lead.placeId) ? (
                                        <button className="btn-icon saved" disabled>
                                            <FiCheck /> Locked
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-icon"
                                            onClick={() => handleSaveLead(lead)}
                                            title="Save lead"
                                        >
                                            <FiPlus /> Save Lead
                                        </button>
                                    )}
                                </div>

                                <div className="lead-info">
                                    {lead.rating && (
                                        <div className="lead-rating">
                                            <FiStar fill="#fbbf24" stroke="#fbbf24" />
                                            <span>{lead.rating}</span>
                                            <span className="rating-count">({lead.userRatingsTotal} Reviews)</span>
                                        </div>
                                    )}

                                    {lead.address && (
                                        <div className="lead-detail">
                                            <FiMapPin />
                                            <span>{lead.address}</span>
                                        </div>
                                    )}

                                    {lead.phone && (
                                        <div className="lead-detail">
                                            <FiPhone style={{ color: 'var(--success)' }} />
                                            <span>{lead.phone}</span>
                                        </div>
                                    )}

                                    {lead.website && (
                                        <div className="lead-detail">
                                            <FiGlobe style={{ color: 'var(--accent)' }} />
                                            <a href={lead.website} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                                                {lead.website.replace(/^https?:\/\//, '').split('/')[0]}
                                            </a>
                                        </div>
                                    )}

                                    <div className="lead-types">
                                        {lead.types && lead.types.slice(0, 2).map(type => (
                                            <span key={type} className="type-badge">
                                                {type.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {nextPageToken && (
                        <div style={{ textAlign: 'center', marginTop: '60px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={handleLoadMore}
                                disabled={loading}
                                style={{ padding: '14px 40px' }}
                            >
                                {loading ? 'Fetching More...' : 'Load 20 More Prospects'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {results.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon-main">
                        <FiSearch className="empty-icon" />
                    </div>
                    <h3>Ready to find leads?</h3>
                    <p>Enter your target industry and location above to begin discovery</p>
                    <div className="search-examples">
                        <strong>Intelligence Suggestions:</strong>
                        <ul>
                            <li>"HVAC repair in Manila"</li>
                            <li>"Dental clinics in Quezon City"</li>
                            <li>"BPO companies in Makati"</li>
                            <li>"Restaurants in BGC, Taguig"</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadSearch;
