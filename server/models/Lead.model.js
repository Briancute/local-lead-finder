import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    website: {
        type: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    google_place_id: {
        type: String
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Qualified', 'Closed', 'Not Interested'],
        default: 'New'
    },
    tags: [{
        type: String
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for faster queries
leadSchema.index({ user_id: 1, createdAt: -1 });
leadSchema.index({ user_id: 1, google_place_id: 1 });
leadSchema.index({ user_id: 1, status: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
