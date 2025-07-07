import { useState } from 'react';
import { MapPin, Database, Plus, Eye, CheckCircle, XCircle, Info } from 'lucide-react';

const AdminTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleApiCall = async (endpoint, method = 'GET', body = null, key) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [key]: {
          status: response.ok ? 'success' : 'error',
          data: data,
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [key]: {
          status: 'error',
          data: { message: error.message },
          timestamp: new Date().toLocaleTimeString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const testActions = [
    {
      key: 'count',
      title: 'Gezilecek Yer Sayısını Getir',
      description: 'Veritabanındaki toplam gezilecek yer sayısını kontrol eder',
      endpoint: '/admin/data/destinations/count',
      method: 'GET',
      icon: Database
    },
    {
      key: 'all',
      title: 'Tüm Gezilecek Yerleri Listele',
      description: 'Veritabanındaki tüm gezilecek yerleri getirir',
      endpoint: '/admin/data/destinations/all',
      method: 'GET',
      icon: Eye
    },
    {
      key: 'init_ayasofya',
      title: 'Ayasofya Verisini Ekle',
      description: 'Ayasofya Camii verisini veritabanına ekler',
      endpoint: '/admin/data/init-ayasofya',
      method: 'POST',
      icon: Plus
    }
  ];

  const renderResult = (key) => {
    const result = results[key];
    if (!result) return null;

    const isSuccess = result.status === 'success';
    const StatusIcon = isSuccess ? CheckCircle : XCircle;

    return (
      <div className={`mt-4 p-4 rounded-xl border ${
        isSuccess 
          ? 'bg-success-50 border-success-200' 
          : 'bg-error-50 border-error-200'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          <StatusIcon className={`w-5 h-5 ${
            isSuccess ? 'text-success-600' : 'text-error-600'
          }`} />
          <span className={`font-medium ${
            isSuccess ? 'text-success-800' : 'text-error-800'
          }`}>
            {result.timestamp} - {isSuccess ? 'Başarılı' : 'Hata'}
          </span>
        </div>
        <pre className={`text-sm p-3 rounded-lg overflow-auto max-h-64 ${
          isSuccess 
            ? 'bg-success-100 text-success-800' 
            : 'bg-error-100 text-error-800'
        }`}>
          {JSON.stringify(result.data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-primary-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Database className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            API Test Paneli
          </h1>
          <p className="text-xl text-dark-500 max-w-2xl mx-auto">
            Veritabanı işlemlerini test edin ve Ayasofya verisini yönetin
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-info-50 to-primary-50 border border-info-200 rounded-xl p-6 mb-8 animate-slide-up">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-info-400 to-primary-400 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-info-800 mb-2">API Test Bilgileri</h3>
              <div className="text-sm text-info-700 space-y-1">
                <p><strong>Backend URL:</strong> {API_BASE_URL}</p>
                <p><strong>Veritabanı:</strong> PostgreSQL (turistdb)</p>
                <p><strong>Güvenlik:</strong> CORS etkinleştirildi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="grid gap-6">
          {testActions.map((action, index) => {
            const IconComponent = action.icon;
            const isLoading = loading[action.key];
            
            return (
              <div 
                key={action.key}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-dark-800 mb-2">{action.title}</h3>
                    <p className="text-dark-500 mb-4">{action.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-dark-400">
                      <span className="bg-primary-100 px-2 py-1 rounded-lg font-mono">{action.method}</span>
                      <span className="font-mono">{action.endpoint}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApiCall(action.endpoint, action.method, null, action.key)}
                    disabled={isLoading}
                    className="group bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2 inline-block"></div>
                        Çalışıyor...
                      </>
                    ) : (
                      'Çalıştır'
                    )}
                  </button>
                </div>
                
                {renderResult(action.key)}
              </div>
            );
          })}
        </div>

        {/* Ayasofya Preview */}
        <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-6 animate-fade-in">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-dark-800">Ayasofya Camii - Veri Önizleme</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-dark-700 mb-2">Temel Bilgiler</h4>
              <div className="space-y-2 text-sm text-dark-600">
                <p><strong>Ad:</strong> Ayasofya Camii</p>
                <p><strong>Kategori:</strong> Tarihi Yer</p>
                <p><strong>Şehir:</strong> İstanbul / Fatih</p>
                <p><strong>Bölge:</strong> Marmara</p>
                <p><strong>Puan:</strong> 4.8 ⭐ (1245 değerlendirme)</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-dark-700 mb-2">Özellikler</h4>
              <div className="space-y-2 text-sm text-dark-600">
                <p><strong>Konum:</strong> 41.0086, 28.9802</p>
                <p><strong>Erişilebilirlik:</strong> Tekerlekli sandalye uyumlu</p>
                <p><strong>Rehber:</strong> Sesli rehber mevcut</p>
                <p><strong>Giriş:</strong> Ücretsiz</p>
                <p><strong>Durum:</strong> Aktif, Öne Çıkan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest; 