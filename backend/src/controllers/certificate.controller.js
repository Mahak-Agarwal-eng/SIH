const Certificate = require('../models/certificate');


const uploadCertificate = async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(201).json(certificate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

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