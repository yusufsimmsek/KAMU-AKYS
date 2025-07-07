import React from 'react';

const LoadingSpinner = ({ text = 'Yükleniyor...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 border-opacity-60"></div>
      <span className="mt-6 text-lg text-white font-semibold drop-shadow-lg animate-pulse">{text}</span>
    </div>
  </div>
);

// Full screen loading component
export const FullScreenLoader = ({ text = 'Yükleniyor...' }) => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
};

// Page loading component
export const PageLoader = ({ text = 'Sayfa yükleniyor...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

// Button loading component
export const ButtonLoader = ({ className = '' }) => {
  return (
    <div className="animate-spin h-4 w-4 border-t-4 border-b-4 border-purple-500 border-opacity-60"></div>
  );
};

export default LoadingSpinner; 