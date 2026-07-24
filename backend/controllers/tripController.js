const Trip = require('../models/Trip');
const { generateTripPlan } = require('../utils/geminiService');

// @desc    Generate a new AI trip plan and save it
// @route   POST /api/trips/generate
const generateTrip = async (req, res) => {
  try {
    const { source, destination, duration, budget, interests } = req.body;

    if (!source || !destination || !duration || !budget) {
      return res.status(400).json({
        message: 'Please provide source, destination, duration, and budget',
      });
    }

    const tripData = await generateTripPlan({
      source,
      destination,
      duration,
      budget,
      interests: interests || [],
    });

    const trip = await Trip.create({
      user: req.user._id,
      source,
      destination,
      duration,
      budget,
      interests: interests || [],
      tripData,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('Trip generation error:', error.message);
    res.status(500).json({
      message: 'Failed to generate trip plan. Please try again.',
      error: error.message,
    });
  }
};

// @desc    Get a single trip by ID (only if it belongs to the logged-in user)
// @route   GET /api/trips/:id
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Security check: make sure this trip belongs to the logged-in user
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this trip' });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { generateTrip, getTripById };