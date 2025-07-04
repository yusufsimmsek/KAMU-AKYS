import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsAPI, eventsAPI } from '../services/api';
import { MapPin, Calendar, Star, Users, Bed, Utensils, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import HeroSection from '../components/HeroSection';
import { formatDate, formatCurrency, generateStars, truncateText } from '../utils';

const Home = () => {
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

  const stats = [
    { label: 'Destinasyon', value: '500+', icon: MapPin },
    { label: 'Etkinlik', value: '200+', icon: Calendar },
    { label: 'Konaklama', value: '1000+', icon: Bed },
    { label: 'Restoran', value: '800+', icon: Utensils },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="bg-gradient-to-br from-primary-100 to-accent-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-10 h-10 text-primary-600 group-hover:text-primary-700 transition-colors duration-300" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">{stat.value}</div>
                  <div className="text-dark-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              Öne Çıkan Destinasyonlar
            </h2>
            <p className="text-xl text-dark-500 max-w-2xl mx-auto">
              En popüler ve büyüleyici destinasyonlarımızı keşfedin
            </p>
          </div>

          {destinationsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner text="Destinasyonlar yükleniyor..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations?.data?.slice(0, 6).map((destination, index) => (
                <div
                  key={destination._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-slide-up border border-white/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={destination.images?.[0] || '/images/placeholder-destination.jpg'}
                      alt={destination.name.tr}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {destination.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {destination.name.tr}
                    </h3>
                    <p className="text-dark-500 mb-4 leading-relaxed">
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
                        <span className="text-sm text-dark-500 ml-2 font-medium">
                          ({destination.reviewCount || 0})
                        </span>
                      </div>
                      <Link
                        to={`/destinations/${destination._id}`}
                        className="group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 text-primary-600 group-hover:text-white px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 border border-primary-200 group-hover:border-transparent"
                      >
                        Detaylar →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 animate-fade-in">
            <Link
              to="/destinations"
              className="group bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Tüm Destinasyonları Gör
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gradient-to-br from-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-6">
              Yaklaşan Etkinlikler
            </h2>
            <p className="text-xl text-dark-500 max-w-2xl mx-auto">
              Kaçırmamanız gereken kültürel ve sanatsal etkinlikler
            </p>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner text="Etkinlikler yükleniyor..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents?.data?.slice(0, 4).map((event, index) => (
                <div
                  key={event._id}
                  className="group bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={event.images?.[0] || '/images/placeholder-event.jpg'}
                      alt={event.title.tr}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>
                  <div className="p-5">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent text-sm font-bold mb-2">
                      {formatDate(event.startDate)}
                    </div>
                    <h3 className="font-bold text-dark-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                      {truncateText(event.title.tr, 50)}
                    </h3>
                    <div className="flex items-center text-dark-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                      {event.location.city}
                    </div>
                    <div className="flex items-center justify-between">
                      {event.price?.amount ? (
                        <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent font-bold">
                          {formatCurrency(event.price.amount)}
                        </span>
                      ) : (
                        <span className="bg-gradient-to-r from-success-500 to-success-600 bg-clip-text text-transparent font-bold">Ücretsiz</span>
                      )}
                      <Link
                        to={`/events/${event._id}`}
                        className="group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 text-primary-600 group-hover:text-white px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300 border border-primary-200 group-hover:border-transparent"
                      >
                        Detaylar →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 animate-fade-in">
            <Link
              to="/events"
              className="group bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Tüm Etkinlikleri Gör
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hemen Keşfetmeye Başlayın
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ücretsiz hesap oluşturun ve kişiselleştirilmiş önerilerimizden yararlanın
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <Link
              to="/register"
              className="group bg-white text-primary-600 hover:bg-gray-100 px-10 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-bold">
                Ücretsiz Hesap Oluştur
              </span>
            </Link>
            <Link
              to="/about"
              className="group bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-10 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl hover:scale-105"
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