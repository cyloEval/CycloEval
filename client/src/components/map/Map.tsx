import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  useMapEvents,
} from 'react-leaflet';
import { filterType } from '../../lib/api';
import MapFilter from './MapFilter';

type Shock = {
  id: number;
  timestamp: string;
  zAccel: number;
  userId: number;
  latitude: number;
  longitude: number;
  altitude: number;
};

type Route = {
  id: number;
  user_id: number;
  latitude: number[];
  longitude: number[];
  altitude: number[];
};

export type MapComponentProps = {
  routes: Route[];
  shocks: Shock[];
};

const MapComponent: React.FC<MapComponentProps> = ({ routes, shocks }) => {
  const mapRef = React.useRef<L.Map | null>(null);
  const userId = localStorage.getItem('userId');
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

        {shocks.map((shock: Shock) => (
          <Circle
            key={shock.id}
            center={[shock.latitude, shock.longitude]}
            radius={putToScaleRadius(zoomLevel)}
            color={
              shock.userId === Number(userId)
                ? 'green'
                : Math.abs(shock.zAccel) > 4
                  ? 'red'
                  : 'blue'
            }
          />
        ))}

        {routes.map((route) => (
          <Polyline
            key={route.id}
            pathOptions={{ color: 'blue'}}
            positions={route.latitude.map((lat, i) => [
              lat,
              route.longitude[i],
            ])}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
