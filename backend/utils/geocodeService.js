const axios = require('axios');

// Uses OpenStreetMap's free Nominatim API - no key required
const geocodePlace = async (placeName) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: placeName,
        format: 'json',
        limit: 1,
      },
      headers: {
        // Nominatim requires a descriptive User-Agent - it's a free public service, be a good citizen
        'User-Agent': 'TripPlannerApp/1.0 (learning project)',
      },
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        displayName: result.display_name,
      };
    }

    return null; // no results found
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
};

module.exports = { geocodePlace };