import React from 'react';

const MapPreview = ({ businessName, address }) => {
    // If no business name or address, don't show the map
    if (!businessName && !address) {
        return (
            <div className="map-placeholder glass-card" style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                color: 'rgba(255,255,255,0.4)',
                textAlign: 'center',
                padding: '20px'
            }}>
                <span style={{ fontSize: '40px' }}>📍</span>
                <p>Select a lead to preview its location</p>
            </div>
        );
    }

    const query = encodeURIComponent(`${businessName}, ${address}`);
    // Use the API key from environment variables (passed during build/provided in .env)
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyACZ9tWv_IDQ6uzynGTz7515bVyhRc7f2Y';
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`;

    return (
        <div className="map-preview-container" style={{ marginTop: '16px' }}>
            <div className="map-header" style={{ marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                    📍 Location Preview
                </h4>
            </div>
            <div className="glass-card" style={{ padding: '8px', overflow: 'hidden', height: '350px' }}>
                <iframe
                    title="Google Maps Preview"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: '8px' }}
                    src={embedUrl}
                    allowFullScreen
                ></iframe>
            </div>
            <p style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                Tip: Scroll to zoom, click pin for directions
            </p>
        </div>
    );
};

export default MapPreview;
