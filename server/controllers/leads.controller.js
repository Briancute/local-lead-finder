import { searchPlaces, getPlaceDetails } from '../config/googleMaps.config.js';
import Lead from '../models/Lead.model.js';
import User from '../models/User.model.js';
import inMemoryDB from '../config/inMemoryDB.js';
import { isMongoDBConnected } from '../config/db.config.js';

const usingMongo = () => isMongoDBConnected();

/**
 * Search for leads using Google Maps API
 */
export const searchLeads = async (req, res) => {
    try {
        const { keyword, location } = req.query;

        if (!keyword) {
            return res.status(400).json({
                error: 'Missing keyword',
                message: 'Search keyword is required'
            });
        }

        // Build search query (only if not paginating)
        const { pageToken } = req.query;
        let searchQuery = null;
        if (!pageToken) {
            searchQuery = location ? `${keyword} in ${location}` : keyword;
        }

        // Search using Google Maps API
        const { results, nextPageToken } = await searchPlaces(searchQuery, pageToken);

        // Increment user's API quota
        if (usingMongo()) {
            await User.findByIdAndUpdate(req.user.userId, { $inc: { api_quota_used: 1 } });
        } else {
            const user = await inMemoryDB.findUserById(req.user.userId);
            if (user) {
                user.api_quota_used = (user.api_quota_used || 0) + 1;
            }
        }

        // Get updated quota
        const user = usingMongo()
            ? await User.findById(req.user.userId)
            : await inMemoryDB.findUserById(req.user.userId);

        res.json({
            results,
            nextPageToken,
            quota: {
                used: user.api_quota_used,
                limit: user.api_quota_limit,
                remaining: user.api_quota_limit - user.api_quota_used
            }
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            error: 'Search failed',
            message: error.message || 'An error occurred during search'
        });
    }
};

/**
 * Get detailed information for a place
 */
export const getLeadDetails = async (req, res) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                error: 'Missing place ID',
                message: 'Place ID is required'
            });
        }

        const details = await getPlaceDetails(placeId);

        res.json({ lead: details });
    } catch (error) {
        console.error('Get details error:', error);
        res.status(500).json({
            error: 'Failed to get details',
            message: error.message
        });
    }
};

/**
 * Save a lead to user's collection
 */
export const saveLead = async (req, res) => {
    try {
        let {
            businessName,
            address,
            phone,
            website,
            rating,
            googlePlaceId
        } = req.body;

        if (!businessName) {
            return res.status(400).json({
                error: 'Missing business name',
                message: 'Business name is required'
            });
        }

        // Automatically fetch details if phone or website is missing and we have a placeId
        if (googlePlaceId && (!phone || !website)) {
            try {
                console.log(`🔍 Fetching details for ${googlePlaceId} to complete lead data...`);
                const details = await getPlaceDetails(googlePlaceId);
                if (details) {
                    phone = phone || details.phone;
                    website = website || details.website;
                    address = address || details.address;
                    rating = rating || details.rating;
                }
            } catch (detailError) {
                console.warn('⚠️ Could not fetch extra details for lead:', detailError.message);
            }
        }

        const leadData = {
            user_id: req.user.userId,
            business_name: businessName,
            address,
            phone,
            website,
            rating,
            google_place_id: googlePlaceId,
            status: 'New'
        };

        let lead;

        if (usingMongo()) {
            // Check if lead already exists
            const existing = await Lead.findOne({
                user_id: req.user.userId,
                google_place_id: googlePlaceId
            });

            if (existing) {
                return res.status(409).json({
                    error: 'Lead already saved',
                    message: 'This lead is already in your collection'
                });
            }

            lead = await Lead.create(leadData);
        } else {
            // Check if lead already exists
            const existing = await inMemoryDB.findLeads({
                user_id: req.user.userId,
                google_place_id: googlePlaceId
            });

            if (existing.length > 0) {
                return res.status(409).json({
                    error: 'Lead already saved',
                    message: 'This lead is already in your collection'
                });
            }

            lead = await inMemoryDB.createLead(leadData);
        }

        res.status(201).json({
            message: 'Lead saved successfully',
            lead
        });
    } catch (error) {
        console.error('Save lead error:', error);
        res.status(500).json({
            error: 'Failed to save lead',
            message: error.message
        });
    }
};

/**
 * Get all saved leads for current user
 */
export const getLeads = async (req, res) => {
    try {
        const { status, search } = req.query;

        let leads;

        if (usingMongo()) {
            const query = { user_id: req.user.userId };

            if (status) query.status = status;
            if (search) query.business_name = { $regex: search, $options: 'i' };

            leads = await Lead.find(query).sort({ createdAt: -1 });
        } else {
            const query = { user_id: req.user.userId };

            if (status) query.status = status;
            if (search) query.business_name = `%${search}%`;

            leads = await inMemoryDB.findLeads(query);
        }

        res.json({
            leads,
            count: leads.length
        });
    } catch (error) {
        console.error('Get leads error:', error);
        res.status(500).json({
            error: 'Failed to fetch leads',
            message: error.message
        });
    }
};

/**
 * Update a lead
 */
export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, tags, notes, refreshDetails } = req.body;

        let updates = {};
        if (status) updates.status = status;
        if (tags) updates.tags = tags;
        if (notes !== undefined) updates.notes = notes;

        // Fetch details from Google if requested
        if (refreshDetails) {
            try {
                // Get existing lead to get placeId
                let existingLeads;
                if (usingMongo()) {
                    existingLeads = [await Lead.findById(id)];
                } else {
                    existingLeads = await inMemoryDB.findLeads({ _id: id });
                }

                const existing = existingLeads[0];
                if (existing && existing.google_place_id) {
                    const details = await getPlaceDetails(existing.google_place_id);
                    if (details) {
                        updates.phone = details.phone;
                        updates.website = details.website;
                        updates.address = details.address;
                        updates.rating = details.rating;
                    }
                }
            } catch (err) {
                console.error('Failed to refresh details:', err);
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                error: 'No updates provided'
            });
        }

        let lead;

        if (usingMongo()) {
            lead = await Lead.findOneAndUpdate(
                { _id: id, user_id: req.user.userId },
                updates,
                { new: true }
            );
        } else {
            lead = await inMemoryDB.updateLead(id, req.user.userId, updates);
        }

        if (!lead) {
            return res.status(404).json({
                error: 'Lead not found'
            });
        }

        res.json({
            message: 'Lead updated successfully',
            lead
        });
    } catch (error) {
        console.error('Update lead error:', error);
        res.status(500).json({
            error: 'Failed to update lead',
            message: error.message
        });
    }
};

/**
 * Delete a lead
 */
export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        let lead;

        if (usingMongo()) {
            lead = await Lead.findOneAndDelete({
                _id: id,
                user_id: req.user.userId
            });
        } else {
            lead = await inMemoryDB.deleteLead(id, req.user.userId);
        }

        if (!lead) {
            return res.status(404).json({
                error: 'Lead not found'
            });
        }

        res.json({
            message: 'Lead deleted successfully'
        });
    } catch (error) {
        console.error('Delete lead error:', error);
        res.status(500).json({
            error: 'Failed to delete lead',
            message: error.message
        });
    }
};

/**
 * Export leads to CSV
 */
export const exportLeads = async (req, res) => {
    try {
        let leads;

        if (usingMongo()) {
            leads = await Lead.find({ user_id: req.user.userId }).sort({ createdAt: -1 });
        } else {
            leads = await inMemoryDB.findLeads({ user_id: req.user.userId });
        }

        // Build CSV
        const headers = ['Business Name', 'Address', 'Phone', 'Website', 'Rating', 'Status', 'Tags', 'Notes', 'Created At'];
        const csvRows = [headers.join(',')];

        leads.forEach(lead => {
            const row = [
                `"${lead.business_name || ''}"`,
                `"${lead.address || ''}"`,
                `"${lead.phone || ''}"`,
                `"${lead.website || ''}"`,
                lead.rating || '',
                `"${lead.status || ''}"`,
                `"${lead.tags ? lead.tags.join('; ') : ''}"`,
                `"${lead.notes || ''}"`,
                lead.createdAt
            ];
            csvRows.push(row.join(','));
        });

        const csv = csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({
            error: 'Failed to export leads',
            message: error.message
        });
    }
};
