import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { destinationsAPI, eventsAPI } from '../services/api';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Bed, 
  Utensils, 
  ArrowRight, 
  Rocket,
  Play,
  Brain,
  CloudSun,
  Map,
  Search,
  Heart,
  Route,
  Ticket,
  Hotel,
  Quote,
  CheckCircle,
  TrendingUp,
  Award,
  Globe,
  Clock,
  Phone,
  Compass,
  Sparkles,
  Eye
} from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Hero from '../components/Hero';
import TurkeyPlacesMap from '../components/TurkeyPlacesMap';
import TurkeyPlacesGrid from '../components/TurkeyPlacesGrid';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Popüler destinasyonlar
  const popularDestinations = [
    {
      id: 1,
      name: "İstanbul",
      description: "Tarihi Sultanahmet, modern Beyoğlu ve Boğaz manzarası",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop",
      rating: 4.8,
      visitorsCount: "15M+",
      tags: ["tarihi", "kültür", "modern"]
    },
    {
      id: 2,
      name: "Kapadokya",
      description: "Sıcak hava balonları ve peribacaları ile eşsiz manzara",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.9,
      visitorsCount: "2M+",
      tags: ["doğa", "balon", "romantik"]
    },
    {
      id: 3,
      name: "Antalya",
      description: "Akdeniz'in turkuaz suları ve tarihi Kaleiçi",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=400&h=300&fit=crop",
      rating: 4.7,
      visitorsCount: "8M+",
      tags: ["deniz", "tarihi", "tatil"]
    }
  ];

  // Son etkinlikler
  const recentEvents = [
    {
      id: 1,
      title: "İstanbul Müzik Festivali",
      date: "15 Haziran 2024",
      location: "İstanbul",
      price: "150-300₺",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      category: "Müzik"
    },
    {
      id: 2,
      title: "Kapadokya Balon Festivali",
      date: "20 Temmuz 2024",
      location: "Nevşehir",
      price: "500-800₺",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      category: "Turizm"
    },
    {
      id: 3,
      title: "Antalya Film Festivali",
      date: "5 Ekim 2024",
      location: "Antalya",
      price: "75-200₺",
      image: "https://images.unsplash.com/photo-1489599735086-9c6c6b8c6e5c?w=300&h=200&fit=crop",
      category: "Sinema"
    }
  ];

  // Öne çıkan restoranlar
  const featuredRestaurants = [
    {
      id: 1,
      name: "Pandeli",
      cuisine: "Türk Mutfağı",
      location: "İstanbul",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
      established: "1901"
    },
    {
      id: 2,
      name: "Çiya Sofrası",
      cuisine: "Anadolu Mutfağı",
      location: "İstanbul",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop",
      established: "1987"
    },
    {
      id: 3,
      name: "Deniz Restaurant",
      cuisine: "Deniz Ürünleri",
      location: "İzmir",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop",
      established: "1982"
    }
  ];

  // Öne çıkan konaklama yerleri
  const featuredAccommodations = [
    {
      id: 1,
      name: "Çırağan Palace Kempinski",
      type: "Lüks Otel",
      location: "İstanbul",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop",
      rooms: 313
    },
    {
      id: 2,
      name: "Kapadokya Cave Suites",
      type: "Mağara Otel",
      location: "Nevşehir",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
      rooms: 30
    },
    {
      id: 3,
      name: "Mardan Palace",
      type: "Resort",
      location: "Antalya",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300&h=200&fit=crop",
      rooms: 560
    }
  ];

  // İstatistikler
  const stats = [
    { number: "500+", label: "Gezilecek Yer", icon: MapPin, color: "from-blue-500 to-purple-500" },
    { number: "1000+", label: "Konaklama", icon: Bed, color: "from-purple-500 to-pink-500" },
    { number: "800+", label: "Restoran", icon: Utensils, color: "from-orange-500 to-red-500" },
    { number: "50+", label: "Etkinlik", icon: Calendar, color: "from-green-500 to-blue-500" }
  ];

  // Hızlı aksiyonlar
  const quickActions = [
    {
      title: "Akıllı Rota Planlama",
      description: "AI destekli gezi rotası oluşturun",
      icon: Route,
      color: "from-blue-500 to-purple-500",
      link: "/destinations"
    },
    {
      title: "Canlı Hava Durumu",
      description: "Gerçek zamanlı hava durumu bilgisi",
      icon: CloudSun,
      color: "from-orange-500 to-yellow-500",
      link: "/destinations"
    },
    {
      title: "Anlık Etkinlikler",
      description: "Bugün yakınınızda neler oluyor?",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      link: "/events"
    },
    {
      title: "Favori Listem",
      description: "Beğendiğiniz yerleri kaydedin",
      icon: Heart,
      color: "from-green-500 to-teal-500",
      link: "/profile"
    }
  ];

  // Yorumlar
  const testimonials = [
    {
      id: 1,
      name: "Elif Yılmaz",
      location: "İstanbul",
      comment: "Kapadokya gezim için harika öneriler aldım. Platform gerçekten çok faydalı!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=60&h=60&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Mehmet Demir",
      location: "Ankara",
      comment: "Restoranlar bölümü sayesinde İzmir'de harika bir restoran keşfettim.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Ayşe Kaya",
      location: "İzmir",
      comment: "Etkinlik takvibi sayesinde hiçbir güzel etkinliği kaçırmıyorum.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Turist Rehberi | Türkiye'nin Modern Gezi Platformu</title>
        <meta name="description" content="Türkiye'nin en kapsamlı turizm ve gezi platformu. Popüler destinasyonlar, etkinlikler, restoranlar ve daha fazlası!" />
        <meta property="og:title" content="Turist Rehberi | Türkiye'nin Modern Gezi Platformu" />
        <meta property="og:description" content="Türkiye'nin en kapsamlı turizm ve gezi platformu. Popüler destinasyonlar, etkinlikler, restoranlar ve daha fazlası!" />
        <meta property="og:image" content="/icons/icon-512.png" />
        <meta property="og:url" content="https://turistrehberi.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Turist Rehberi | Türkiye'nin Modern Gezi Platformu" />
        <meta name="twitter:description" content="Türkiye'nin en kapsamlı turizm ve gezi platformu. Popüler destinasyonlar, etkinlikler, restoranlar ve daha fazlası!" />
        <meta name="twitter:image" content="/icons/icon-512.png" />
      </Helmet>
    <div className="min-h-screen">
      {/* Hero Section */}
        <Hero />

        {/* Quick Actions Section */}
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Hızlı Erişim</h2>
              <p className="text-gray-300">En çok kullanılan özellikler</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
            <Link
                    key={index}
                    to={action.link}
                    className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
            </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Platform İstatistikleri</h2>
              <p className="text-gray-300">Türkiye turizmi için kapsamlı veri tabanı</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-gray-300">{stat.label}</div>
            </div>
                );
              })}
          </div>
        </div>
      </section>

        {/* Popular Destinations Section */}
        <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Popüler Destinasyonlar</h2>
                <p className="text-gray-300">En çok ziyaret edilen yerler</p>
              </div>
              <Link
                to="/destinations"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
              >
                Tümünü Gör <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularDestinations.map((destination) => (
                <div key={destination.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                  <div className="relative h-48">
                    <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {destination.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{destination.name}</h3>
                    <p className="text-gray-400 mb-4">{destination.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-300">
                        <Users className="w-4 h-4 mr-1" />
                        <span className="text-sm">{destination.visitorsCount} ziyaret</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {destination.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Events Section */}
        <section className="py-16 px-6 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                <div>
                <h2 className="text-3xl font-bold text-white mb-2">Yaklaşan Etkinlikler</h2>
                <p className="text-gray-300">Kaçırmamanız gereken etkinlikler</p>
              </div>
              <Link 
                to="/events"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
              >
                Tüm Etkinlikler <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              </div>
              
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <div key={event.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                  <div className="relative h-40">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {event.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 font-bold">{event.price}</span>
                      <Link 
                        to={`/events/${event.id}`}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                      >
                        Detaylar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Restaurants Section */}
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
                    <div>
                <h2 className="text-3xl font-bold text-white mb-2">Öne Çıkan Restoranlar</h2>
                <p className="text-gray-300">En sevilen lezzet durağı</p>
              </div>
              <Link 
                to="/restaurants"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
              >
                Tüm Restoranlar <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRestaurants.map((restaurant) => (
                <div key={restaurant.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                  <div className="relative h-40">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {restaurant.rating}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{restaurant.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300">
                        <Utensils className="w-4 h-4 mr-2" />
                        <span className="text-sm">{restaurant.cuisine}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{restaurant.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{restaurant.established} yılından beri</span>
                      <Link 
                        to={`/restaurants/${restaurant.id}`}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                      >
                        Detaylar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Accommodations Section */}
        <section className="py-16 px-6 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Öne Çıkan Konaklama</h2>
                <p className="text-gray-300">Konforlu ve lüks konaklama seçenekleri</p>
              </div>
              <Link 
                to="/accommodations"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center"
              >
                Tüm Oteller <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredAccommodations.map((accommodation) => (
                <div key={accommodation.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                  <div className="relative h-40">
                    <img src={accommodation.image} alt={accommodation.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {accommodation.rating}
                    </div>
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {accommodation.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{accommodation.name}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{accommodation.location}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Bed className="w-4 h-4 mr-2" />
                        <span className="text-sm">{accommodation.rooms} oda</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 font-semibold">{accommodation.type}</span>
                      <Link 
                        to={`/accommodations/${accommodation.id}`}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                      >
                        Detaylar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OpenTripMap - Turkey Places Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-gray-900 via-blue-900/20 to-green-900/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Enhanced Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center items-center mb-6">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-2xl mr-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-5xl font-bold">
                  <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Türkiye'den Gezilecek Yerler
                  </span>
                </h2>
              </div>

              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
                OpenTripMap API ile desteklenen interaktif harita üzerinde Türkiye'nin en güzel destinasyonlarını keşfedin. 
                <span className="text-green-400 font-semibold"> Gerçek zamanlı veriler</span> ile 
                <span className="text-blue-400 font-semibold"> otantik deneyimler</span> yaşayın.
              </p>
              
              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 flex items-center">
                  <Compass className="w-5 h-5 text-green-400 mr-2" />
                  <span className="text-white font-medium">Interaktif Harita</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 flex items-center">
                  <Heart className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-white font-medium">Favorilere Ekle</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-white font-medium">Gerçek Değerlendirmeler</span>
                </div>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 flex items-center">
                  <Eye className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-white font-medium">Canlı Veriler</span>
                </div>
              </div>
            </div>

            {/* Enhanced Content Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left Side - Map Section */}
              <div className="xl:col-span-7">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl mr-3">
                        <Map className="w-6 h-6 text-white" />
                </div>
                <div>
                        <h3 className="text-xl font-bold text-white">Türkiye Haritası</h3>
                        <p className="text-gray-400 text-sm">Pinlere tıklayarak keşfedin</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-xl px-4 py-2">
                      <div className="flex items-center mr-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-300">Müze</span>
                      </div>
                      <div className="flex items-center mr-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-300">Anıt</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-300">Doğa</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-2xl overflow-hidden">
                    <TurkeyPlacesMap 
                      selectedPlace={selectedPlace}
                      onPlaceSelect={setSelectedPlace}
                    />
                  </div>
                </div>
              </div>
              
              {/* Right Side - Places Grid */}
              <div className="xl:col-span-5">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-2xl h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl mr-3">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Popüler Yerler</h3>
                        <p className="text-gray-400 text-sm">En çok beğenilen destinasyonlar</p>
                      </div>
                    </div>
                    
                    <Link 
                      to="/destinations"
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center shadow-lg hover:shadow-xl"
                    >
                      Tümünü Gör
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                  
                  <div className="rounded-2xl overflow-hidden">
                    <TurkeyPlacesGrid 
                      selectedPlace={selectedPlace}
                      onPlaceSelect={setSelectedPlace}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Stats Section */}
            <div className="mt-16 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">500+</div>
                  <div className="text-gray-400 text-sm">Destinasyon</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">4.8</div>
                  <div className="text-gray-400 text-sm">Ortalama Puan</div>
              </div>
              
                <div className="text-center">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">2M+</div>
                  <div className="text-gray-400 text-sm">Aylık Ziyaret</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">50K+</div>
                  <div className="text-gray-400 text-sm">Favori Ekleme</div>
                </div>
              </div>
          </div>
        </div>
      </section>

        {/* Testimonials Section */}
        <section className="py-16 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Kullanıcı Yorumları</h2>
              <p className="text-gray-300">Platformumuzu kullanan ziyaretçilerimizin deneyimleri</p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic">"{testimonial.comment}"</p>
                  <Quote className="w-6 h-6 text-blue-400 mt-3 opacity-50" />
                </div>
              ))}
          </div>
        </div>
      </section>

        {/* Newsletter Section */}
        <section className="py-16 px-6 bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Haberdar Olun</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Yeni gezilecek yerler, etkinlikler ve özel fırsatlardan haberdar olmak için e-bültenimize abone olun.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-300"
              />
              <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                Abone Ol
              </button>
            </div>
            
            <p className="text-gray-400 text-sm mt-4">
              İstediğiniz zaman aboneliğinizi iptal edebilirsiniz. Gizlilik politikamızı okuyun.
            </p>
          </div>
        </section>
    </div>
    </>
  );
};

export default Home; 