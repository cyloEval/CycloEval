import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    </div>
  );
};

export default Loader;
