const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    // 1. Who is asking for the blood? 
    // This is a special MongoDB trick that links this request directly to a User's ID
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    bloodGroupRequired: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    location: {
        type: String,
        required: true // Where do they need the blood? (e.g., "City Hospital")
    },
    urgency: {
        type: String,
        enum: ['normal', 'urgent', 'critical'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['pending', 'fulfilled'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('BloodRequest', requestSchema);