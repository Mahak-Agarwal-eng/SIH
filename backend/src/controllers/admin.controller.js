const multer = require('multer');
const { storeHashOnChain } = require('../services/onchain-write.service');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadAndStore = [
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
            const algo = (process.env.HASH_ALGO || 'sha256').toLowerCase();
            let hash;
            if (algo === 'keccak256') {
                const { keccak256 } = require('web3-utils');
                const h = keccak256(req.file.buffer);
                hash = h.startsWith('0x') ? h.slice(2) : h;
            } else {
                const crypto = require('crypto');
                hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
            }

            const receipt = await storeHashOnChain(hash);
            return res.status(200).json({ ok: true, hash, txHash: receipt.transactionHash, receipt });
        } catch (err) {
            return res.status(500).json({ ok: false, message: err.message });
        }
    }
];

module.exports = { uploadAndStore };


