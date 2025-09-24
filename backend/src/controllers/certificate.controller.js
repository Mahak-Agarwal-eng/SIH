const Certificate = require('../models/certificate');
const multer = require('multer');
const { verifyCertificateHash } = require('../services/blockchain.service');
const { verifyOnChainHash } = require('../services/onchain.service');
const { ocrExtract } = require('../services/ocr.service');

const storage = multer.memoryStorage();
const upload = multer({ storage });


// Accepts a file, computes hash, pretends OCR by using provided body fields or defaults,
// verifies hash against mock blockchain registry, then persists a record (optional).
const uploadCertificate = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Compute verification either via ONCHAIN_MODE or mock registry
            let verification;
            if (process.env.ONCHAIN_MODE === 'true') {
                // Compute hash according to configured algo: sha256 (default) or keccak256
                const algo = (process.env.HASH_ALGO || 'sha256').toLowerCase();
                let hash;
                if (algo === 'keccak256') {
                    const { keccak256 } = require('web3-utils');
                    // keccak256 expects a Buffer returns 0x-prefixed; strip 0x for consistency
                    const h = keccak256(req.file.buffer);
                    hash = h.startsWith('0x') ? h.slice(2) : h;
                } else {
                    const crypto = require('crypto');
                    hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
                }
                verification = await verifyOnChainHash(hash);
                verification.certificateHash = hash;
            } else {
                verification = await verifyCertificateHash(req.file.buffer);
            }

            // OCR extract
            const ocr = await ocrExtract(req.file.buffer, req.file.mimetype);

            // Use provided fields (simulating OCR+extraction) or demo defaults
            const payload = {
                studentName: req.body.studentName || ocr.studentName || verification.chainRecord?.studentName || 'Unknown',
                rollNumber: req.body.rollNumber || ocr.rollNumber || verification.chainRecord?.rollNumber || 'UNKNOWN',
                course: req.body.course || ocr.course || verification.chainRecord?.course || 'Unknown',
                institution: req.body.institution || ocr.institution || verification.chainRecord?.institution || 'Unknown',
                yearOfPassing: Number(req.body.yearOfPassing) || ocr.yearOfPassing || new Date().getFullYear(),
                certificateHash: verification.certificateHash,
                isVerified: verification.isAuthentic,
                documentUrl: ''
            };

            // Persist minimal record (demo)
            let certificate;
            try {
                certificate = new Certificate(payload);
                await certificate.save();
            } catch (e) {
                // Ignore duplicate/validation errors in demo, but still return verification result
            }

            return res.status(200).json({
                ok: true,
                verification,
                ocr,
                certificate: certificate || payload
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
];

const verifyCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ rollNumber: req.params.rollNumber });
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json(certificate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadCertificate,
    verifyCertificate
};