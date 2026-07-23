const Trip = require('../models/Trip');
const { generateTripPlan } = require('../utils/geminiService');

// @desc    Generate a new AI trip plan and save it
// @route   POST /api/trips/generate
const generateTrip = async (req, res) => {
  try {
    const { source, destination, duration, budget, interests } = req.body;

    // Basic validation
    if (!source || !destination || !duration || !budget) {
      return res.status(400).json({
        message: 'Please provide source, destination, duration, and budget',
      });
    }

    // Call Gemini to generate the trip plan
    const tripData = await generateTripPlan({
      source,
      destination,
      duration,
      budget,
      interests: interests || [],
    });

    // Save the trip to MongoDB, linked to the logged-in user
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

module.exports = { generateTrip };