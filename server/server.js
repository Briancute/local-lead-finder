import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB, { isMongoDBConnected } from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import templateRoutes from './routes/template.routes.js';
import emailRoutes from './routes/email.routes.js';
import inMemoryDB from './config/inMemoryDB.js';
import User from './models/User.model.js';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://glowing-starlight-123.netlify.app',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Relaxed check for development and known netlify domain
        const isAllowed = allowedOrigins.some(o => origin.startsWith(o));

        if (!isAllowed) {
            console.log('🚫 CORS Refused Origin:', origin);
            var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (req, res) => {
    const stats = inMemoryDB.getStats();
    res.json({
        status: 'ok',
        message: 'LeadFinder API is running',
        database: 'MongoDB Atlas with In-Memory Fallback',
        inMemoryStats: stats,
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        // Try to connect to MongoDB Atlas
        try {
            await connectDB();
            console.log('💾 Using: MongoDB Atlas (Cloud Database)');
        } catch (dbError) {
            console.log('💾 Using: In-Memory Storage (Local Development)');
            console.log('');
            console.log('📌 To use MongoDB Atlas when deploying:');
            console.log('   1. Make sure MONGODB_URI is set in production environment');
            console.log('   2. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0');
            console.log('   3. Verify MongoDB cluster is active');
            console.log('');
        }

        // ALWAYS ensure demo user exists for evaluation
        try {
            await inMemoryDB.initDemoUser();

            if (isMongoDBConnected()) {
                // If Mongo is connected, also ensure demo user exists there
                const existing = await User.findOne({ email: 'demo@leadfinder.com' });
                if (!existing) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash('demo123', salt);
                    await User.create({
                        name: 'Demo User',
                        email: 'demo@leadfinder.com',
                        password_hash: hashedPassword,
                        api_quota_used: 0,
                        api_quota_limit: 1000
                    });
                    console.log('✅ Demo user seeded into MongoDB');
                }
            }
        } catch (initErr) {
            console.error('⚠️ User seeding warning:', initErr.message);
        }

        app.listen(PORT, () => {
            console.log('');
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Frontend: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
            console.log('');
            console.log('✅ Ready to accept requests!');
            console.log('');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
