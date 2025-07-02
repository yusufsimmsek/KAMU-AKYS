import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../services/api';
import { Search, Utensils, MapPin, Star, Clock } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { generateStars, categoryTranslations } from '../utils';

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCuisine, setSelectedCuisine] = useState(searchParams.get('cuisine') || '');
  
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  const queryParams = {
    page,
    limit,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedCuisine && { cuisine: selectedCuisine }),
  };

  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', queryParams],
    queryFn: () => restaurantsAPI.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  });

  const restaurants = data?.data || [];

  const cuisineTypes = [
    'turkish', 'mediterranean', 'italian', 'asian', 'seafood', 'fast-food', 'vegetarian'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Restoranlar</h1>
            <p className="text-lg text-gray-600">Lezzetli yemek deneyimleri keşfedin</p>
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
              placeholder="Restoran ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tüm Mutfaklar</option>
            {cuisineTypes.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {categoryTranslations.restaurants[cuisine] || cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Restoranlar yükleniyor..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <img
                    src={restaurant.images?.[0] || '/images/placeholder-restaurant.jpg'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {restaurant.name}
                  </h3>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    {generateStars(restaurant.averageRating || 0).map((star, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          star === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      ({restaurant.reviewCount || 0})
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {restaurant.location.city}
                  </div>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {restaurant.openingHours?.monday?.open} - {restaurant.openingHours?.monday?.close}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {restaurant.cuisineType?.join(', ')}
                    </div>
                    
                    <Link
                      to={`/restaurants/${restaurant._id}`}
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

export default Restaurants; 