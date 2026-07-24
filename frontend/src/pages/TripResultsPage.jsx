import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import TripMap from '../components/TripMap'

function TripResultsPage() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get(`/trips/${id}`)
      .then((res) => setTrip(res.data))
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load trip')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading your trip plan...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-red-600 text-lg">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    )
  }

  const { tripData } = trip

  // Collect all places across all days, for the map
  const allPlaces = tripData.days.flatMap((day) => day.places || [])

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600">{tripData.tripTitle}</h1>
          <p className="text-gray-600 mt-2">{tripData.overview}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
            <span className="bg-blue-100 px-3 py-1 rounded-full">📍 {tripData.destination}</span>
            <span className="bg-blue-100 px-3 py-1 rounded-full">📅 {tripData.duration}</span>
            <span className="bg-blue-100 px-3 py-1 rounded-full">💰 {tripData.budget} budget</span>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🗺️ Trip Map</h2>
          <TripMap places={allPlaces} hotels={tripData.hotels || []} />
        </div>

        {/* Day-by-day itinerary */}
        <div className="space-y-6">
          {tripData.days.map((day) => (
            <div key={day.day} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800">
                Day {day.day}: {day.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Estimated cost: {day.estimatedCost}</p>

              <div className="mt-4 space-y-4">
                {day.places.map((place, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-800">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      ⏰ {place.timing} &nbsp;|&nbsp; 🎟️ {place.entryFee}
                    </p>
                    {place.tips && (
                      <p className="text-xs text-blue-600 mt-1">💡 {place.tips}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <p>
                  <span className="font-medium">🍳 Breakfast:</span> {day.meals?.breakfast}
                </p>
                <p>
                  <span className="font-medium">🍲 Lunch:</span> {day.meals?.lunch}
                </p>
                <p>
                  <span className="font-medium">🍽️ Dinner:</span> {day.meals?.dinner}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Hotels */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🏨 Recommended Hotels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tripData.hotels.map((hotel, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">{hotel.name}</h3>
                <p className="text-sm text-gray-500">{hotel.area}</p>
                <p className="text-sm text-gray-600 mt-1">{hotel.description}</p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-blue-600 font-medium">{hotel.priceRange}</span>
                  <span className="text-yellow-600">⭐ {hotel.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra info */}
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">🎒 Packing List</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {tripData.packingList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">💡 Travel Tips</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              {tripData.travelTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Total Estimated Budget:</span>{' '}
            {tripData.totalEstimatedBudget}
          </p>
          <p>
            <span className="font-semibold">Best Time to Visit:</span> {tripData.bestTimeToVisit}
          </p>
          <p>
            <span className="font-semibold">Local Transport:</span> {tripData.localTransport}
          </p>
        </div>

        <div className="text-center">
          <Link to="/" className="text-blue-600 hover:underline">
            ← Plan Another Trip
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TripResultsPage