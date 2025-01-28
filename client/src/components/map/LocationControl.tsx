import React, { useState, useCallback } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import { LatLng } from 'leaflet';

const LocationControl = () => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const map = useMap();

  const handleLocationFound = useCallback((e: any) => {
    setPosition(e.latlng);
    setIsLocating(false);
  }, []);

  const handleLocationError = useCallback(() => {
    setIsLocating(false);
    alert('Impossible de trouver votre position');
  }, []);

  const locateUser = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsLocating(true);

      if (!map) return;

      map.off('locationfound');
      map.off('locationerror');

      map.on('locationfound', handleLocationFound);
      map.on('locationerror', handleLocationError);

      map.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true,
      });
    },
    [map, handleLocationFound, handleLocationError],
  );

  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar">
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
      </div>
      {position && (
        <Marker position={position}>
          <Popup>Votre position</Popup>
        </Marker>
      )}
    </div>
  );
};

export default LocationControl;
