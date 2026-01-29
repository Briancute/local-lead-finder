import connectDB from './config/db.config.js';

// In-memory storage (Demo Mode fallback)
const inMemoryDB = {
    users: [],
    leads: [],
    emailTemplates: []
};

let isMongoDBConnected = false;

export const initDB = async () => {
    try {
        await connectDB();
        isMongoDBConnected = true;
        console.log('✅ Using MongoDB Atlas');
        return true;
    } catch (error) {
        console.log('⚠️  MongoDB Atlas unavailable, using IN-MEMORY DEMO MODE');
        console.log('📝 Data will NOT persist after restart');
        isMongoDBConnected = false;
        return false;
    }
};

export const isUsingMongoDB = () => isMongoDBConnected;
export const getInMemoryDB = () => inMemoryDB;
