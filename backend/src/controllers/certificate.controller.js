const Certificate = require('../models/certificate');
const multer = require('multer');
const crypto = require('crypto');
const { enhancedOcrExtract } = require('../services/ocr.service');
const { verifyCertificateFromChain } = require('../services/ganache.service');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Simulated blockchain verification
const simulateBlockchainVerification = async (hash) => {
    return {
        isAuthentic: true,
        certificateHash: hash,
        blockNumber: Math.floor(Math.random() * 1000000), // Simulate block number
        timestamp: Date.now(),
        chainRecord: {
            transactionHash: '0x' + crypto.randomBytes(32).toString('hex')
        }
    };
};

const uploadCertificate = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Generate hash using SHA-256
            const hash = crypto.createHash('sha256')
                .update(req.file.buffer)
                .digest('hex');

            // Simulate blockchain verification
            const verification = await simulateBlockchainVerification(hash);

            // Create certificate payload
            const payload = {
                studentName: req.body.studentName || 'Unknown',
                rollNumber: req.body.rollNumber || 'UNKNOWN',
                course: req.body.course || 'Unknown',
                institution: req.body.institution || 'Unknown',
                yearOfPassing: Number(req.body.yearOfPassing) || new Date().getFullYear(),
                certificateHash: hash,
                isVerified: true,
                documentUrl: '',
                blockchainData: { // Store simulated blockchain data
                    blockNumber: verification.blockNumber,
                    transactionHash: verification.chainRecord.transactionHash,
                    timestamp: verification.timestamp
                }
            };

            // Save to MongoDB
            const certificate = new Certificate(payload);
            await certificate.save();

            return res.status(200).json({
                ok: true,
                message: 'Certificate stored on blockchain (simulated) and database',
                verification,
                certificate
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
];

const verifyCertificate = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Generate hash of uploaded file
            const uploadedHash = crypto.createHash('sha256')
                .update(req.file.buffer)
                .digest('hex');

            // Extract OCR data from uploaded file
            const uploadedOcrData = await enhancedOcrExtract(req.file.buffer, req.file.mimetype);

            // Verify against blockchain
            const verification = await verifyCertificateFromChain(uploadedHash, uploadedOcrData);

            return res.status(200).json({
                verification,
                uploadedOcrData,
                certificateHash: uploadedHash
            });
        } catch (error) {
            console.error('Verification error:', error);
            return res.status(500).json({ 
                message: error.message,
                verification: {
                    isAuthentic: false,
                    confidence: 0.0,
                    details: 'Verification service error',
                    forgedFields: [],
                    blockchainData: null
                }
            });
        }
    }
];

module.exports = {
    uploadCertificate,
    verifyCertificate
};
