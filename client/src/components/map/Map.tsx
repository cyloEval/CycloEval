import React, { useEffect } from "react";
import { MapContainer, TileLayer, Popup, Marker, Circle } from "react-leaflet";

type Shock = {
  id: number;
  timestamp: string;
  zAccel: number;
  userId: number;
  latitude: number;
  longitude: number;
  altitude: number;
};

const MapComponent: React.FC = () => {
  const mapRef = React.useRef(null);

  return (
    <div className="flex justify-center pt-24 text-center align-middle">
      <MapContainer
        ref={mapRef}
        className="map"
        center={[44.8, -0.6]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ zIndex: 30 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {shockSample.map((shock: Shock) => (
          <Circle
            center={[shock.latitude, shock.longitude]}
            radius={1}
            color={Math.abs(shock.zAccel) > 4 ? "red" : "blue"}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

const shockSample = [
  {
    id: 1,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -1.139336068711178,
    userId: 1,
    latitude: 44.8004417,
    longitude: -0.6057561,
    altitude: 72.30000305175781,
  },
  {
    id: 2,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -2.139336068711178,
    userId: 1,
    latitude: 44.8004598,
    longitude: -0.6056892,
    altitude: 72.30000305175781,
  },
  {
    id: 3,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8004776,
    longitude: -0.6056233,
    altitude: 72.30000305175781,
  },
  {
    id: 4,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8004955,
    longitude: -0.6055564,
    altitude: 72.30000305175781,
  },
  {
    id: 5,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8005123,
    longitude: -0.6054893,
    altitude: 72.30000305175781,
  },
  {
    id: 6,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8005287,
    longitude: -0.6054211,
    altitude: 72.30000305175781,
  },
  {
    id: 7,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -2.139336068711178,
    userId: 1,
    latitude: 44.8005436,
    longitude: -0.6053569,
    altitude: 72.30000305175781,
  },
  {
    id: 8,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8005588,
    longitude: -0.605295,
    altitude: 72.30000305175781,
  },
  {
    id: 9,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8005748,
    longitude: -0.6052315,
    altitude: 72.30000305175781,
  },
  {
    id: 10,
    timestamp: "2024-10-14T13:40:02",
    zAccel: -4.139336068711178,
    userId: 1,
    latitude: 44.8005992,
    longitude: -0.6051776,
    altitude: 72.30000305175781,
  },
];
