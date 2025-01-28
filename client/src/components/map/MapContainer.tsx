import React, { useEffect, useState } from 'react';
import MapComponent, { MapComponentProps } from './Map';
import MapFilter from './MapFilter';
import { getDataFromApi } from '../../lib/api';

const MapContainer: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [GPSPoints, setGPSPoints] = useState<MapComponentProps['GPSPoints']>(
    [],
  );
  const [coef, setCoef] = useState<number>(5);
  const [baseMap, setBaseMap] = useState<string>('default');
  const [zAccel, setZAccel] = useState<number>(1);
  const [accuracy, setAccuracy] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });
  const [showFilters, setShowFilters] = useState<boolean>(true);

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

  useEffect(() => {
    onRefresh();
  }, [GPSPoints, onRefresh]);

  const handleCoefChange = (coef: number) => {
    setCoef(coef);
  };

  const handleBaseMapChange = (baseMap: string) => {
    setBaseMap(baseMap);
  };

  const handleZAccelChange = (zAccel: number) => {
    setZAccel(zAccel);
  };

  const handleAccuracyChange = (accuracy: number) => {
    setAccuracy(accuracy);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="relative flex w-full items-center justify-center">
      <MapComponent
        GPSPoints={GPSPoints}
        coef={coef}
        baseMap={baseMap}
        zAccel={zAccel}
        accuracy={accuracy}
        dateRange={dateRange}
      />
      <div
        className={`absolute bottom-24 left-24 z-30 transform rounded-xl bg-white p-4 shadow-lg transition-all duration-300 ${
          showFilters ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <MapFilter
          onCoefChange={handleCoefChange}
          onBaseMapChange={handleBaseMapChange}
          onZAccelChange={handleZAccelChange}
          onAccuracyChange={handleAccuracyChange}
          onDateRangeChange={handleDateRangeChange}
        />
        <button
          onClick={toggleFilters}
          className="absolute -right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-700 focus:outline-none"
        >
          ⇦
        </button>
      </div>
      {!showFilters && (
        <button
          onClick={toggleFilters}
          className="absolute bottom-20 left-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-lg text-white shadow-lg transition-transform duration-300 hover:bg-blue-700 focus:outline-none"
        >
          ⇨
        </button>
      )}
    </div>
  );
};

export default MapContainer;
