import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import LocationControl from './LocationControl';
import MapEvents from './MapEvents';
import { getColor, getOpacity, getRadius } from './utils';

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
  coef: number;
  baseMap: string;
  zAccel: number;
  accuracy: number;
  dateRange: { startDate: string; endDate: string };
};

const MapComponent: React.FC<MapComponentProps> = ({
  GPSPoints,
  coef,
  baseMap,
  zAccel,
  accuracy,
  dateRange,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);

  const filteredPoints = GPSPoints.filter((point) => {
    if (point.zAccel < zAccel) return false;
    if (
      new Date(point.timestamp) < new Date(dateRange.startDate) ||
      new Date(point.timestamp) > new Date(dateRange.endDate)
    )
      return false;
    return true;
  });

  const mapTile = {
    default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    white:
      'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
  };

  const baseMapUrl: string = mapTile[baseMap as keyof typeof mapTile];

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
        <MapEvents mapRef={mapRef} setZoomLevel={setZoomLevel} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={baseMapUrl}
        />
        <LocationControl />

        {filteredPoints.map((point) => (
          <React.Fragment key={point.id}>
            {[0.85, 0.4].map((factor, index) => (
              <Circle
                key={index}
                center={[point.latitude, point.longitude]}
                radius={
                  getRadius(point.horizontalAccuracy, zoomLevel) *
                  (0.2 + index * 0.5) *
                  accuracy
                }
                pathOptions={{
                  color: getColor(point.zAccel, coef),
                  stroke: false,
                }}
                fillOpacity={getOpacity(point.horizontalAccuracy, factor)}
              >
                <Tooltip>
                  <span>
                    Lat: {point.latitude} - Lon: {point.longitude}
                  </span>
                  <br />
                  <span>
                    Z Accel: {Math.trunc(point.zAccel * 100) / 100} m/s²
                  </span>
                  <br />
                  <span>
                    Date: {new Date(point.timestamp).toLocaleString()}
                  </span>
                </Tooltip>
              </Circle>
            ))}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
