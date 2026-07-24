const { geocodePlace } = require('../utils/geocodeService');

// @desc    Get coordinates for a place name
// @route   GET /api/geocode?place=PlaceName
const getCoordinates = async (req, res) => {
  try {
    const { place } = req.query;

    if (!place) {
      return res.status(400).json({ message: 'Please provide a place name using ?place=' });
    }

    const result = await geocodePlace(place);

    if (!result) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCoordinates };