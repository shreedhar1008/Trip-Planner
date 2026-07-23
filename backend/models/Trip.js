const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // number of days
      required: true,
    },
    budget: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    interests: {
      type: [String], // e.g., ["adventure", "food", "culture"]
      default: [],
    },
    tripData: {
      type: Object, // the full structured JSON response from Gemini
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);