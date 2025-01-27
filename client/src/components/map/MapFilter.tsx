import React, { useState } from 'react';

type MapFilterProps = {
  onCoefChange: (coef: number) => void;
  onBaseMapChange: (baseMap: string) => void;
  onZAccelChange: (zAccel: number) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
};

const MapFilter: React.FC<MapFilterProps> = ({
  onCoefChange,
  onBaseMapChange,
  onZAccelChange,
  onDateRangeChange,
}) => {
  const [coef, setCoef] = useState<number>(5);
  const [baseMap, setBaseMap] = useState<string>('default');
  const [zAccel, setZAccel] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

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

  const handleResetFilters = () => {
    setCoef(5);
    setBaseMap('default');
    setZAccel(0);
    setStartDate('');
    setEndDate('');
    onCoefChange(5);
    onBaseMapChange('default');
    onZAccelChange(0);
    onDateRangeChange('', '');
  };

  return (
    <div className="fixed bottom-4 left-4 z-30 w-80 transform rounded-lg bg-white p-4 shadow-lg">
      <h2 className="text-black-100 mb-4 text-center text-xl">Filters</h2>
      <div className="space-y-4">
        <div className="mt-4">
          <label
            htmlFor="coef-slider"
            className="block text-sm font-medium text-gray-700"
          >
            Coefficient de couleur: <span className="font-bold">{coef}</span>
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
            Z Accel: <span className="font-bold">{zAccel}</span>
          </label>
          <input
            id="zaccel-slider"
            type="range"
            min="0"
            max="100"
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
            Start Date: <span className="font-bold">{startDate}</span>
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
            End Date: <span className="font-bold">{endDate}</span>
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
            <option value="dark">Dark</option>
            <option value="white">White</option>
          </select>
        </div>
        <div className="mt-4">
          <button
            onClick={handleResetFilters}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapFilter;
