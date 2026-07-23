const express = require('express');
const router = express.Router();
const { generateTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateTrip);

module.exports = router;