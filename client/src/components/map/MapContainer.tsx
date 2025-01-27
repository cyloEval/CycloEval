import React, { useEffect, useState } from 'react';
import MapComponent, { MapComponentProps } from './Map';
import MapFilter from './MapFilter';

import { filterType, getDataFromApi, apiRoute } from '../../lib/api';

const MapContainer: React.FC = () => {
  const [GPSPoints, setGPSPoints] = useState<MapComponentProps['GPSPoints']>(
    [],
  );
  const [filters, setFilters] = useState<filterType[]>(['allShocks']);
  const [coef, setCoef] = useState<number>(5);
  const [baseMap, setBaseMap] = useState<string>('default');
  const [zAccel, setZAccel] = useState<number>(1);
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDataFromApi('GPSPoints');
        setGPSPoints(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (filters: filterType[]) => {
    setFilters(filters);
  };

  const handleCoefChange = (coef: number) => {
    setCoef(coef);
  };

  const handleBaseMapChange = (baseMap: string) => {
    setBaseMap(baseMap);
  };

  const handleZAccelChange = (zAccel: number) => {
    setZAccel(zAccel);
  };

  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  };

  return (
    <div className="flex w-full justify-center align-middle">
      <MapComponent
        GPSPoints={GPSPoints}
        filters={filters}
        coef={coef}
        baseMap={baseMap}
        zAccel={zAccel}
        dateRange={dateRange}
      />
      <MapFilter
        onFilterChange={(filters: string[]) =>
          handleFilterChange(filters as filterType[])
        }
        onCoefChange={handleCoefChange}
        onBaseMapChange={handleBaseMapChange}
        onZAccelChange={handleZAccelChange}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  );
};

export default MapContainer;
