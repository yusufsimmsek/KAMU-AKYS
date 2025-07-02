import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsAPI, eventsAPI, weatherAPI } from '../services/api';
import { MapPin, Calendar, Star, Users, Bed, Utensils, ArrowRight, Cloud, Sun } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatDate, formatCurrency, generateStars, truncateText } from '../utils';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch featured data
  const { data: featuredDestinations, isLoading: destinationsLoading } = useQuery({
    queryKey: ['featured-destinations'],
    queryFn: () => destinationsAPI.getAll({ featured: true, limit: 6 }),
    staleTime: 10 * 60 * 1000
  });

  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery({
    queryKey: ['upcoming-events'],
    queryFn: () => eventsAPI.getUpcoming({ limit: 4 }),
    staleTime: 5 * 60 * 1000
  });

  const { data: weatherData } = useQuery({
    queryKey: ['weather-ankara'],
    queryFn: () => weatherAPI.getByCity('Ankara'),
    staleTime: 30 * 60 * 1000
  });

  // Hero images
  const heroImages = [
    '/images/hero/cappadocia.jpg',
    '/images/hero/istanbul.jpg',
    '/images/hero/antalya.jpg',
    '/images/hero/pamukkale.jpg'
  ];

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Destinasyon', value: '500+', icon: MapPin },
    { label: 'Etkinlik', value: '200+', icon: Calendar },
    { label: 'Konaklama', value: '1000+', icon: Bed },
    { label: 'Restoran', value: '800+', icon: Utensils },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Türkiye'yi <span className="text-primary-400">Keşfedin</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Kültür ve doğal güzelliklerle dolu ülkemizin büyüleyici destinasyonlarını 
            keşfedin, unutulmaz deneyimler yaşayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/destinations"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Destinasyonları Keşfet
            </Link>
            <Link
              to="/events"
              className="bg-white/20 hover:bg-white/30 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center justify-center border border-white/30"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Etkinlikleri Gör
            </Link>
          </div>
        </div>

        {/* Weather Widget */}
        {weatherData && (
          <div className="absolute top-20 right-4 bg-white/20 backdrop-blur rounded-lg p-4 text-white">
            <div className="flex items-center space-x-3">
              <div className="text-center">
                {weatherData.main?.temp && (
                  <div className="text-2xl font-bold">
                    {Math.round(weatherData.main.temp)}°C
                  </div>
                )}
                <div className="text-sm opacity-90">Ankara</div>
              </div>
              {weatherData.weather?.[0]?.main === 'Clear' ? (
                <Sun className="w-8 h-8" />
              ) : (
                <Cloud className="w-8 h-8" />
              )}
            </div>
          </div>
        )}

        {/* Hero Image Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Öne Çıkan Destinasyonlar
            </h2>
            <p className="text-lg text-gray-600">
              En popüler ve büyüleyici destinasyonlarımızı keşfedin
            </p>
          </div>

          {destinationsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner text="Destinasyonlar yükleniyor..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations?.data?.slice(0, 6).map((destination) => (
                <div
                  key={destination._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48">
                    <img
                      src={destination.images?.[0] || '/images/placeholder-destination.jpg'}
                      alt={destination.name.tr}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary-600 text-white px-2 py-1 rounded text-sm font-semibold">
                      {destination.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {destination.name.tr}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {truncateText(destination.description.tr, 100)}
                    </p>
                    <div className="flex items-center justify-between">
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
                      <Link
                        to={`/destinations/${destination._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Detaylar →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/destinations"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Tüm Destinasyonları Gör
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Yaklaşan Etkinlikler
            </h2>
            <p className="text-lg text-gray-600">
              Kaçırmamanız gereken kültürel ve sanatsal etkinlikler
            </p>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner text="Etkinlikler yükleniyor..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents?.data?.slice(0, 4).map((event) => (
                <div
                  key={event._id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-40">
                    <img
                      src={event.images?.[0] || '/images/placeholder-event.jpg'}
                      alt={event.title.tr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-primary-600 text-sm font-semibold mb-1">
                      {formatDate(event.startDate)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {truncateText(event.title.tr, 50)}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location.city}
                    </div>
                    <div className="flex items-center justify-between">
                      {event.price?.amount ? (
                        <span className="text-primary-600 font-semibold">
                          {formatCurrency(event.price.amount)}
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">Ücretsiz</span>
                      )}
                      <Link
                        to={`/events/${event._id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Detaylar →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
            >
              Tüm Etkinlikleri Gör
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hemen Keşfetmeye Başlayın
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Ücretsiz hesap oluşturun ve kişiselleştirilmiş önerilerimizden yararlanın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Ücretsiz Hesap Oluştur
            </Link>
            <Link
              to="/about"
              className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 