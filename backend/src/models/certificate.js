const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    studentName: String,
    rollNumber: String,
    course: String,
    institution: String,
    yearOfPassing: Number,
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
    blockchainData: {
        blockNumber: Number,
        transactionHash: String,
        timestamp: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);