const express = require('express');
const router = express.Router();
const { uploadAndStore } = require('../controllers/admin.controller');

router.post('/upload', uploadAndStore);

module.exports = router;



