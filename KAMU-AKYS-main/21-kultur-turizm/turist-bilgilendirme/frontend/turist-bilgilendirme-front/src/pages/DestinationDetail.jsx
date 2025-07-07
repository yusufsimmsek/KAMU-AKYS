import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsAPI, reviewsAPI, weatherAPI } from '../services/api';
import { MapPin, Star, Clock, Camera, Heart, Share2, Calendar, Users } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatDate, generateStars, truncateText } from '../utils';
import ImageGallery from '../components/common/ImageGallery';

const DestinationDetail = () => {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  // Fetch destination details
  const { data: destination, isLoading, error } = useQuery({
    queryKey: ['destination', id],
    queryFn: () => destinationsAPI.getById(id),
    enabled: !!id
  });

  // Fetch reviews
  const { data: reviews } = useQuery({
    queryKey: ['destination-reviews', id],
    queryFn: () => reviewsAPI.getByEntity('destination', id),
    enabled: !!id
  });

  // Fetch nearby destinations
  const { data: nearbyDestinations } = useQuery({
    queryKey: ['nearby-destinations', id],
    queryFn: () => destinationsAPI.getNearby(id, { limit: 4 }),
    enabled: !!id
  });

  // Fetch weather if coordinates available
  const { data: weather } = useQuery({
    queryKey: ['destination-weather', id],
    queryFn: () => weatherAPI.getByCoordinates(
      destination?.location?.coordinates?.[1],
      destination?.location?.coordinates?.[0]
    ),
    enabled: !!destination?.location?.coordinates,
    staleTime: 30 * 60 * 1000
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Gezilecek yer yükleniyor..." />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Gezilecek yer bulunamadı
          </h1>
          <Link to="/destinations" className="text-primary-600 hover:text-primary-700">
            Gezilecek yerlere geri dön
          </Link>
        </div>
      </div>
    );
  }

  const images = destination.images || [];
  const reviewList = reviews?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative">
        <ImageGallery
          query={`${destination.name.tr} ${destination.location.city}`}
          category="tourism"
          count={8}
          showThumbnails={true}
          showAttribution={false}
          className="h-96 md:h-[500px]"
        />

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/90 hover:bg-white p-3 rounded-full text-gray-700 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-white/90 hover:bg-white p-3 rounded-full text-gray-700 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                  {destination.category}
                </span>
                <div className="flex items-center space-x-1">
                  {generateStars(destination.averageRating || 0).map((star, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        star === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({destination.reviewCount || 0} yorum)
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {destination.name.tr}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{destination.location.address}, {destination.location.city}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Hakkında
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>{destination.description.tr}</p>
              </div>
            </div>

            {/* Features */}
            {destination.features && destination.features.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Özellikler
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {destination.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Yorumlar ({reviewList.length})
              </h2>
              
              {reviewList.length > 0 ? (
                <div className="space-y-6">
                  {reviewList.slice(0, 3).map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium text-gray-900">
                              {review.user?.firstName} {review.user?.lastName}
                            </span>
                            <div className="flex items-center space-x-1">
                              {generateStars(review.rating).map((star, index) => (
                                <Star
                                  key={index}
                                  className={`w-4 h-4 ${
                                    star === 'full' ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {reviewList.length > 3 && (
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Tüm yorumları gör ({reviewList.length})
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">Henüz yorum yapılmamış.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather */}
            {weather && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Hava Durumu
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {Math.round(weather.main?.temp)}°C
                  </div>
                  <p className="text-gray-600 capitalize">
                    {weather.weather?.[0]?.description}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bilgiler
              </h3>
              <div className="space-y-3">
                {destination.visitingHours && (
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Ziyaret Saatleri</div>
                      <div className="text-sm text-gray-600">
                        {destination.visitingHours.open} - {destination.visitingHours.close}
                      </div>
                    </div>
                  </div>
                )}
                
                {destination.entryFee && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">₺</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Giriş Ücreti</div>
                      <div className="text-sm text-gray-600">{destination.entryFee} TL</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nearby Destinations */}
            {nearbyDestinations?.data && nearbyDestinations.data.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Yakındaki Yerler
                </h3>
                <div className="space-y-3">
                  {nearbyDestinations.data.map((nearby) => (
                    <Link
                      key={nearby._id}
                      to={`/destinations/${nearby._id}`}
                      className="block hover:bg-gray-50 rounded-lg p-3 transition-colors"
                    >
                      <div className="flex space-x-3">
                        <img
                          src={nearby.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400'}
                          alt={nearby.name.tr}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {nearby.name.tr}
                          </div>
                          <div className="text-sm text-gray-600">
                            {nearby.distance ? `${nearby.distance.toFixed(1)} km` : nearby.location.city}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationDetail; 