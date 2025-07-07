import React, { useState, useEffect } from 'react';
import { Camera, Info, ExternalLink, Loader2 } from 'lucide-react';
import imageService from '../../services/imageService';

const ImageComponentDemo = ({ 
  query, 
  category = 'general', 
  className = '', 
  showAttribution = true,
  showInfo = true,
  count = 1,
  aspectRatio = 'aspect-video',
  fallbackText = 'Görsel bulunamadı'
}) => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (query) {
      fetchImages();
    }
  }, [query, category, count]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedImages = await imageService.fetchImagesForContent(query, category, count);
      setImages(fetchedImages);
      setCurrentImageIndex(0);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
      // Set fallback image
      setImages([{
        url: `https://source.unsplash.com/600x400/?${category || 'turkey'},culture&sig=${Math.floor(Math.random() * 1000)}`,
        title: fallbackText,
        description: 'Varsayılan görsel',
        source: 'Unsplash',
        license: 'Unsplash License',
        attribution: 'Unsplash',
        isFallback: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const currentImage = images[currentImageIndex];

  const handleImageError = (event) => {
    // If primary image fails, try fallback
    const fallbackUrl = `https://source.unsplash.com/600x400/?${category || 'turkey'},culture&sig=${Math.floor(Math.random() * 1000)}`;
    event.target.src = fallbackUrl;
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className={`${className} ${aspectRatio} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <span className="text-sm">Görsel yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error && images.length === 0) {
    return (
      <div className={`${className} ${aspectRatio} bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="flex flex-col items-center text-gray-500">
          <Camera className="w-8 h-8 mb-2" />
          <span className="text-sm">{fallbackText}</span>
        </div>
      </div>
    );
  }

  if (!currentImage) {
    return null;
  }

  return (
    <div className={`relative ${className} group`}>
      {/* Main Image */}
      <div className={`${aspectRatio} bg-gray-100 rounded-lg overflow-hidden relative`}>
        <img
          src={currentImage.url}
          alt={currentImage.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Loading overlay */}
        <div className="absolute inset-0 bg-gray-200 animate-pulse hidden" id="img-loading" />
        
        {/* Navigation arrows for multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Info button */}
        {showInfo && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Info className="w-4 h-4" />
          </button>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Fallback indicator - Show in demo */}
        {currentImage.isFallback && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">
            Fallback Görsel
          </div>
        )}
      </div>

      {/* Attribution */}
      {showAttribution && (
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span className="font-medium">{currentImage.title}</span>
            <span className="text-gray-500">{currentImage.source}</span>
          </div>
          {currentImage.description && (
            <p className="text-gray-500 mt-1">{currentImage.description}</p>
          )}
        </div>
      )}

      {/* Detailed info modal */}
      {showDetails && (
        <div className="absolute inset-0 bg-black/80 rounded-lg z-10 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">{currentImage.title}</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Kaynak:</strong> {currentImage.source}</p>
              <p><strong>Açıklama:</strong> {currentImage.description}</p>
              <p><strong>Lisans:</strong> {currentImage.license}</p>
              <p><strong>Atıf:</strong> {currentImage.attribution}</p>
              {currentImage.isFallback && (
                <p><strong>Tür:</strong> <span className="text-yellow-600">Fallback Görsel</span></p>
              )}
            </div>
            
            {currentImage.url && (
              <a
                href={currentImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Orijinal Görseli Gör
              </a>
            )}
          </div>
        </div>
      )}

      {/* Thumbnail navigation for multiple images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? 'border-blue-500 scale-110' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageComponentDemo; 