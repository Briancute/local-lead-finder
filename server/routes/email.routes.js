import express from 'express';
import { sendEmail } from '../controllers/email.controller.js';
import { authenticateToken as protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All outreach routes protected by auth
router.post('/send', protect, sendEmail);

export default router;
