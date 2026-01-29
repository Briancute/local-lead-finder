import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle responses
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ===== AUTH API =====
export const authAPI = {
    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// ===== LEADS API =====
export const leadsAPI = {
    search: async (keyword, location, pageToken = null) => {
        const params = { keyword };
        if (location) params.location = location;
        if (pageToken) params.pageToken = pageToken;
        const response = await api.get('/leads/search', { params });
        return response.data;
    },

    getDetails: async (placeId) => {
        const response = await api.get(`/leads/details/${placeId}`);
        return response.data;
    },

    save: async (leadData) => {
        const response = await api.post('/leads', leadData);
        return response.data;
    },

    getAll: async (filters = {}) => {
        const response = await api.get('/leads', { params: filters });
        return response.data;
    },

    update: async (id, updates) => {
        const response = await api.patch(`/leads/${id}`, updates);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/leads/${id}`);
        return response.data;
    },

    exportCSV: async () => {
        const response = await api.get('/leads/export/csv', {
            responseType: 'blob'
        });
        return response.data;
    }
};

// ===== TEMPLATES API =====
export const templatesAPI = {
    getAll: async () => {
        const response = await api.get('/templates');
        return response.data;
    },

    create: async (templateData) => {
        const response = await api.post('/templates', templateData);
        return response.data;
    },

    update: async (id, updates) => {
        const response = await api.patch(`/templates/${id}`, updates);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/templates/${id}`);
        return response.data;
    }
};

export const emailAPI = {
    send: async (to, subject, body) => {
        const response = await api.post('/email/send', { to, subject, body });
        return response.data;
    }
};

export default api;
