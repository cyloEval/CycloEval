import React, { useState } from 'react';
import CoefSlider from './settings/CoefSlider';
import BaseMapSelect from './settings/BaseMapSelect';
import ZAccelSlider from './filters/ZAccelSlider';
import AccuracySlider from './settings/AccuracySlider';
import DateRangePicker from './filters/DateRangePicker';

type MapConfigProps = {
  onCoefChange: (coef: number) => void;
  onBaseMapChange: (baseMap: string) => void;
  onZAccelChange: (zAccel: number) => void;
  onAccuracyChange: (accuracy: number) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
};

const MapConfig: React.FC<MapConfigProps> = ({
  onCoefChange,
  onBaseMapChange,
  onZAccelChange,
  onAccuracyChange,
  onDateRangeChange,
}) => {
  const [coef, setCoef] = useState<number>(5);
  const [baseMap, setBaseMap] = useState<string>('default');
  const [zAccel, setZAccel] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const resetToDefault = () => {
    setCoef(5);
    setBaseMap('default');
    setZAccel(0);
    setAccuracy(1);
    setStartDate('');
    setEndDate('');
    onCoefChange(5);
    onBaseMapChange('default');
    onZAccelChange(0);
    onAccuracyChange(1);
    onDateRangeChange('', '');
    localStorage.removeItem('coef');
    localStorage.removeItem('baseMap');
    localStorage.removeItem('zAccel');
    localStorage.removeItem('accuracy');
    localStorage.removeItem('dateRange');
  };

  return (
    <div className="space-y-4 rounded-lg bg-gray-900 p-4 shadow-lg">
      <div className="flex flex-col space-y-4">
        <h3 className="text-md font-semibold text-white">Settings</h3>
        <BaseMapSelect
          value={baseMap}
          onChange={setBaseMap}
          onBaseMapChange={onBaseMapChange}
        />
        <CoefSlider
          value={coef}
          onChange={setCoef}
          onCoefChange={onCoefChange}
        />
        <AccuracySlider
          value={accuracy}
          onChange={setAccuracy}
          onAccuracyChange={onAccuracyChange}
        />
      </div>
      <div className="mt-4 flex flex-col space-y-4">
        <h3 className="text-md font-semibold text-white">Filters</h3>
        <ZAccelSlider
          value={zAccel}
          onChange={setZAccel}
          onZAccelChange={onZAccelChange}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
      <div className="mt-4 flex justify-center align-middle text-center">
        <button
          onClick={resetToDefault}
          className="rounded bg-purple-600 font-bold text-white hover:bg-red-800 size-max"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default MapConfig;
