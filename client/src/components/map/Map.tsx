import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationControl from './LocationControl';
import MapEvents from './MapEvents';
import MapFilter from './MapConfig';
import FilterToggleButton from './filters/FilterToggleButton';
import { getDataFromApi } from '../../lib/api';
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

export type MapProps = {
  GPSPoints: GPSPointsType[];
  coef: number;
  baseMap: string;
  zAccel: number;
  accuracy: number;
  dateRange: { startDate: string; endDate: string };
};

const Map: React.FC = () => {
  const [GPSPoints, setGPSPoints] = useState<MapProps['GPSPoints']>([]);
  const [coef, setCoef] = useState<number>(5);
  const [baseMap, setBaseMap] = useState<string>('default');
  const [zAccel, setZAccel] = useState<number>(1);
  const [accuracy, setAccuracy] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({ startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const mapRef = useRef<L.Map | null>(null);
  const [zoomLevel, setZoomLevel] = useState(12);

  const fetchData = async () => {
    try {
      const data = await getDataFromApi('GPSPoints');
      setGPSPoints(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCoefChange = (coef: number) => setCoef(coef);
  const handleBaseMapChange = (baseMap: string) => setBaseMap(baseMap);
  const handleZAccelChange = (zAccel: number) => setZAccel(zAccel);
  const handleAccuracyChange = (accuracy: number) => setAccuracy(accuracy);
  const handleDateRangeChange = (startDate: string, endDate: string) =>
    setDateRange({ startDate, endDate });
  const toggleFilters = () => setShowFilters(!showFilters);

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
    <div className="lg:h-[93vh relative flex w-full justify-center text-center align-middle sm:h-[85vh] md:h-[93vh]">
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

      <div className="absolute bottom-24 left-14 z-30">
        {!showFilters && (
          <FilterToggleButton
            onClick={toggleFilters}
            showFilters={showFilters}
          />
        )}
      </div>

      <div
        className={`absolute bottom-24 left-24 z-30 transform rounded-xl p-4 transition-all duration-300 ${showFilters ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
      >
        <FilterToggleButton onClick={toggleFilters} showFilters={showFilters} />
        <MapFilter
          onCoefChange={handleCoefChange}
          onBaseMapChange={handleBaseMapChange}
          onZAccelChange={handleZAccelChange}
          onAccuracyChange={handleAccuracyChange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>
    </div>
  );
};

export default Map;
