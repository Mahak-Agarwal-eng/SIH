const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    yearOfPassing: {
        type: Number,
        required: true
    },
    certificateHash: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    documentUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Certificate', certificateSchema);