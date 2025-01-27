import React, { useState } from 'react';

type MapFilterProps = {
  onFilterChange: (filter: string[]) => void;
  onCoefChange: (coef: number) => void;
  onBaseMapChange: (baseMap: string) => void;
  onZAccelChange: (zAccel: number) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
};

const MapFilter: React.FC<MapFilterProps> = ({
  onFilterChange,
  onCoefChange,
  onBaseMapChange,
  onZAccelChange,
  onDateRangeChange,
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'allShocks',
  ]);
  const [coef, setCoef] = useState<number>(5);
  const [baseMap, setBaseMap] = useState<string>('default');
  const [zAccel, setZAccel] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filter = event.target.value;
    const isChecked = event.target.checked;

    let updatedFilters = [...selectedFilters];
    if (isChecked && !updatedFilters.includes(filter)) {
      updatedFilters.push(filter);
    } else {
      updatedFilters = updatedFilters.filter((f) => f !== filter);
    }
    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleCoefChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCoef = parseInt(event.target.value, 10);
    setCoef(newCoef);
    onCoefChange(newCoef);
  };

  const handleBaseMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newBaseMap = event.target.value;
    setBaseMap(newBaseMap);
    onBaseMapChange(newBaseMap);
  };

  const handleZAccelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZAccel = parseInt(event.target.value, 10);
    setZAccel(newZAccel);
    onZAccelChange(newZAccel);
  };

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newStartDate = event.target.value;
    setStartDate(newStartDate);
    onDateRangeChange(newStartDate, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
    onDateRangeChange(startDate, newEndDate);
  };

  return (
    <div className="absolute bottom-20 left-20 z-30 -translate-x-1/2 transform rounded-lg bg-white p-2 shadow-lg">
      <h2 className="text-black-100 mb-4 text-center text-xl">Filters</h2>
      <div className="space-y-2">
        <CheckBox
          label="Z Accel"
          isSelected={selectedFilters.includes('zAccel')}
          onCheckboxChange={handleFilterChange}
          value="zAccel"
        />
        <CheckBox
          label="Date"
          isSelected={selectedFilters.includes('date')}
          onCheckboxChange={handleFilterChange}
          value="date"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="coef-slider"
          className="block text-sm font-medium text-gray-700"
        >
          Coefficient de couleur
        </label>
        <input
          id="coef-slider"
          type="range"
          min="1"
          max="10"
          value={coef}
          onChange={handleCoefChange}
          className="mt-1 w-full"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="zaccel-slider"
          className="block text-sm font-medium text-gray-700"
        >
          Z Accel
        </label>
        <input
          id="zaccel-slider"
          type="range"
          min="1"
          max="10"
          value={zAccel}
          onChange={handleZAccelChange}
          className="mt-1 w-full"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="start-date"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          className="mt-1 w-full"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="end-date"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          className="mt-1 w-full"
        />
      </div>
      <div className="mt-4">
        <label
          htmlFor="base-map-select"
          className="block text-sm font-medium text-gray-700"
        >
          Fond de carte
        </label>
        <select
          id="base-map-select"
          value={baseMap}
          onChange={handleBaseMapChange}
          className="mt-1 block w-full"
        >
          <option value="default">Default</option>
          <option value="satellite">Satellite</option>
          <option value="terrain">Terrain</option>
        </select>
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
