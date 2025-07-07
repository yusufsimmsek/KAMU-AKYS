import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Info, ExternalLink, Download, Heart, Share2 } from 'lucide-react';
import useImages from '../../hooks/useImages';

const ImageGallery = ({ 
  query, 
  category = 'general', 
  count = 6, 
  showThumbnails = true,
  showAttribution = false,
  className = ""
}) => {
  const { images, loading, error, refreshImages } = useImages(query, category, count);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowInfo(false);
  };

  const downloadImage = (image) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `${image.title}.jpg`;
    link.target = '_blank';
    link.click();
  };

  const shareImage = (image) => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.description,
        url: image.url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(image.url);
      alert('Görsel URL\'si kopyalandı!');
    }
  };

  if (loading) {
    return (
      <div className={`${className} flex items-center justify-center h-96`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Görseller yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={`${className} flex items-center justify-center h-96 bg-gray-100 rounded-lg`}>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Görsel bulunamadı</p>
          <button
            onClick={refreshImages}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Main Image */}
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden group">
        {currentImage && (
          <>
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openModal(currentIndex)}
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/800x600/?${category || 'turkey'},culture&sig=${Math.floor(Math.random() * 1000)}`;
              }}
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Fallback Indicator */}
            {currentImage.isFallback && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                Örnek Görsel
              </div>
            )}
          </>
        )}
      </div>

      {/* Attribution */}
      {showAttribution && currentImage && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">{currentImage.title}</p>
              <p className="text-gray-600">{currentImage.description}</p>
            </div>
            <span className="text-gray-500 text-xs">{currentImage.source}</span>
          </div>
        </div>
      )}

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://source.unsplash.com/200x150/?${category || 'turkey'},culture&sig=${Math.floor(Math.random() * 1000)}`;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && currentImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Action Buttons */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
              >
                <Info className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => downloadImage(currentImage)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => shareImage(currentImage)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <img
              src={currentImage.url}
              alt={currentImage.title}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.src = `https://source.unsplash.com/1200x800/?${category || 'turkey'},culture&sig=${Math.floor(Math.random() * 1000)}`;
              }}
            />

            {/* Navigation in Modal */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Info Panel */}
            {showInfo && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{currentImage.title}</h3>
                <p className="text-sm mb-2">{currentImage.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span>Kaynak: {currentImage.source}</span>
                  <span>Lisans: {currentImage.license}</span>
                </div>
                <p className="text-xs mt-1 text-gray-300">{currentImage.attribution}</p>
                {currentImage.url && (
                  <a
                    href={currentImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Orijinal Görseli Gör
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery; 