import { AlertTriangle } from 'lucide-react';

const ErrorCard = ({ title = 'Bir Hata Oluştu', message = 'Bir hata oluştu, lütfen tekrar deneyin.' }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="bg-red-500/10 rounded-full p-6 mb-4">
      <AlertTriangle className="w-16 h-16 text-red-500" />
    </div>
    <h2 className="text-2xl font-bold text-red-400 mb-2">{title}</h2>
    <p className="text-lg text-gray-300 max-w-md text-center">{message}</p>
  </div>
);

export default ErrorCard; 