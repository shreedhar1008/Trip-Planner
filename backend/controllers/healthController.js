const mongoose = require('mongoose');

// @desc    Check server and database health
// @route   GET /api/health
const checkHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

  res.status(200).json({
    server: 'Running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
};

module.exports = { checkHealth };