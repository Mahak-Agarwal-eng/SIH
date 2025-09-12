const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');


router.post('/upload', certificateController.uploadCertificate);
router.get('/verify/:rollNumber', certificateController.verifyCertificate);

module.exports = router;