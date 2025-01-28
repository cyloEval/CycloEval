import React from 'react';

type FilterToggleButtonProps = {
  onClick: () => void;
  showFilters: boolean;
};

const FilterToggleButton: React.FC<FilterToggleButtonProps> = ({
  onClick,
  showFilters,
}) => {
  return (
    <button
      onClick={onClick}
      className="absolute -right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-xl bg-blue-500 text-white hover:bg-blue-700 focus:outline-none"
    >
      {showFilters ? '⇦' : '⇨'}
    </button>
  );
};

export default FilterToggleButton;
