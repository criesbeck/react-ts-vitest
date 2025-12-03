import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { RestroomWithDistance, Location } from '../types';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom user location icon with pulsing effect
const userIcon = new L.DivIcon({
  html: `
    <div style="position: relative; width: 40px; height: 40px;">
      <!-- Pulsing rings -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(124, 58, 237, 0.3);
        animation: pulse 2s infinite;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgba(124, 58, 237, 0.5);
        animation: pulse 2s infinite 0.5s;
      "></div>
      <!-- Main dot -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #7c3aed;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0;
        }
      }
    </style>
  `,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
});

// Custom restroom icons based on accessibility
const createRestroomIcon = (restroom: RestroomWithDistance) => {
  const color = restroom.isWheelchairAccessible ? '#10b981' : '#6366f1';
  const symbol = restroom.isWheelchairAccessible ? '♿' : '🚽';
  
  return new L.DivIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">${symbol}</div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

interface RecenterMapProps {
  center: [number, number];
  zoom?: number;
}

// Component to recenter map when location changes
function RecenterMap({ center, zoom }: RecenterMapProps) {
  const map = useMap();
  const prevCenterRef = useRef<[number, number] | null>(null);
  const isAnimatingRef = useRef(false);
  
  useEffect(() => {
    // Skip if already animating
    if (isAnimatingRef.current) {
      return;
    }

    const prevCenter = prevCenterRef.current;
    const currentCenter = map.getCenter();
    const threshold = 0.00001; // Very small threshold
    
    // Check if center actually changed
    const centerChanged = !prevCenter ||
      Math.abs(currentCenter.lat - center[0]) > threshold ||
      Math.abs(currentCenter.lng - center[1]) > threshold;
    
    if (centerChanged) {
      isAnimatingRef.current = true;
      prevCenterRef.current = center;
      
      // Use flyTo with proper callback
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1,
        easeLinearity: 0.25
      });
      
      // Reset animating flag after animation completes
      setTimeout(() => {
        // Invalidate size in case the map container has changed (e.g. side panel opened)
        try {
          map.invalidateSize();
        } catch (e) {
          // ignore
        }
        isAnimatingRef.current = false;
      }, 1000);
    } else if (zoom && Math.abs(map.getZoom() - zoom) > 0.5) {
      map.setZoom(zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Component for recenter button
function RecenterButton({ userLocation }: { userLocation: Location }) {
  const map = useMap();
  
  const handleRecenter = () => {
    map.setView([userLocation.latitude, userLocation.longitude], 16, { animate: true, duration: 0.5 });
  };
  
  return (
    <div className="absolute bottom-3 left-3 z-[1000]">
      <button
        onClick={handleRecenter}
        className="bg-white hover:bg-purple-50 rounded-lg shadow-lg p-2.5 transition-colors border-2 border-purple-200 hover:border-purple-400"
        aria-label="Recenter map on your location"
        title="Find my location"
      >
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}

interface MapViewProps {
  userLocation: Location;
  restrooms: RestroomWithDistance[];
  onRestroomClick: (restroom: RestroomWithDistance) => void;
  selectedRestroom?: RestroomWithDistance | null;
}

const MapView = ({ userLocation, restrooms, onRestroomClick, selectedRestroom }: MapViewProps) => {
  // Memoize the initial center to prevent MapContainer from re-rendering
  const initialCenter: [number, number] = useMemo(
    () => [userLocation.latitude, userLocation.longitude],
    [] // Empty deps - only set once
  );

  // Use selected restroom location if available, otherwise user location
  const center: [number, number] = selectedRestroom
    ? [selectedRestroom.location.latitude, selectedRestroom.location.longitude]
    : [userLocation.latitude, userLocation.longitude];
  
  const zoom = selectedRestroom ? 18 : 16;

  return (
    <div className="w-full h-full relative z-0" style={{ minHeight: '400px' }}>
      <MapContainer
        center={initialCenter}
        zoom={16}
        className="w-full h-full rounded-lg"
        style={{ height: '100%', width: '100%', minHeight: '400px', zIndex: 0 }}
        zoomControl={true}
        scrollWheelZoom={true}
        attributionControl={true}
        whenReady={() => {
          console.log('Map is ready');
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          minZoom={1}
          keepBuffer={4}
          updateWhenIdle={false}
          updateWhenZooming={false}
          updateInterval={200}
        />
        
        <RecenterMap center={center} zoom={zoom} />

        {/* User Location Marker */}
        <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
          <Popup>
            <div className="text-center font-semibold text-purple-600">
              📍 Your Location
              <div className="text-xs text-gray-600 mt-1">We're here!</div>
            </div>
          </Popup>
        </Marker>

        {/* Restroom Markers */}
        {restrooms.map((restroom) => (
          <Marker
            key={restroom.id}
            position={[restroom.location.latitude, restroom.location.longitude]}
            icon={createRestroomIcon(restroom)}
            eventHandlers={{
              click: () => onRestroomClick(restroom),
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-sm mb-1">{restroom.buildingName}</h3>
                <p className="text-xs text-gray-600 mb-2">{restroom.floor}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {restroom.isWheelchairAccessible && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">♿</span>
                  )}
                  {restroom.isGenderNeutral && (
                    <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded">🚻</span>
                  )}
                  {!restroom.requiresWildcard && (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">🔓</span>
                  )}
                </div>
                <button
                  onClick={() => onRestroomClick(restroom)}
                  className="w-full text-xs bg-purple-600 text-white py-1.5 px-3 rounded hover:bg-purple-700"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Recenter Button */}
        <RecenterButton userLocation={userLocation} />
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow-lg p-2.5 text-xs z-[1000]">
        <div className="font-semibold mb-1.5 text-gray-900">Legend</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-purple-600 border-2 border-white relative flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
          <span className="text-gray-700">You</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-[10px]">♿</div>
          <span className="text-gray-700">Accessible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-[10px]">🚽</div>
          <span className="text-gray-700">Standard</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
