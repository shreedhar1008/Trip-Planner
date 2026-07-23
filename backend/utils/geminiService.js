const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateTripPlan = async ({ source, destination, duration, budget, interests }) => {
  const prompt = `You are a professional travel planner. Generate a complete, detailed trip plan based on these details:

- Source city: ${source}
- Destination: ${destination}
- Duration: ${duration} days
- Budget level: ${budget}
- Areas of interest: ${interests.join(', ') || 'general sightseeing'}

Return ONLY valid JSON (no markdown, no code fences, no extra text before or after) matching EXACTLY this structure:

{
  "tripTitle": "string",
  "destination": "string",
  "duration": "string",
  "budget": "string",
  "overview": "string (2-3 sentences)",
  "days": [
    {
      "day": 1,
      "title": "string",
      "places": [
        {
          "name": "string",
          "description": "string",
          "timing": "string",
          "entryFee": "string",
          "coordinates": {"lat": 0.0, "lng": 0.0},
          "category": "string",
          "tips": "string"
        }
      ],
      "meals": {"breakfast": "string", "lunch": "string", "dinner": "string"},
      "estimatedCost": "string"
    }
  ],
  "hotels": [
    {
      "name": "string",
      "area": "string",
      "priceRange": "string",
      "rating": "string",
      "amenities": ["string"],
      "coordinates": {"lat": 0.0, "lng": 0.0},
      "description": "string"
    }
  ],
  "totalEstimatedBudget": "string",
  "packingList": ["string"],
  "travelTips": ["string"],
  "bestTimeToVisit": "string",
  "localTransport": "string"
}

Generate exactly ${duration} entries in the "days" array. Provide 3-4 hotel options. Use realistic coordinates for actual places in ${destination}. Be specific and practical, not generic.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  });

  const rawText = response.text;

  try {
    return JSON.parse(rawText);
  } catch (error) {
    throw new Error('Gemini returned invalid JSON. Please try again.');
  }
};

module.exports = { generateTripPlan };