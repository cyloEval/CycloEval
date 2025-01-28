import React, { useState, useCallback } from 'react';
import { useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIconRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const LocationControl: React.FC = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const map = useMap();

  const handleLocationFound = useCallback((e: L.LocationEvent) => {
    setPosition(e.latlng);
    setIsLocating(false);
  }, []);

  const handleLocationError = useCallback(() => {
    setIsLocating(false);
    alert('Location not found');
  }, []);

  const locateUser = () => {
    setIsLocating(true);
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
    });
  };

  map.on('locationfound', handleLocationFound);
  map.on('locationerror', handleLocationError);

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar">
        <div>
          <button
            onClick={locateUser}
            className="flex h-10 w-10 items-center justify-center bg-white hover:bg-gray-100"
            title="Me localiser"
            disabled={isLocating}
            style={{
              cursor: 'pointer',
              border: '2px solid rgba(0,0,0,0.2)',
              borderRadius: '4px',
            }}
          >
            <span
              className={`text-xl ${isLocating ? 'animate-pulse text-purple-500' : 'text-gray-600'}`}
            >
              📍
            </span>
          </button>
          {position && <Marker position={position}></Marker>}
        </div>
      </div>
    </div>
  );
};

export default LocationControl;
