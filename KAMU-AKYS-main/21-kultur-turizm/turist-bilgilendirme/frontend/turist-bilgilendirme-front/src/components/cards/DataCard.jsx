import React from 'react';
import { ExternalLink, MapPin, Clock, Phone, Globe, Star, Calendar, Shield, Navigation } from 'lucide-react';
import ImageComponent from '../common/ImageComponent';

const DataCard = ({ 
  data, 
  category, 
  onLocationClick = null,
  className = '',
  showAttribution = false
}) => {
  if (!data) return null;

  // Kategori ikonları ve renkleri
  const getCategoryConfig = (categoryType) => {
    switch (categoryType) {
      case 'cultural':
        return { icon: MapPin, color: 'from-purple-500 to-indigo-500', bgColor: 'bg-purple-50' };
      case 'events':
        return { icon: Calendar, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' };
      case 'transportation':
        return { icon: Navigation, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' };
      case 'emergency':
        return { icon: Shield, color: 'from-red-500 to-pink-500', bgColor: 'bg-red-50' };
      case 'restaurants':
        return { icon: MapPin, color: 'from-orange-500 to-red-500', bgColor: 'bg-orange-50' };
      case 'accommodations':
        return { icon: MapPin, color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-50' };
      case 'geo':
      case 'geographic':
        return { icon: Globe, color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-50' };
      default:
        return { icon: MapPin, color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const config = getCategoryConfig(data.categoryType || category);
  const Icon = config.icon;

  // Konum tıklama handler
  const handleLocationClick = () => {
    if (onLocationClick && data.coordinates) {
      onLocationClick(data.coordinates, data.name || data.title);
    }
  };

  // Değerlendirme gösterimi
  const renderRating = (rating) => {
    if (!rating) return null;
    
    const numRating = parseFloat(rating);
    if (isNaN(numRating)) return null;
    
    const stars = Math.round(numRating);
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < stars ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({numRating})</span>
      </div>
    );
  };

  // Tarih formatlama
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // URL formatlama
  const formatUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `https://${url}`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden ${className}`}>
      {/* Header with Icon and Category */}
      <div className={`bg-gradient-to-r ${config.color} px-4 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-5 h-5 text-white" />
            <span className="text-white font-medium text-sm">
              {data.category || category || 'Genel'}
            </span>
          </div>
          {data.source && (
            <div className="text-xs text-white/80">
              {data.source}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
          {data.name || data.title || 'Başlık Yok'}
        </h3>

        {/* Image */}
        <div className="relative">
          <ImageComponent
            query={`${data.name || data.title} ${data.location || ''}`}
            category={data.categoryType || category || 'general'}
            className="w-full h-48 rounded-lg overflow-hidden"
            aspectRatio="aspect-[16/9]"
            alt={data.name || data.title}
          />
        </div>

        {/* Description */}
        {data.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {data.description}
          </p>
        )}

        {/* Rating */}
        {data.rating && renderRating(data.rating)}

        {/* Info Grid */}
        <div className="space-y-2">
          {/* Location */}
          {(data.location || data.address) && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                {data.location || data.address}
              </span>
            </div>
          )}

          {/* Phone */}
          {data.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{data.phone}</span>
            </div>
          )}

          {/* Date */}
          {data.date && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700">{formatDate(data.date)}</span>
            </div>
          )}

          {/* Website */}
          {data.website && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <a 
                href={formatUrl(data.website)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 truncate"
              >
                {data.website}
              </a>
            </div>
          )}

          {/* Opening Hours */}
          {data.opening_hours && (
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">{data.opening_hours}</span>
            </div>
          )}

          {/* Cuisine (for restaurants) */}
          {data.cuisine && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">🍽️ {data.cuisine}</span>
            </div>
          )}

          {/* Type (for accommodations) */}
          {data.type && data.categoryType === 'accommodations' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">🏨 {data.type}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        {/* Show on Map Button */}
        {data.coordinates && onLocationClick && (
          <button
            onClick={handleLocationClick}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex-1"
          >
            <MapPin className="w-4 h-4" />
            <span>Haritada Göster</span>
          </button>
        )}

        {/* External Link */}
        {data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex-1 justify-center"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Detaylar</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default DataCard; 