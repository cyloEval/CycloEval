import React, { useEffect, useState } from 'react';
import MapComponent from './Map';
import MapFilter from './MapFilter';

type ShockSample = {
  id: number;
  timestamp: string;
  zAccel: number;
  userId: number;
  latitude: number;
  longitude: number;
  altitude: number;
};

type filterType = 'allShocks' | 'userShocks' | 'userRoutes' | 'allRoutes';

const MapContainer: React.FC = () => {
  const [shockSamples, setShockSamples] = useState<ShockSample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/shock-samples');
      const data = await response.json();
      setShockSamples(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFilterChange = (filter: filterType) => {
    console.log(filter);
  };

  return (
    <div className="flex justify-center">
      <MapComponent
      // routes={routes}
      // shocks={shocks}
      // loading={loading}
      />
      <MapFilter onFilterChange={(filter: string) => handleFilterChange(filter as filterType)} />
    </div>
  );
};

export default MapContainer;
