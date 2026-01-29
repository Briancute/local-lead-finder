import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password_hash: {
        type: String,
        required: true
    },
    api_quota_used: {
        type: Number,
        default: 0
    },
    api_quota_limit: {
        type: Number,
        default: 1000
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
