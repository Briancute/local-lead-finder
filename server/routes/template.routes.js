import express from 'express';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../controllers/template.controller.js';
import { authenticateToken as protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getTemplates);
router.post('/', createTemplate);
router.patch('/:id', updateTemplate);
router.delete('/:id', deleteTemplate);

export default router;
