import React, { useState, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  useMapEvents,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';

import { LatLng } from 'leaflet';

type GPSPointsType = {
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  horizontalAccuracy: number;
  verticalAccuracy: number;
  speedAccuracy: number;
  zAccel: number;
  timestamp: string;
};

export type MapComponentProps = {
  GPSPoints: GPSPointsType[];
};

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

  const locateUser = useCallback((e: React.MouseEvent) => {
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
      enableHighAccuracy: true
    });
  }, [map, handleLocationFound, handleLocationError]);

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={locateUser}
          className="flex h-10 w-10 items-center justify-center bg-white hover:bg-gray-100"
          title="Me localiser"
          disabled={isLocating}
          style={{ cursor: 'pointer', border: '2px solid rgba(0,0,0,0.2)', borderRadius: '4px' }}
        >
          <span className={`text-xl ${isLocating ? 'animate-pulse text-purple-500' : 'text-gray-600'}`}>
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

const MapComponent: React.FC<MapComponentProps> = ({ GPSPoints }) => {
  const mapRef = React.useRef<L.Map | null>(null);

  const [zoomLevel, setZoomLevel] = useState(12);

  const getColor = (zAccel: number): string => {
    const green = Math.max(0, 255 - Math.min(255, zAccel * 25));
    const red = Math.min(255, zAccel * 25);
    return `rgb(${red},${green},0)`;
  };

  const getOpacity = (horizontalAccuracy: number, factor: number): number => {
    return Math.min(0.8, (10 / horizontalAccuracy) * factor);
  };

  const radiusFactor: { [key: number]: number } = {
    10: 3,
    9: 50,
    8: 200,
    7: 500,
    6: 1500,
    5: 30000,
    4: 60000,
    3: 100000,
    2: 200000,
    1: 300000,
    0: 500000,
  };

  const getRadius = (horizontalAccuracy: number, zoomLevel: number): number => {
    if (zoomLevel <= 10) return radiusFactor[zoomLevel];
    else return horizontalAccuracy;
  };

  const MapEvents = () => {
    useMapEvents({
      zoomend: () => {
        const zoom = mapRef.current?.getZoom();
        if (zoom) {
          setZoomLevel(zoom);
          console.log('Zoom level:', zoom);
        }
      },
    });
    return null;
  };

  return (
    <div className="flex h-[92vh] w-full justify-center text-center align-middle">
      <MapContainer
        ref={mapRef}
        className="map"
        center={[44.8, -0.6]}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        style={{ width: '100%', height: '100%', zIndex: 30 }}
        maxZoom={18}
      >
        <MapEvents />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationControl />

        {GPSPoints.map((point) => (
          <React.Fragment key={point.id}>
            {[0.9, 0.6, 0.2].map((factor, index) => (
              <Circle
                key={index}
                center={[point.latitude, point.longitude]}
                radius={
                  getRadius(point.horizontalAccuracy, zoomLevel) *
                  (0.5 + index * 0.5)
                }
                pathOptions={{
                  color: getColor(point.zAccel),
                  stroke: false,
                }}
                fillOpacity={getOpacity(point.horizontalAccuracy, factor)}
              />
            ))}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
