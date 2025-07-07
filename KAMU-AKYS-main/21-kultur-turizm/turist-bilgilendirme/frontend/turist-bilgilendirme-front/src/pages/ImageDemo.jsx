import React, { useState } from 'react';
import { Search, RefreshCw, Settings, Info, Download, ExternalLink } from 'lucide-react';
import ImageComponent from '../components/common/ImageComponent';
import ImageComponentDemo from '../components/common/ImageComponentDemo';
import ImageGallery from '../components/common/ImageGallery';
import useImages from '../hooks/useImages';

const ImageDemo = () => {
  const [query, setQuery] = useState('istanbul müze');
  const [category, setCategory] = useState('museum');
  const [count, setCount] = useState(6);
  const [showGallery, setShowGallery] = useState(true);
  const [showAttribution, setShowAttribution] = useState(true);
  const [showInfo, setShowInfo] = useState(true);

  const { images, loading, error, refreshImages, clearCache } = useImages(query, category, count);

  const categories = [
    { value: 'museum', label: 'Müze' },
    { value: 'culture', label: 'Kültür' },
    { value: 'nature', label: 'Doğa' },
    { value: 'architecture', label: 'Mimari' },
    { value: 'art', label: 'Sanat' },
    { value: 'history', label: 'Tarih' },
    { value: 'tourism', label: 'Turizm' },
    { value: 'event', label: 'Etkinlik' },
    { value: 'food', label: 'Yemek' },
    { value: 'general', label: 'Genel' }
  ];

  const sampleQueries = [
    'İstanbul Ayasofya',
    'Kapadokya balon',
    'Ephesus antik tiyatro',
    'Pamukkale travertenler',
    'Topkapı Sarayı',
    'Galata Kulesi',
    'Antalya antik tiyatro',
    'Konya Mevlana'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    refreshImages();
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  const downloadImages = () => {
    images.forEach((image, index) => {
      const link = document.createElement('a');
      link.href = image.url;
      link.download = `${query}-${index + 1}.jpg`;
      link.target = '_blank';
      link.click();
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Açık Kaynak Görsel Sistemi
              </h1>
              <p className="text-gray-600 mt-1">
                Metropolitan Museum, Europeana, Smithsonian ve Wikimedia Commons'tan otomatik görsel çekme
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={clearCache}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Önbelleği Temizle
              </button>
              <button
                onClick={downloadImages}
                disabled={images.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Görselleri İndir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Kontroller
              </h2>

              {/* Search Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arama Sorgusu
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Örnek: İstanbul müze"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görsel Sayısı
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                >
                  {loading ? 'Yükleniyor...' : 'Görselleri Çek'}
                </button>
              </form>

              {/* Sample Queries */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Örnek Sorgular
                </h3>
                <div className="space-y-2">
                  {sampleQueries.map((sampleQuery, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleQuery(sampleQuery)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md border border-gray-200"
                    >
                      {sampleQuery}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Options */}
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Görüntüleme Seçenekleri
                </h3>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showGallery}
                    onChange={(e) => setShowGallery(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Galeri Görünümü</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAttribution}
                    onChange={(e) => setShowAttribution(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Atıf Göster</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showInfo}
                    onChange={(e) => setShowInfo(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Bilgi Butonu</span>
                </label>
              </div>

              {/* API Status */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  API Durumu
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Metropolitan Museum</span>
                    <span className="text-green-600">●</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Europeana</span>
                    <span className="text-green-600">●</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Smithsonian</span>
                    <span className="text-green-600">●</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wikimedia Commons</span>
                    <span className="text-green-600">●</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Görseller yükleniyor...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Info className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Hata</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* Results Info */}
                {images.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {images.length} görsel bulundu
                        </h3>
                        <p className="text-sm text-gray-600">
                          Sorgu: "{query}" | Kategori: {categories.find(c => c.value === category)?.label}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {images.filter(img => img.isFallback).length} fallback
                        </span>
                        <span className="text-sm text-gray-500">
                          {images.filter(img => !img.isFallback).length} API
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gallery View */}
                {showGallery && images.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Galeri Görünümü
                    </h3>
                                         <ImageGallery
                       query={query}
                       category={category}
                       count={count}
                       showThumbnails={true}
                       showAttribution={true}
                       className=""
                     />
                  </div>
                )}

                {/* Individual Components */}
                {images.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Bireysel Görsel Bileşenleri
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {images.slice(0, 6).map((image, index) => (
                        <div key={index} className="space-y-2">
                                                     <ImageComponentDemo
                             query={query}
                             category={category}
                             count={1}
                             showAttribution={true}
                             showInfo={true}
                             className="h-48"
                           />
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center justify-between">
                              <span>{image.source}</span>
                              {image.isFallback && (
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                  Fallback
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {!loading && images.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Görsel bulunamadı
                    </h3>
                    <p className="text-gray-600">
                      Farklı bir arama terimi veya kategori deneyin
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Metropolitan Museum</h3>
              <p className="text-sm text-gray-600">
                CC0 1.0 Universal lisansı altında yayınlanan sanat eserleri ve kültürel objeler
              </p>
              <a href="https://collectionapi.metmuseum.org" className="text-blue-600 text-sm mt-2 inline-flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                API Dokümantasyonu
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Europeana</h3>
              <p className="text-sm text-gray-600">
                Avrupa'nın dijital kültürel mirası koleksiyonu
              </p>
              <a href="https://pro.europeana.eu/page/apis" className="text-blue-600 text-sm mt-2 inline-flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                API Dokümantasyonu
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Smithsonian</h3>
              <p className="text-sm text-gray-600">
                Smithsonian Enstitüsü'nün açık erişim koleksiyonu
              </p>
              <a href="https://www.si.edu/openaccess" className="text-blue-600 text-sm mt-2 inline-flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                Open Access
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Wikimedia Commons</h3>
              <p className="text-sm text-gray-600">
                Özgürce kullanılabilen medya dosyalarının deposu
              </p>
              <a href="https://commons.wikimedia.org/wiki/Commons:API" className="text-blue-600 text-sm mt-2 inline-flex items-center">
                <ExternalLink className="w-3 h-3 mr-1" />
                API Dokümantasyonu
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDemo; 