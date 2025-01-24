import React, { useEffect, useState } from 'react';
import MapComponent, { MapComponentProps } from './Map';
import MapFilter from './MapFilter';

import { filterType, getDataFromApi, apiRoute } from '../../lib/api';

const MapContainer: React.FC = () => {
  const [GPSPoints, setGPSPoints] = useState<MapComponentProps['GPSPoints']>(
    [],
  );
  const [filters, setFilters] = useState<filterType[]>(['allShocks']);

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

  return (
    <div className="flex w-full justify-center align-middle">
      <MapComponent GPSPoints={GPSPoints} />
      <MapFilter
        onFilterChange={(filters: string[]) =>
          handleFilterChange(filters as filterType[])
        }
      />
    </div>
  );
};

export default MapContainer;
