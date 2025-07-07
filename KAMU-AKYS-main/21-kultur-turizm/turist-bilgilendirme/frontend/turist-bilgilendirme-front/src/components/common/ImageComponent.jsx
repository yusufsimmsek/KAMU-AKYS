import React from 'react';
import { Camera } from 'lucide-react';

const ImageComponent = ({ 
  query, 
  category = 'general', 
  className = '', 
  aspectRatio = 'aspect-video',
  fallbackText = 'Görsel bulunamadı',
  alt = ''
}) => {
  // Basit fallback görseller
  const getFallbackImage = (category, query) => {
    const baseUrl = 'https://images.unsplash.com/photo-';
    const imageMap = {
      'tourism': '1539650116574-75c0c6d0dd4d', // Turkey landscape
      'culture': '1524231757912-21f4fe3a7200', // Museum
      'museum': '1524231757912-21f4fe3a7200', // Museum
      'nature': '1506905925346-21bda4d32df4', // Nature
      'architecture': '1533929736458-ca588d08c8be', // Architecture
      'art': '1541961017774-80a60c87a3c6', // Art
      'history': '1533929736458-ca588d08c8be', // Historic
      'event': '1470229722913-7c0e2dbbafd3', // Event
      'food': '1567620905732-2d1ec7ab7445', // Food
      'general': '1539650116574-75c0c6d0dd4d' // Default
    };
    
    // Query'ye göre özel görseller
    if (query && query.toLowerCase().includes('kapadokya')) {
      return '1624714217530-0e72ea4c6b0c'; // Cappadocia
    }
    if (query && query.toLowerCase().includes('pamukkale')) {
      return '1583055942906-c9bc0d2d4b2b'; // Pamukkale
    }
    if (query && query.toLowerCase().includes('antalya')) {
      return '1539650116574-75c0c6d0dd4d'; // Antalya
    }
    if (query && query.toLowerCase().includes('istanbul')) {
      return '1541432901042-2d8bd64b4b0a'; // Istanbul
    }
    
    return imageMap[category] || imageMap['general'];
  };

  const imageId = getFallbackImage(category, query);
  const imageUrl = `https://images.unsplash.com/photo-${imageId}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`;

  return (
    <div className={`relative ${className} group`}>
      <div className={`${aspectRatio} bg-gray-100 rounded-lg overflow-hidden relative`}>
        <img
          src={imageUrl}
          alt={alt || query || fallbackText}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Eğer Unsplash yüklenemezse placeholder göster
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback placeholder */}
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-500" style={{display: 'none'}}>
          <div className="text-center">
            <Camera className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">{fallbackText}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComponent; 