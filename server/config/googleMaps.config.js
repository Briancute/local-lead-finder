import { Client } from '@googlemaps/google-maps-services-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const googleMapsClient = new Client({});
const DEMO_MODE = !process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY === 'your_google_maps_api_key_here';

// Sample Philippine business data for demo mode
const DEMO_BUSINESSES = [
    {
        name: 'Jollibee Makati',
        address: '6750 Ayala Avenue, Makati, Metro Manila',
        placeId: 'demo_jollibee_makati_1',
        rating: 4.5,
        userRatingsTotal: 1234,
        types: ['restaurant', 'food', 'fast_food']
    },
    {
        name: 'Starbucks BGC',
        address: '5th Ave, Taguig, Metro Manila',
        placeId: 'demo_starbucks_bgc_1',
        rating: 4.3,
        userRatingsTotal: 856,
        types: ['cafe', 'coffee_shop', 'food']
    },
    {
        name: 'The Coffee Bean & Tea Leaf',
        address: 'SM Mall of Asia, Pasay City',
        placeId: 'demo_coffee_bean_moa_1',
        rating: 4.4,
        userRatingsTotal: 456,
        types: ['cafe', 'coffee_shop']
    },
    {
        name: 'Vikings Luxury Buffet',
        address: 'SM Megamall, Mandaluyong City',
        placeId: 'demo_vikings_megamall_1',
        rating: 4.6,
        userRatingsTotal: 2341,
        types: ['restaurant', 'buffet', 'food']
    },
    {
        name: 'Manam Comfort Filipino',
        address: 'Greenbelt 2, Makati City',
        placeId: 'demo_manam_greenbelt_1',
        rating: 4.7,
        userRatingsTotal: 1876,
        types: ['restaurant', 'filipino_restaurant', 'food']
    },
    {
        name: 'Fitness First Ortigas',
        address: 'Robinsons Galleria, Ortigas Center',
        placeId: 'demo_fitness_first_ortigas_1',
        rating: 4.2,
        userRatingsTotal: 543,
        types: ['gym', 'fitness_center', 'health']
    },
    {
        name: 'Gold\'s Gym Quezon City',
        address: 'SM North EDSA, Quezon City',
        placeId: 'demo_golds_gym_qc_1',
        rating: 4.4,
        userRatingsTotal: 789,
        types: ['gym', 'fitness_center']
    },
    {
        name: 'Healthy Options Bonifacio',
        address: 'BGC, Taguig City',
        placeId: 'demo_healthy_options_bgc_1',
        rating: 4.5,
        userRatingsTotal: 234,
        types: ['health_food_store', 'organic_shop']
    },
    {
        name: 'Toby\'s Sports Manila',
        address: 'Glorietta, Makati City',
        placeId: 'demo_tobys_sports_makati_1',
        rating: 4.3,
        userRatingsTotal: 456,
        types: ['sporting_goods_store', 'store']
    },
    {
        name: 'Smile Dental Clinic',
        address: '123 Katipunan Ave, Quezon City',
        placeId: 'demo_smile_dental_qc_1',
        rating: 4.8,
        userRatingsTotal: 167,
        types: ['dentist', 'health', 'medical']
    },
    {
        name: 'Modern Dental Care',
        address: 'Alabang Town Center, Muntinlupa',
        placeId: 'demo_modern_dental_alabang_1',
        rating: 4.6,
        userRatingsTotal: 234,
        types: ['dentist', 'health']
    },
    {
        name: 'Max\'s Restaurant',
        address: 'Multiple Locations, Metro Manila',
        placeId: 'demo_maxs_restaurant_1',
        rating: 4.5,
        userRatingsTotal: 3456,
        types: ['restaurant', 'filipino_restaurant']
    }
];

/**
 * Search for places using Google Maps API or Demo Mode
 */
export const searchPlaces = async (query, pageToken = null) => {
    // Demo Mode - Return sample data
    if (DEMO_MODE) {
        console.log('🎭 DEMO MODE: Returning sample business data');

        // Filter businesses based on query keywords
        const keywords = query.toLowerCase().split(' ');
        let results = DEMO_BUSINESSES;

        // Simple keyword matching
        if (keywords.some(k => ['restaurant', 'food', 'resto'].includes(k))) {
            results = DEMO_BUSINESSES.filter(b =>
                b.types.some(t => ['restaurant', 'food', 'buffet', 'filipino_restaurant'].includes(t))
            );
        } else if (keywords.some(k => ['coffee', 'cafe', 'starbucks'].includes(k))) {
            results = DEMO_BUSINESSES.filter(b =>
                b.types.some(t => ['cafe', 'coffee_shop'].includes(t))
            );
        } else if (keywords.some(k => ['gym', 'fitness'].includes(k))) {
            results = DEMO_BUSINESSES.filter(b =>
                b.types.includes('gym') || b.types.includes('fitness_center')
            );
        } else if (keywords.some(k => ['dentist', 'dental', 'clinic'].includes(k))) {
            results = DEMO_BUSINESSES.filter(b =>
                b.types.includes('dentist')
            );
        }

        // Simulate pagination in demo mode
        return {
            results: results.slice(0, 10),
            nextPageToken: null
        };
    }

    // Real Google Maps API Mode
    try {
        const params = {
            key: process.env.GOOGLE_MAPS_API_KEY
        };

        if (pageToken) {
            params.pagetoken = pageToken;
        } else {
            params.query = query;
            // Bias results towards the Philippines
            params.region = 'ph';
        }

        const response = await googleMapsClient.textSearch({
            params,
            region: 'ph', // Explicitly set region bias
            timeout: 10000
        });

        if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
            throw new Error(`Google Maps API error: ${response.data.status}`);
        }

        const results = response.data.results.map(place => ({
            name: place.name,
            address: place.formatted_address,
            placeId: place.place_id,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            types: place.types
        }));

        return {
            results,
            nextPageToken: response.data.next_page_token || null
        };
    } catch (error) {
        console.error('Google Maps API error:', error.message);
        throw error;
    }
};

/**
 * Get detailed information for a specific place
 */
export const getPlaceDetails = async (placeId) => {
    // Demo Mode - Return detailed mock data
    if (DEMO_MODE) {
        console.log('🎭 DEMO MODE: Returning sample place details');

        const business = DEMO_BUSINESSES.find(b => b.placeId === placeId);

        if (business) {
            return {
                ...business,
                phone: '+63 2 1234 5678',
                website: 'https://example.com',
                openingHours: 'Mon-Sun: 10:00 AM - 10:00 PM'
            };
        }

        return null;
    }

    // Real Google Maps API Mode
    try {
        const response = await googleMapsClient.placeDetails({
            params: {
                place_id: placeId,
                key: process.env.GOOGLE_MAPS_API_KEY,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'opening_hours']
            },
            timeout: 10000
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Google Maps API error: ${response.data.status}`);
        }

        const place = response.data.result;

        return {
            name: place.name,
            address: place.formatted_address,
            phone: place.formatted_phone_number,
            website: place.website,
            rating: place.rating,
            openingHours: place.opening_hours?.weekday_text?.join(', ')
        };
    } catch (error) {
        console.error('Google Maps API error:', error.message);
        throw error;
    }
};

// Log which mode we're using on startup
if (DEMO_MODE) {
    console.log('🎭 Google Maps: DEMO MODE (using sample data)');
    console.log('💡 To use real Google Maps API, add GOOGLE_MAPS_API_KEY to .env');
} else {
    console.log('🗺️  Google Maps: API MODE (using real data)');
}
