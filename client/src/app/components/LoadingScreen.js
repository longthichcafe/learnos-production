import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="border-8 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      <h2 className="mt-5 font-sans text-lg">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
