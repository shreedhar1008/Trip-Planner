const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Small helper to pause execution for a bit before retrying
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const rawText = response.text;
      return JSON.parse(rawText);
    } catch (error) {
      lastError = error;
      const isOverloaded = error.message?.includes('UNAVAILABLE') || error.message?.includes('503');

      if (isOverloaded && attempt < maxRetries) {
        console.log(`Gemini overloaded, retrying... (attempt ${attempt}/${maxRetries})`);
        await sleep(2000 * attempt); // wait 2s, then 4s, then 6s
        continue;
      }

      // Not a retryable error, or we've run out of retries
      break;
    }
  }

  throw new Error(
    lastError.message?.includes('UNAVAILABLE') || lastError.message?.includes('503')
      ? 'The AI service is temporarily busy. Please try again in a moment.'
      : 'Gemini returned invalid JSON. Please try again.'
  );
};

module.exports = { generateTripPlan };