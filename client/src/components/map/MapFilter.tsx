import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

type MapFilterProps = {
  onFilterChange: (filter: string[]) => void;
};

const MapFilter: React.FC<MapFilterProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'allShocks',
  ]);
  const { isSignedIn } = useAuth();

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
    <div className="flex min-h-screen items-center justify-center p-2">
      <div className="w-full max-w-xs space-y-4 rounded-lg bg-slate-200/40 p-4 shadow-lg">
        <h2 className="text-black-100 text-center text-2xl">Filters</h2>
        <CheckBox
          label="All Shocks"
          isSelected={selectedFilters.includes('allShocks')}
          onCheckboxChange={handleFilterChange}
          value="allShocks"
        />
        <>
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
        </>
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
