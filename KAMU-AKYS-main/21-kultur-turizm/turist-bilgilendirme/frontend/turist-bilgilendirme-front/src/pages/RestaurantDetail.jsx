import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { restaurantsAPI } from '../services/api';
import { MapPin, Star, Clock, Phone, Globe, Utensils } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { generateStars } from '../utils';

const RestaurantDetail = () => {
  const { id } = useParams();

  const { data: restaurant, isLoading, error } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restaurantsAPI.getById(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Restoran yükleniyor..." />
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Restoran bulunamadı
          </h1>
          <Link to="/restaurants" className="text-primary-600 hover:text-primary-700">
            Restoranlara geri dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[400px] overflow-hidden">
        <img
          src={restaurant.images?.[0] || '/images/placeholder-restaurant.jpg'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center space-x-1">
                {generateStars(restaurant.averageRating || 0).map((star, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      star === 'full' ? 'text-yellow-400 fill-current' : 'text-white/50'
                    }`}
                  />
                ))}
                <span className="text-white/90 text-sm ml-1">
                  ({restaurant.reviewCount || 0} yorum)
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {restaurant.name}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{restaurant.location.address}, {restaurant.location.city}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hakkında
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>{restaurant.description}</p>
              </div>
            </div>

            {/* Cuisine & Specialties */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Mutfak & Özel Lezzetler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {restaurant.cuisineType && restaurant.cuisineType.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Mutfak Türü</h3>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.cuisineType.map((cuisine, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {restaurant.specialties && restaurant.specialties.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Özel Lezzetler</h3>
                    <div className="space-y-1">
                      {restaurant.specialties.map((specialty, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Utensils className="w-4 h-4 text-primary-600" />
                          <span className="text-gray-700">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Menu */}
            {restaurant.menu && restaurant.menu.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Menü
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {restaurant.menu.map((category, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                        {category.category}
                      </h3>
                      <div className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              {item.description && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            <div className="ml-4 font-semibold text-primary-600">
                              {item.price} ₺
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Hours */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                İletişim & Saatler
              </h3>
              <div className="space-y-4">
                {restaurant.contact?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Telefon</div>
                      <div className="text-sm text-gray-600">{restaurant.contact.phone}</div>
                    </div>
                  </div>
                )}

                {restaurant.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Website</div>
                      <a 
                        href={restaurant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        {restaurant.website}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 mb-2">Çalışma Saatleri</div>
                    {restaurant.openingHours ? (
                      <div className="space-y-1 text-sm text-gray-600">
                        {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}:</span>
                            <span>
                              {hours.open} - {hours.close}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        Çalışma saatleri belirtilmemiş
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Range */}
            {restaurant.priceRange && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Fiyat Aralığı
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary-600">
                    {'₺'.repeat(restaurant.priceRange)}
                  </span>
                  <span className="text-gray-400">
                    {'₺'.repeat(4 - restaurant.priceRange)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {restaurant.priceRange === 1 && 'Ekonomik'}
                  {restaurant.priceRange === 2 && 'Orta'}
                  {restaurant.priceRange === 3 && 'Pahalı'}
                  {restaurant.priceRange === 4 && 'Çok Pahalı'}
                </div>
              </div>
            )}

            {/* Dietary Options */}
            {restaurant.dietaryOptions && restaurant.dietaryOptions.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Diyet Seçenekleri
                </h3>
                <div className="space-y-2">
                  {restaurant.dietaryOptions.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-gray-700 capitalize">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reservation */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-primary-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rezervasyon
              </h3>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                Masa Rezervasyonu Yap
              </button>
              <div className="text-center text-sm text-gray-600 mt-3">
                Rezervasyon ücretsizdir
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail; 