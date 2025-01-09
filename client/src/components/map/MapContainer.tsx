import React, { useEffect, useState } from 'react';
import MapComponent, { MapComponentProps } from './Map';
import MapFilter from './MapFilter';
import { apiRoute, getDataFromApi, filterType } from '../../lib/api';

const MapContainer: React.FC = () => {
  const [routes, setRoutes] = useState<MapComponentProps['routes']>([]);
  const [shocks, setShocks] = useState<MapComponentProps['shocks']>([]);
  const [filters, setFilters] = useState<filterType[]>(['allShocks']);

  useEffect(() => {
    filters.forEach((filter) => {
      getDataFromApi(filter as apiRoute).then((data) => {
        switch (filter) {
          case 'allShocks':
            console.log("________"+data)
            setShocks(data);
            break;
          case 'userShocks':
            setShocks(data);
            break;
          case 'userRoutes':
            setRoutes(data);
            break;
        }
        console.log(data);
      });
    });
  }, [filters]);

  const handleFilterChange = (filters: filterType[]) => {
    setRoutes([]);
    setShocks([]);
    setFilters(filters);
  };

  return (
    <div className="flex justify-center align-middle ">
      
      <MapComponent routes={routes} shocks={shocks} />
      {/* <MapFilter
        onFilterChange={(filters: string[]) =>
          handleFilterChange(filters as filterType[])
        }
      /> */}
    </div>
  );
};

export default MapContainer;
