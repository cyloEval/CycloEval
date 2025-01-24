import React, { useState } from 'react';

type MapFilterProps = {
  onFilterChange: (filter: string[]) => void;
};

const MapFilter: React.FC<MapFilterProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'allShocks',
  ]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filter = event.target.value;
    const isChecked = event.target.checked;

    console.log(filter, isChecked);

    let updatedFilters = [...selectedFilters];
    if (isChecked && !updatedFilters.includes(filter)) {
      updatedFilters.push(filter);
    } else {
      updatedFilters = updatedFilters.filter((f) => f !== filter);
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="absolute bottom-20 left-20 z-30 -translate-x-1/2 transform rounded-lg bg-white p-2 shadow-lg">
      <h2 className="text-black-100 mb-4 text-center text-xl">Filters</h2>
      <div className="space-y-2">
        <CheckBox
          label="All Shocks"
          isSelected={selectedFilters.includes('allShocks')}
          onCheckboxChange={handleFilterChange}
          value="allShocks"
        />
        <CheckBox
          label="User Shocks"
          isSelected={selectedFilters.includes('userShocks')}
          onCheckboxChange={handleFilterChange}
          value="userShocks"
        />
        <CheckBox
          label="User Routes"
          isSelected={selectedFilters.includes('userRoutes')}
          onCheckboxChange={handleFilterChange}
          value="userRoutes"
        />
      </div>
    </div>
  );
};

type CheckBoxProps = {
  label: string;
  isSelected: boolean;
  value?: string;
  onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  isSelected,
  value,
  onCheckboxChange,
}) => (
  <label className="flex items-center text-black">
    <input
      type="checkbox"
      checked={isSelected}
      onChange={onCheckboxChange}
      className="form-checkbox h-5 w-5 text-blue-500"
      value={value}
    />
    <span className="ml-2">{label}</span>
  </label>
);

export default MapFilter;
