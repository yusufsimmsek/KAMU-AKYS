import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsAPI } from '../services/api';
import { Search, Filter, MapPin, Star, Heart, Grid, List } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatDate, generateStars, truncateText, categoryTranslations } from '../utils';

const Destinations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'name');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  // Build query parameters
  const queryParams = {
    page,
    limit,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedCategory && { category: selectedCategory }),
    sort: sortBy,
  };

  // Fetch destinations
  const { data, isLoading, error } = useQuery({
    queryKey: ['destinations', queryParams],
    queryFn: () => destinationsAPI.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (sortBy !== 'name') params.set('sort', sortBy);
    if (page !== 1) params.set('page', page.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, sortBy, page, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    const params = new URLSearchParams(searchParams);
    params.delete('page');
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    setSearchParams(params);
  };

  const categories = Object.keys(categoryTranslations.destinations);
  const sortOptions = [
    { value: 'name', label: 'İsme Göre' },
    { value: 'rating', label: 'Puana Göre' },
    { value: 'reviews', label: 'Yorum Sayısına Göre' },
    { value: 'newest', label: 'En Yeni' },
  ];

  const destinations = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Destinasyonlar
            </h1>
            <p className="text-lg text-gray-600">
              Türkiye'nin en güzel yerlerini keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Destinasyon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryTranslations.destinations[category]}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Destinasyonlar yükleniyor..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Bir hata oluştu: {error.message}</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Destinasyon bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinizi değiştirip tekrar deneyin.
            </p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {data?.total || 0} destinasyon bulundu
              </p>
            </div>

            {/* Destinations Grid/List */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-6'
            }>
              {destinations.map((destination) => (
                <DestinationCard
                  key={destination._id}
                  destination={destination}
                  viewMode={viewMode}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Destination Card Component
const DestinationCard = ({ destination, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex">
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={destination.images?.[0] || '/images/placeholder-destination.jpg'}
              alt={destination.name.tr}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {destination.name.tr}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded">
                    {categoryTranslations.destinations[destination.category] || destination.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  {truncateText(destination.description.tr, 150)}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {generateStars(destination.averageRating || 0).map((star, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          star === 'full'
                            ? 'text-yellow-400 fill-current'
                            : star === 'half'
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({destination.reviewCount || 0})
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {destination.location.city}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <Link
                  to={`/destinations/${destination._id}`}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Detaylar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={destination.images?.[0] || '/images/placeholder-destination.jpg'}
          alt={destination.name.tr}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {categoryTranslations.destinations[destination.category] || destination.category}
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full text-gray-600 hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {destination.name.tr}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {truncateText(destination.description.tr, 80)}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {generateStars(destination.averageRating || 0).map((star, index) => (
              <Star
                key={index}
                className={`w-4 h-4 ${
                  star === 'full'
                    ? 'text-yellow-400 fill-current'
                    : star === 'half'
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">
              ({destination.reviewCount || 0})
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            {destination.location.city}
          </div>
        </div>
        <Link
          to={`/destinations/${destination._id}`}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center block"
        >
          Detayları Gör
        </Link>
      </div>
    </div>
  );
};

export default Destinations; 