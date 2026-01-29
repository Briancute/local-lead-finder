import EmailTemplate from '../models/EmailTemplate.model.js';
import inMemoryDB from '../config/inMemoryDB.js';
import { isMongoDBConnected } from '../config/db.config.js';

/**
 * Get all templates for the logged-in user
 */
export const getTemplates = async (req, res) => {
    try {
        const userId = req.user.userId;
        let templates;

        if (isMongoDBConnected()) {
            templates = await EmailTemplate.find({ user_id: userId }).sort({ createdAt: -1 });
        } else {
            templates = await inMemoryDB.findTemplates(userId);
        }

        res.json({ templates });
    } catch (error) {
        console.error('Get templates error:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
};

/**
 * Create a new template
 */
export const createTemplate = async (req, res) => {
    try {
        const { name, subject, body, isDefault } = req.body;
        const userId = req.user.userId;

        if (!name || !body) {
            return res.status(400).json({ error: 'Name and body are required' });
        }

        let template;

        if (isMongoDBConnected()) {
            // Find current default and unset if this is new default
            if (isDefault) {
                await EmailTemplate.updateMany({ user_id: userId }, { is_default: false });
            }

            template = await EmailTemplate.create({
                user_id: userId,
                name,
                subject,
                body,
                is_default: isDefault || false
            });
        } else {
            template = await inMemoryDB.createTemplate({
                user_id: userId,
                name,
                subject,
                body,
                is_default: isDefault || false
            });
        }

        res.status(201).json({ message: 'Template created', template });
    } catch (error) {
        console.error('Create template error:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
};

/**
 * Update a template
 */
export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const userId = req.user.userId;

        let template;

        if (isMongoDBConnected()) {
            if (updates.is_default) {
                await EmailTemplate.updateMany({ user_id: userId, _id: { $ne: id } }, { is_default: false });
            }
            template = await EmailTemplate.findOneAndUpdate(
                { _id: id, user_id: userId },
                updates,
                { new: true }
            );
        } else {
            // In-memory update logic (simple extension)
            const allTemplates = await inMemoryDB.findTemplates(userId);
            template = allTemplates.find(t => t._id === id);
            if (template) {
                if (updates.is_default) {
                    allTemplates.forEach(t => { if (t._id !== id) t.is_default = false; });
                }
                Object.assign(template, updates, { updatedAt: new Date() });
            }
        }

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ message: 'Template updated', template });
    } catch (error) {
        console.error('Update template error:', error);
        res.status(500).json({ error: 'Failed to update template' });
    }
};

/**
 * Delete a template
 */
export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        let result;

        if (isMongoDBConnected()) {
            result = await EmailTemplate.findOneAndDelete({ _id: id, user_id: userId });
        } else {
            const index = inMemoryDB.emailTemplates.findIndex(t => t._id === id && t.user_id === userId);
            if (index > -1) {
                result = inMemoryDB.emailTemplates.splice(index, 1)[0];
            }
        }

        if (!result) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json({ message: 'Template deleted' });
    } catch (error) {
        console.error('Delete template error:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
};
