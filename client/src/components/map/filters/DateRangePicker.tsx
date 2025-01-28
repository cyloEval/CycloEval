import React from 'react';

type DateRangePickerProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (startDate: string) => void;
  onEndDateChange: (endDate: string) => void;
  onDateRangeChange: (startDate: string, endDate: string) => void;
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onDateRangeChange,
}) => {
  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newStartDate = event.target.value;
    onStartDateChange(newStartDate);
    onDateRangeChange(newStartDate, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = event.target.value;
    onEndDateChange(newEndDate);
    onDateRangeChange(startDate, newEndDate);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <label
        htmlFor="start-date"
        className="block text-sm font-medium text-gray-200"
      >
        Start Date: <span className="font-bold text-white">{startDate}</span>
      </label>
      <input
        id="start-date"
        type="date"
        value={startDate}
        onChange={handleStartDateChange}
        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <label
        htmlFor="end-date"
        className="mt-4 block text-sm font-medium text-gray-200"
      >
        End Date: <span className="font-bold text-white">{endDate}</span>
      </label>
      <input
        id="end-date"
        type="date"
        value={endDate}
        onChange={handleEndDateChange}
        className="mt-1 w-full rounded-md border border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
    </div>
  );
};

export default DateRangePicker;
