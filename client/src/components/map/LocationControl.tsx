import React, { useState, useCallback, useEffect } from 'react';
import { useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Définir une icône personnalisée pour le marqueur
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

  useEffect(() => {
    // Nettoyer les listeners quand le composant est démonté
    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
  }, [map, handleLocationFound, handleLocationError]);

  const locateUser = () => {
    setIsLocating(true);
    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
    });
  };

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
          {position && (
            <Marker position={position} icon={customIcon}>
            </Marker>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationControl;