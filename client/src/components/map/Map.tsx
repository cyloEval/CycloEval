import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  useMapEvents,
} from 'react-leaflet';

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

const MapComponent: React.FC<MapComponentProps> = ({ GPSPoints }) => {
  const mapRef = React.useRef<L.Map | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);

  const putToScaleRadius = (zoomLevel: number) => {
    return 100 / zoomLevel; // Adjust this value to scale the radius as needed
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
    <div className="flex h-[100vh] w-full justify-center text-center align-middle">
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

        {GPSPoints.map((point) => (
          <Circle
            key={point.id}
            center={[point.latitude, point.longitude]}
            radius={point.horizontalAccuracy}
            pathOptions={{ color: 'red' }}
            fillOpacity={0.5}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
