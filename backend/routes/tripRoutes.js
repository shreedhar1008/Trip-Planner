const express = require('express');
const router = express.Router();
const { generateTrip, getTripById } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateTrip);
router.get('/:id', protect, getTripById);

module.exports = router;