import express from 'express';
import {
    searchLeads,
    getLeadDetails,
    saveLead,
    getLeads,
    updateLead,
    deleteLead,
    exportLeads
} from '../controllers/leads.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/leads/search
 * @desc    Search for leads using Google Maps API
 * @access  Private
 */
router.get('/search', searchLeads);

/**
 * @route   GET /api/leads/details/:placeId
 * @desc    Get detailed information for a place
 * @access  Private
 */
router.get('/details/:placeId', getLeadDetails);

/**
 * @route   POST /api/leads
 * @desc    Save a lead
 * @access  Private
 */
router.post('/', saveLead);

/**
 * @route   GET /api/leads
 * @desc    Get all saved leads
 * @access  Private
 */
router.get('/', getLeads);

/**
 * @route   PATCH /api/leads/:id
 * @desc    Update a lead
 * @access  Private
 */
router.patch('/:id', updateLead);

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete a lead
 * @access  Private
 */
router.delete('/:id', deleteLead);

/**
 * @route   GET /api/leads/export/csv
 * @desc    Export leads to CSV
 * @access  Private
 */
router.get('/export/csv', exportLeads);

export default router;
