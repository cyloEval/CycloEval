import React from 'react';

type BaseMapSelectProps = {
  value: string;
  onChange: (value: string) => void;
  onBaseMapChange: (baseMap: string) => void;
};

const BaseMapSelect: React.FC<BaseMapSelectProps> = ({
  value,
  onChange,
  onBaseMapChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value;
    onChange(newValue);
    onBaseMapChange(newValue);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <label
        htmlFor="base-map-select"
        className="block text-sm font-medium text-gray-200"
      >
        Fond de carte
      </label>
      <select
        id="base-map-select"
        value={value}
        onChange={handleChange}
        className="mt-1 block w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      >
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="white">White</option>
      </select>
    </div>
  );
};

export default BaseMapSelect;
