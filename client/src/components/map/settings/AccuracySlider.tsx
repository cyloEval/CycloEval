import React from 'react';

type AccuracySliderProps = {
  value: number;
  onChange: (value: number) => void;
  onAccuracyChange: (accuracy: number) => void;
};

const AccuracySlider: React.FC<AccuracySliderProps> = ({
  value,
  onChange,
  onAccuracyChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    onChange(newValue);
    onAccuracyChange(newValue);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <label
        htmlFor="accuracy-slider"
        className="block text-sm font-medium text-gray-200"
      >
        Accuracy: <span className="font-bold text-white">{value}</span>
      </label>
      <input
        id="accuracy-slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
    </div>
  );
};

export default AccuracySlider;
