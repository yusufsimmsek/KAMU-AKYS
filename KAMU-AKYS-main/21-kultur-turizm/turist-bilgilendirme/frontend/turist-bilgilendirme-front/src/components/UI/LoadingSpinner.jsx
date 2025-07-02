import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', className = '', text = 'Yükleniyor...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} text-primary-600 animate-spin`} />
      {text && (
        <p className="mt-2 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
};

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
    <Loader2 className={`w-4 h-4 animate-spin ${className}`} />
  );
};

export default LoadingSpinner; 