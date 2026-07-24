import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix a common Leaflet + bundler issue where marker icons don't load by default
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Custom hotel icon (different color) so hotels stand out from places
const hotelIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: 'hue-rotate-180', // gives hotel markers a different tint via CSS
})

function TripMap({ places, hotels }) {
  // Combine all coordinates to calculate the map's center point
  const allPoints = [
    ...places.map((p) => p.coordinates),
    ...hotels.map((h) => h.coordinates),
  ].filter((c) => c && c.lat && c.lng)

  if (allPoints.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center text-gray-500">
        No location data available for this trip
      </div>
    )
  }

  const centerLat = allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length
  const centerLng = allPoints.reduce((sum, p) => sum + p.lng, 0) / allPoints.length

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={12}
      className="h-96 rounded-lg shadow-md z-0"
      style={{ height: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place, idx) =>
        place.coordinates?.lat ? (
          <Marker key={`place-${idx}`} position={[place.coordinates.lat, place.coordinates.lng]}>
            <Popup>
              <strong>{place.name}</strong>
              <br />
              {place.category}
            </Popup>
          </Marker>
        ) : null
      )}

      {hotels.map((hotel, idx) =>
        hotel.coordinates?.lat ? (
          <Marker
            key={`hotel-${idx}`}
            position={[hotel.coordinates.lat, hotel.coordinates.lng]}
            icon={hotelIcon}
          >
            <Popup>
              <strong>🏨 {hotel.name}</strong>
              <br />
              {hotel.priceRange}
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  )
}

export default TripMap