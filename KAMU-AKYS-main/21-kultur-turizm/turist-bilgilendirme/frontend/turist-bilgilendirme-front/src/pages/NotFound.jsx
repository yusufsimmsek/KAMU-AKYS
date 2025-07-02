import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 leading-none">
            404
          </div>
          <div className="text-2xl font-semibold text-gray-900 mt-4">
            Sayfa Bulunamadı
          </div>
          <p className="text-gray-600 mt-2">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Sayfaya Dön
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Git
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            Popüler sayfalarımızı ziyaret edebilirsiniz:
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link
              to="/destinations"
              className="text-primary-600 hover:text-primary-700 flex items-center justify-center py-2"
            >
              Destinasyonlar
            </Link>
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 flex items-center justify-center py-2"
            >
              Etkinlikler
            </Link>
            <Link
              to="/accommodations"
              className="text-primary-600 hover:text-primary-700 flex items-center justify-center py-2"
            >
              Konaklama
            </Link>
            <Link
              to="/restaurants"
              className="text-primary-600 hover:text-primary-700 flex items-center justify-center py-2"
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