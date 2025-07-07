import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Navigation, Eye } from 'lucide-react';
import openTripMapAPI from '../services/openTripMapAPI';
import LoadingSpinner from './UI/LoadingSpinner';

const TurkeyPlacesMap = ({ selectedPlace, onPlaceSelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 39.9334, lng: 32.8597 }); // Ankara merkez
  const [mapZoom, setMapZoom] = useState(6);
  const [showPlaceDetails, setShowPlaceDetails] = useState(null);

  // OpenTripMap API'den Türkiye yerlerini çek
  const { data: turkeyData, isLoading, error } = useQuery({
    queryKey: ['turkey-places'],
    queryFn: () => openTripMapAPI.getAllTurkeyPlaces(),
    staleTime: 10 * 60 * 1000, // 10 dakika cache
    cacheTime: 30 * 60 * 1000, // 30 dakika memory
  });

  const places = turkeyData?.places || [];

  // Seçili yere odaklan
  useEffect(() => {
    if (selectedPlace) {
      setMapCenter({ 
        lat: selectedPlace.location.lat, 
        lng: selectedPlace.location.lon 
      });
      setMapZoom(14);
      setShowPlaceDetails(selectedPlace);
    }
  }, [selectedPlace]);

  // Pin tıklama
  const handlePinClick = (place) => {
    setMapCenter({ 
      lat: place.location.lat, 
      lng: place.location.lon 
    });
    setMapZoom(14);
    setShowPlaceDetails(place);
    onPlaceSelect?.(place);
  };

  // Türkiye sınırlarına odaklan
  const focusOnTurkey = () => {
    setMapCenter({ lat: 39.9334, lng: 32.8597 });
    setMapZoom(6);
    setShowPlaceDetails(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-8 h-96 flex items-center justify-center">
        <LoadingSpinner text="Türkiye gezilecek yerleri yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-8 h-96 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">Harita yüklenirken hata oluştu</p>
          <p className="text-gray-400 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl overflow-hidden shadow-lg">
      {/* Harita Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Türkiye Gezilecek Yerler</h3>
            <p className="text-sm text-gray-400">{places.length} yer bulundu</p>
          </div>
        </div>
        
        <button
          onClick={focusOnTurkey}
          className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 flex items-center space-x-2"
        >
          <Navigation className="w-4 h-4" />
          <span>Türkiye'ye Odaklan</span>
        </button>
      </div>

      {/* Harita Alanı */}
      <div className="relative h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20">
        {/* Basit Harita Simülasyonu */}
        <div className="absolute inset-0 bg-gray-800 rounded-b-2xl overflow-hidden">
          <div className="w-full h-full relative bg-gradient-to-br from-green-900/30 to-blue-900/30">
            {/* Türkiye harita silüeti (basit) */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-gradient-to-br from-amber-600/40 to-orange-600/40 rounded-2xl"></div>
            </div>
            
            {/* Gezilecek Yerler Pinleri */}
            {places.map((place, index) => (
              <PlacePin
                key={place.id || index}
                place={place}
                onClick={() => handlePinClick(place)}
                isSelected={showPlaceDetails?.id === place.id}
                style={{
                  position: 'absolute',
                  left: `${((place.location.lon - 26) / (45 - 26)) * 100}%`,
                  top: `${((42 - place.location.lat) / (42 - 36)) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Seçili Yer Detayları */}
        {showPlaceDetails && (
          <PlaceDetailsPopup 
            place={showPlaceDetails} 
            onClose={() => setShowPlaceDetails(null)}
          />
        )}
      </div>

      {/* Harita Kontrolları */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Müze</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Anıt</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Doğa</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Tarihi</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Detay için pinlere tıklayın</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pin Component
const PlacePin = ({ place, onClick, isSelected, style }) => {
  const getPinColor = (category) => {
    switch (category) {
      case 'Müze': return 'bg-red-500';
      case 'Anıt': return 'bg-blue-500';
      case 'Doğa': return 'bg-green-500';
      case 'Tarihi': return 'bg-purple-500';
      case 'Dini Yapı': return 'bg-yellow-500';
      case 'Kale': return 'bg-orange-500';
      default: return 'bg-cyan-500';
    }
  };

  return (
    <div
      style={style}
      onClick={onClick}
      className={`cursor-pointer transform transition-all duration-300 hover:scale-125 z-10 ${
        isSelected ? 'scale-150 z-20' : ''
      }`}
    >
      <div className={`w-4 h-4 ${getPinColor(place.category)} rounded-full border-2 border-white shadow-lg pulse`}>
        <div className="w-full h-full rounded-full animate-ping opacity-75"></div>
      </div>
      {isSelected && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg">
          {place.name}
        </div>
      )}
    </div>
  );
};

// Yer Detayları Popup
const PlaceDetailsPopup = ({ place, onClose }) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-95 backdrop-blur-lg rounded-xl p-4 shadow-xl z-30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-lg">{place.name}</h4>
          <p className="text-sm text-gray-600">{place.location.address}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-3 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>
      
      <div className="flex space-x-3">
        <img
          src={place.image}
          alt={place.name}
          className="w-20 h-20 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop';
          }}
        />
        <div className="flex-1">
          <p className="text-sm text-gray-700 leading-relaxed">
            {place.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {place.category}
            </span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < place.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">({place.rating}/5)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurkeyPlacesMap; 