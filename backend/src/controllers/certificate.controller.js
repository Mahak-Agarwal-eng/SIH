const Certificate = require('../models/certificate');
const multer = require('multer');
const crypto = require('crypto');

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

            // Find certificate by hash in MongoDB
            const certificate = await Certificate.findOne({ certificateHash: uploadedHash });

            if (!certificate) {
                return res.status(404).json({
                    isVerified: false,
                    message: 'Certificate not found on blockchain'
                });
            }

            // Simulate blockchain verification
            const verification = await simulateBlockchainVerification(uploadedHash);

            return res.status(200).json({
                isVerified: true,
                message: 'Certificate verified on blockchain',
                blockchainData: certificate.blockchainData,
                verification,
                certificate
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

module.exports = {
    uploadCertificate,
    verifyCertificate
};
