import React from 'react';

type CoefSliderProps = {
  value: number;
  onChange: (value: number) => void;
  onCoefChange: (coef: number) => void;
};

const CoefSlider: React.FC<CoefSliderProps> = ({
  value,
  onChange,
  onCoefChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    onChange(newValue);
    onCoefChange(newValue);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <label
        htmlFor="coef-slider"
        className="block text-sm font-medium text-gray-200"
      >
        Coefficient de couleur:{' '}
        <span className="font-bold text-white">{value}</span>
      </label>
      <input
        id="coef-slider"
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={handleChange}
        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
    </div>
  );
};

export default CoefSlider;
