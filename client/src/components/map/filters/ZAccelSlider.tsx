import React from 'react';

type ZAccelSliderProps = {
  value: number;
  onChange: (value: number) => void;
  onZAccelChange: (zAccel: number) => void;
};

const ZAccelSlider: React.FC<ZAccelSliderProps> = ({
  value,
  onChange,
  onZAccelChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
    onZAccelChange(newValue);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <label
        htmlFor="zaccel-slider"
        className="block text-sm font-medium text-gray-200"
      >
        Z Accel {'>'} <span className="font-bold text-white">{value}</span>
      </label>
      <input
        id="zaccel-slider"
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        style={{ accentColor: 'green' }}
      />
    </div>
  );
};

export default ZAccelSlider;
