// In-memory database (fallback when MongoDB Atlas is unavailable)
// Data structure mimics MongoDB documents

class InMemoryDB {
    constructor() {
        this.users = [];
        this.leads = [];
        this.emailTemplates = [];
        this.nextUserId = 1;
        this.nextLeadId = 1;
        this.nextTemplateId = 1;
    }

    // User operations
    async createUser(userData) {
        const user = {
            _id: String(this.nextUserId++),
            ...userData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.users.push(user);
        return user;
    }

    async findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }

    async findUserById(id) {
        return this.users.find(u => u._id === id);
    }

    async updateUser(id, updates) {
        const user = this.users.find(u => u._id === id);
        if (user) {
            Object.assign(user, updates, { updatedAt: new Date() });
        }
        return user;
    }

    // Lead operations
    async createLead(leadData) {
        const lead = {
            _id: String(this.nextLeadId++),
            ...leadData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.leads.push(lead);
        return lead;
    }

    async findLeads(query) {
        let results = this.leads.filter(lead => lead.user_id === query.user_id);

        if (query.status) {
            results = results.filter(lead => lead.status === query.status);
        }

        if (query.business_name) {
            const regex = new RegExp(query.business_name.replace('%', ''), 'i');
            results = results.filter(lead => regex.test(lead.business_name));
        }

        if (query.google_place_id) {
            results = results.filter(lead => lead.google_place_id === query.google_place_id);
        }

        return results.sort((a, b) => b.createdAt - a.createdAt);
    }

    async findLeadById(id, userId) {
        return this.leads.find(l => l._id === id && l.user_id === userId);
    }

    async updateLead(id, userId, updates) {
        const lead = this.leads.find(l => l._id === id && l.user_id === userId);
        if (lead) {
            Object.assign(lead, updates, { updatedAt: new Date() });
        }
        return lead;
    }

    async deleteLead(id, userId) {
        const index = this.leads.findIndex(l => l._id === id && l.user_id === userId);
        if (index > -1) {
            return this.leads.splice(index, 1)[0];
        }
        return null;
    }

    // Email template operations
    async createTemplate(templateData) {
        const template = {
            _id: String(this.nextTemplateId++),
            ...templateData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.emailTemplates.push(template);
        return template;
    }

    async findTemplates(userId) {
        return this.emailTemplates.filter(t => t.user_id === userId);
    }

    // Stats
    getStats() {
        return {
            users: this.users.length,
            leads: this.leads.length,
            templates: this.emailTemplates.length
        };
    }

    async initDemoUser() {
        // Check if demo user already exists
        const existing = await this.findUserByEmail('demo@leadfinder.com');
        if (existing) {
            console.log('✅ Demo user already exists');
            return;
        }

        // Create demo user with password: demo123 (hashed)
        try {
            const bcrypt = await import('bcryptjs');
            const salt = await bcrypt.default.genSalt(10);
            const hashedPassword = await bcrypt.default.hash('demo123', salt);

            const demoUser = {
                _id: String(this.nextUserId++),
                name: 'Demo User',
                email: 'demo@leadfinder.com',
                password_hash: hashedPassword,
                api_quota_used: 5,
                api_quota_limit: 1000,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            this.users.push(demoUser);
            console.log('✅ Demo user created dynamically!');
            console.log('📧 Email: demo@leadfinder.com');
            console.log('🔑 Password: demo123');
        } catch (err) {
            console.error('❌ Failed to create demo user:', err);
        }
    }
}

export default new InMemoryDB();
