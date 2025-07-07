import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-none">
            404
          </div>
          <div className="text-2xl font-semibold text-white mt-4">
            Sayfa Bulunamadı
          </div>
          <p className="text-gray-300 mt-2">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 inline-flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 hover:bg-opacity-10 text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-300 inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Git
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-white border-opacity-10">
          <p className="text-sm text-gray-400 mb-4">
            Popüler sayfalarımızı ziyaret edebilirsiniz:
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/destinations"
              className="text-purple-400 hover:text-purple-300 flex items-center justify-center py-2 transition-colors duration-300"
            >
              Gezilecek Yerler
            </Link>
            <Link
              to="/events"
              className="text-purple-400 hover:text-purple-300 flex items-center justify-center py-2 transition-colors duration-300"
            >
              Etkinlikler
            </Link>
            <Link
              to="/accommodations"
              className="text-purple-400 hover:text-purple-300 flex items-center justify-center py-2 transition-colors duration-300"
            >
              Konaklama
            </Link>
            <Link
              to="/restaurants"
              className="text-purple-400 hover:text-purple-300 flex items-center justify-center py-2 transition-colors duration-300"
            >
              Restoranlar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 