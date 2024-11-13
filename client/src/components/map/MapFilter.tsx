import React, { useState } from 'react';

type MapFilterProps = {
  onFilterChange: (filter: string) => void;
};

const MapFilter: React.FC<MapFilterProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = event.target.value;
    setSelectedFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="w-full, min-w-52 max-w-sm">
      <div className="relative">
        <select
          value={selectedFilter}
          onChange={handleFilterChange}
          className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none"
        >
          <option value="all">Afficher tous les shocks</option>
          <option value="userShocks">Afficher les shocks de l'utilisateur</option>
          <option value="userRoutes">Afficher les routes de l'utilisateur</option>
          <option value="allRoutes">Afficher toutes les routes</option>
        </select>
      </div>
    </div>
  );
};

export default MapFilter;
