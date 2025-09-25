const multer = require('multer');
const crypto = require('crypto');
const { enhancedOcrExtract } = require('../services/ocr.service');
const { storeCertificateOnChain } = require('../services/ganache.service');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadAndStore = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
            
            // Compute SHA256 hash of the file
            const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
            
            // Extract OCR data
            const ocrData = await enhancedOcrExtract(req.file.buffer, req.file.mimetype);
            
            // Store on blockchain
            const blockchainResult = await storeCertificateOnChain(hash, ocrData);
            
            return res.status(200).json({ 
                ok: true, 
                hash, 
                ocrData,
                txHash: blockchainResult.txHash,
                blockNumber: blockchainResult.blockNumber,
                gasUsed: blockchainResult.gasUsed,
                message: 'Certificate stored successfully on blockchain'
            });
        } catch (err) {
            console.error('Admin upload error:', err);
            return res.status(500).json({ ok: false, message: err.message });
        }
    }
];

module.exports = { uploadAndStore };


