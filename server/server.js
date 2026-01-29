import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.config.js';
import authRoutes from './routes/auth.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import templateRoutes from './routes/template.routes.js';
import emailRoutes from './routes/email.routes.js';
import inMemoryDB from './config/inMemoryDB.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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

            // Initialize demo user for in-memory database
            await inMemoryDB.initDemoUser();
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
