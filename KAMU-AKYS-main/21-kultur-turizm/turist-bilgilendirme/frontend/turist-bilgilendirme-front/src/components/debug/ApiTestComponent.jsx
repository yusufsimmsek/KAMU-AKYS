import React, { useState } from 'react';
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import realTimeDataService from '../../services/realTimeDataService';

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const apiTests = [
    {
      id: 'afad',
      name: 'AFAD Toplanma Alanları',
      endpoint: 'https://tamp.afad.gov.tr/ToplanmaAlanlari.json',
      test: () => realTimeDataService.getAfadShelterAreas()
    },
    {
      id: 'ibb_cultural',
      name: 'İBB Kültür Etkinlikleri',
      endpoint: 'https://data.ibb.gov.tr/api/action/datastore_search',
      test: () => realTimeDataService.getIbbCulturalEvents()
    },
    {
      id: 'ibb_health',
      name: 'İBB Sağlık Kuruluşları',
      endpoint: 'İBB API',
      test: () => realTimeDataService.getIbbHealthFacilities()
    },
    {
      id: 'osm',
      name: 'OpenStreetMap POI',
      endpoint: 'https://overpass-api.de/api/interpreter',
      test: () => realTimeDataService.getOpenStreetMapPOIs('Istanbul', ['museum'])
    },
    {
      id: 'geonames',
      name: 'GeoNames Coğrafya',
      endpoint: 'https://api.geonames.org',
      test: () => realTimeDataService.getGeoNamesPlaces('Istanbul')
    },
    {
      id: 'cultural_events',
      name: 'Kültürel Etkinlikler',
      endpoint: 'https://public.opendatasoft.com',
      test: () => realTimeDataService.getCulturalEventsFromOpenData()
    }
  ];

  const runSingleTest = async (apiTest) => {
    setTestResults(prev => ({
      ...prev,
      [apiTest.id]: { status: 'loading', data: null, error: null }
    }));

    try {
      console.log(`🧪 Testing ${apiTest.name}...`);
      const startTime = Date.now();
      
      const data = await apiTest.test();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => ({
        ...prev,
        [apiTest.id]: {
          status: 'success',
          data: data,
          error: null,
          duration,
          count: Array.isArray(data) ? data.length : 0
        }
      }));
      
      console.log(`✅ ${apiTest.name} başarılı: ${Array.isArray(data) ? data.length : 0} kayıt`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [apiTest.id]: {
          status: 'error',
          data: null,
          error: error.message,
          duration: null,
          count: 0
        }
      }));
      
      console.error(`❌ ${apiTest.name} hatası:`, error);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults({});
    
    for (const apiTest of apiTests) {
      await runSingleTest(apiTest);
      // Rate limiting için kısa bekleme
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 m-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            🧪 API Bağlantı Testi
          </h2>
          <p className="text-gray-600">
            Gerçek zamanlı açık veri kaynaklarının durumunu kontrol edin
          </p>
        </div>
        
        <button
          onClick={runAllTests}
          disabled={loading}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Tüm API'leri Test Et</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiTests.map((apiTest) => {
          const result = testResults[apiTest.id];
          
          return (
            <div
              key={apiTest.id}
              className={`border rounded-lg p-4 transition-all ${
                result ? getStatusColor(result.status) : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result?.status)}
                  <h3 className="font-semibold text-gray-900">
                    {apiTest.name}
                  </h3>
                </div>
                
                <button
                  onClick={() => runSingleTest(apiTest)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Test Et
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mb-3 font-mono break-all">
                {apiTest.endpoint}
              </p>
              
              {result && (
                <div className="space-y-2">
                  {result.status === 'success' && (
                    <div className="text-sm">
                      <div className="flex justify-between text-green-700">
                        <span>✅ Başarılı</span>
                        <span>{result.count} kayıt</span>
                      </div>
                      <div className="text-xs text-green-600">
                        Süre: {result.duration}ms
                      </div>
                    </div>
                  )}
                  
                  {result.status === 'error' && (
                    <div className="text-sm">
                      <div className="text-red-700">❌ Hata</div>
                      <div className="text-xs text-red-600 bg-red-100 p-2 rounded mt-1">
                        {result.error}
                      </div>
                    </div>
                  )}
                  
                  {result.status === 'loading' && (
                    <div className="text-sm text-blue-700">
                      🔄 Test ediliyor...
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Test Sonuçları</h4>
              <p className="text-sm text-blue-700">
                Başarılı: {Object.values(testResults).filter(r => r.status === 'success').length} / {apiTests.length}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                CORS hatası alıyorsanız, tarayıcı geliştirici konsolunu kontrol edin. 
                Bazı API'ler sadece sunucu tarafından erişilebilir olabilir.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent; 