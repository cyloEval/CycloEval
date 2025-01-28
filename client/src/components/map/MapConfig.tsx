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

  return (
    <div className="rounded-lg bg-gray-900 p-4 shadow-lg">
      <div>
        <h3 className="text-md font-semibold text-white">Settings</h3>
        <CoefSlider
          value={coef}
          onChange={setCoef}
          onCoefChange={onCoefChange}
        />
        <BaseMapSelect
          value={baseMap}
          onChange={setBaseMap}
          onBaseMapChange={onBaseMapChange}
        />
      </div>
      <div className="mt-4">
        <h3 className="text-md font-semibold text-white">Filters</h3>
        <ZAccelSlider
          value={zAccel}
          onChange={setZAccel}
          onZAccelChange={onZAccelChange}
        />
        <AccuracySlider
          value={accuracy}
          onChange={setAccuracy}
          onAccuracyChange={onAccuracyChange}
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onDateRangeChange={onDateRangeChange}
        />
      </div>
    </div>
  );
};

export default MapConfig;
