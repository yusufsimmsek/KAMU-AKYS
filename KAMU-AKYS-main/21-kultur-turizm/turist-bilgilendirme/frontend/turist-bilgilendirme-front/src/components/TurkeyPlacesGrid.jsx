import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Filter, Search, Grid, List, ExternalLink, Heart, Map } from 'lucide-react';
import openTripMapAPI from '../services/openTripMapAPI';
import LoadingSpinner from './UI/LoadingSpinner';

const TurkeyPlacesGrid = ({ onPlaceSelect, selectedPlace }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  const placesPerPage = 12;

  // OpenTripMap API'den Türkiye yerlerini çek
  const { data: turkeyData, isLoading, error } = useQuery({
    queryKey: ['turkey-places'],
    queryFn: () => openTripMapAPI.getAllTurkeyPlaces(),
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const allPlaces = turkeyData?.places || [];

  // Filtreleme ve arama
  const filteredPlaces = allPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sıralama
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // Sayfalama
  const totalPages = Math.ceil(sortedPlaces.length / placesPerPage);
  const startIndex = (currentPage - 1) * placesPerPage;
  const paginatedPlaces = sortedPlaces.slice(startIndex, startIndex + placesPerPage);

  // Kategoriler
  const categories = [...new Set(allPlaces.map(place => place.category))].sort();

  // Favorilere ekle/çıkar
  const toggleFavorite = (placeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(placeId)) {
      newFavorites.delete(placeId);
    } else {
      newFavorites.add(placeId);
    }
    setFavorites(newFavorites);
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
      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-8">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Veri Yüklenirken Hata Oluştu</h3>
          <p className="text-red-400">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtreler ve Arama */}
      <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Arama */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Gezilecek yer ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
              />
            </div>
          </div>

          {/* Kategori Filtresi */}
          <div className="lg:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            >
              <option value="" className="bg-gray-800 text-white">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800 text-white">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sıralama */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
            >
              <option value="name" className="bg-gray-800 text-white">İsme Göre</option>
              <option value="rating" className="bg-gray-800 text-white">Puana Göre</option>
              <option value="category" className="bg-gray-800 text-white">Kategoriye Göre</option>
            </select>
          </div>

          {/* Görünüm Modu */}
          <div className="flex bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition duration-300 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="mt-4 text-sm text-gray-400 flex items-center justify-between">
          <span>{filteredPlaces.length} yer bulundu ({allPlaces.length} toplam)</span>
          <span>Sayfa {currentPage} / {totalPages}</span>
        </div>
      </div>

      {/* Yerler Grid/List */}
      {paginatedPlaces.length === 0 ? (
        <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-12 text-center">
          <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Yer Bulunamadı</h3>
          <p className="text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {paginatedPlaces.map((place, index) => (
            <PlaceCard
              key={place.id || index}
              place={place}
              viewMode={viewMode}
              isSelected={selectedPlace?.id === place.id}
              isFavorite={favorites.has(place.id)}
              onSelect={() => onPlaceSelect?.(place)}
              onToggleFavorite={() => toggleFavorite(place.id)}
            />
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg transition duration-300 ${
                currentPage === index + 1
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white bg-opacity-5 text-gray-400 hover:text-white hover:bg-opacity-10'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Yer Kartı Component
const PlaceCard = ({ place, viewMode, isSelected, isFavorite, onSelect, onToggleFavorite }) => {
  if (viewMode === 'list') {
    return (
      <div className={`bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
      }`}>
        <div className="flex space-x-4">
          <img
            src={place.image}
            alt={place.name}
            className="w-24 h-24 object-cover rounded-xl"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=96&h=96&fit=crop';
            }}
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-white">{place.name}</h3>
              <button
                onClick={onToggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mb-3 leading-relaxed overflow-hidden" style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 3, 
              WebkitBoxOrient: 'vertical' 
            }}>
              {place.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="inline-block bg-purple-500 bg-opacity-20 text-purple-300 text-xs px-2 py-1 rounded-full">
                  {place.category}
                </span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < place.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-400 ml-1">({place.rating}/5)</span>
                </div>
              </div>
              
              <button
                onClick={onSelect}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:shadow-lg flex items-center space-x-2"
              >
                <Map className="w-4 h-4" />
                <span>Haritada Gör</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl ${
      isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
    }`}>
      <div className="relative">
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop';
          }}
        />
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-lg transition-colors ${
            isFavorite ? 'text-red-500' : 'text-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute top-3 left-3 bg-purple-500 bg-opacity-80 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {place.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{place.name}</h3>
        <p className="text-gray-400 text-sm mb-3 leading-relaxed overflow-hidden" style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 3, 
          WebkitBoxOrient: 'vertical' 
        }}>
          {place.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < place.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-sm text-gray-400 ml-1">({place.rating}/5)</span>
          </div>
          
          <button
            onClick={onSelect}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:shadow-lg flex items-center space-x-1"
          >
            <Map className="w-4 h-4" />
            <span>Harita</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TurkeyPlacesGrid; 