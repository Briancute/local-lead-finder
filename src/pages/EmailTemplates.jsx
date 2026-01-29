import React, { useState, useEffect } from 'react';
import { templatesAPI } from '../utils/api';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX, FiCheck } from 'react-icons/fi';
import { gsap } from 'gsap';
import './EmailTemplates.css';

const EmailTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTemplate, setCurrentTemplate] = useState({ name: '', subject: '', body: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            setLoading(true);
            const data = await templatesAPI.getAll();
            setTemplates(data.templates || []);

            setTimeout(() => {
                gsap.from('.template-card', {
                    opacity: 0,
                    scale: 0.95,
                    y: 20,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }, 100);
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const response = await templatesAPI.update(editingId, currentTemplate);
                setTemplates(templates.map(t => t._id === editingId ? response.template : t));
            } else {
                const response = await templatesAPI.create(currentTemplate);
                setTemplates([response.template, ...templates]);
            }
            resetForm();
        } catch (error) {
            console.error('Error saving template:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this template?')) return;
        try {
            await templatesAPI.delete(id);
            setTemplates(templates.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting template:', error);
        }
    };

    const handleEdit = (template) => {
        setCurrentTemplate({
            name: template.name,
            subject: template.subject,
            body: template.body
        });
        setEditingId(template._id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setCurrentTemplate({ name: '', subject: '', body: '' });
        setEditingId(null);
        setIsEditing(false);
    };

    return (
        <div className="templates-page">
            <div className="templates-header">
                <div>
                    <h1>Email Templates</h1>
                    <p>Create and manage your outreach messages</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <FiPlus /> New Template
                    </button>
                )}
            </div>

            {isEditing && (
                <div className="glass-card editor-card">
                    <h2>
                        {editingId ? 'Edit Template' : 'Create New Template'}
                    </h2>
                    <form onSubmit={handleSave}>
                        <div className="form-group grid-2">
                            <div>
                                <label>Template Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Initial Outreach - Restaurants"
                                    value={currentTemplate.name}
                                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Subject Line</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Question about {{business_name}}"
                                    value={currentTemplate.subject}
                                    onChange={(e) => setCurrentTemplate({ ...currentTemplate, subject: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email Body</label>
                            <textarea
                                rows="8"
                                placeholder="Use {{business_name}} as a variable..."
                                value={currentTemplate.body}
                                onChange={(e) => setCurrentTemplate({ ...currentTemplate, body: e.target.value })}
                                required
                            ></textarea>
                            <div className="variable-tip">
                                💡 Tip: Use <code>{"{{business_name}}"}</code> to automatically personal the message.
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                <FiSave /> {editingId ? 'Update Template' : 'Create Template'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                <FiX /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="templates-grid">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="glass-card loading-skeleton" style={{ height: '200px' }}></div>)
                ) : templates.length === 0 ? (
                    <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>You haven't created any templates yet.</p>
                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Create Your First Template</button>
                    </div>
                ) : (
                    templates.map((template) => (
                        <div key={template._id} className="glass-card template-card">
                            <div className="template-card-header">
                                <h3 className="template-name">{template.name}</h3>
                                <div className="template-actions">
                                    <button className="action-btn" title="Edit" onClick={() => handleEdit(template)}>
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button className="action-btn delete" title="Delete" onClick={() => handleDelete(template._id)}>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="template-info">
                                <p className="template-subject">
                                    <strong>Sub:</strong> {template.subject}
                                </p>
                                <p className="template-preview">
                                    {template.body}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmailTemplates;
