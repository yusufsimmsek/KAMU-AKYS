import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { accommodationsAPI } from '../services/api';
import { Search, Bed, MapPin, Star, Wifi, Car } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatCurrency, generateStars, truncateText, categoryTranslations } from '../utils';

const Accommodations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  const queryParams = {
    page,
    limit,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedCategory && { category: selectedCategory }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['accommodations', queryParams],
    queryFn: () => accommodationsAPI.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  });

  const accommodations = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Konaklama</h1>
            <p className="text-lg text-gray-600">Konforlu konaklama seçeneklerini keşfedin</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Konaklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tüm Kategoriler</option>
            {Object.keys(categoryTranslations.accommodations).map((category) => (
              <option key={category} value={category}>
                {categoryTranslations.accommodations[category]}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Konaklama seçenekleri yükleniyor..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((accommodation) => (
              <div key={accommodation._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={accommodation.images?.[0] || '/images/placeholder-hotel.jpg'}
                    alt={accommodation.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    {categoryTranslations.accommodations[accommodation.type] || accommodation.type}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {accommodation.name}
                  </h3>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {generateStars(accommodation.averageRating || 0).map((star, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          star === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({accommodation.reviewCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {accommodation.location.city}
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center space-x-3 mb-4">
                    {accommodation.amenities?.includes('wifi') && (
                      <Wifi className="w-4 h-4 text-gray-500" />
                    )}
                    {accommodation.amenities?.includes('parking') && (
                      <Car className="w-4 h-4 text-gray-500" />
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {accommodation.priceRange?.min && (
                        <div className="text-primary-600 font-semibold">
                          {formatCurrency(accommodation.priceRange.min)}/gece
                        </div>
                      )}
                    </div>
                    
                    <Link
                      to={`/accommodations/${accommodation._id}`}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Detaylar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accommodations; 