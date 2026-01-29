import mongoose from 'mongoose';

const emailTemplateSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    is_default: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
emailTemplateSchema.index({ user_id: 1 });

const EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);

export default EmailTemplate;
