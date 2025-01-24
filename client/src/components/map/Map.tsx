import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';

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



const MapComponent = ({ GPSPoints }: MapComponentProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [zoomLevel, setZoomLevel] = useState(13);

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
