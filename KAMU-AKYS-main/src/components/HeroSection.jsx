import React from "react";
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Phone } from 'lucide-react';

const destinations = [
  {
    id: 1,
    title: "Kapadokya",
    location: "Nevşehir, Türkiye",
    image: "https://images.unsplash.com/photo-1624714217530-0e72ea4c6b0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Tarih & Kültür"
  },
  {
    id: 2,
    title: "Pamukkale",
    location: "Denizli, Türkiye", 
    image: "https://images.unsplash.com/photo-1583055942906-c9bc0d2d4b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Doğa"
  },
  {
    id: 3,
    title: "Antalya",
    location: "Antalya, Türkiye",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d0dd4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    category: "Deniz & Plaj"
  },
  {
    id: 4,
    title: "İstanbul",
    location: "İstanbul, Türkiye",
    image: "/images/galata-tower.jpg",
    category: "Metropol",
    hasButton: true,
  },
];

const HeroSection = () => {
  return (
    <section 
      className="w-full min-h-screen bg-cover bg-center text-white relative" 
      style={{ 
        backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('/images/galata-tower.jpg')"
      }}
    >
      {/* Content */}
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-white/20 backdrop-blur-sm">
          <div className="text-xl md:text-2xl font-bold">
            <span className="text-white">Türkiye</span>
            <span className="text-cyan-400">Travel</span>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 w-1/3 max-w-md border border-white/30">
            <Search className="w-4 h-4 text-white/70 mr-2" />
            <input
              type="text"
                              placeholder="Gezilecek yer veya etkinlik ara..."
              className="bg-transparent text-white placeholder-white/70 outline-none w-full"
            />
          </div>
          
          <div className="flex items-center text-sm bg-white/10 backdrop-blur-md rounded-full px-3 py-2 border border-white/30">
            <Phone className="w-4 h-4 mr-2 text-cyan-400" />
            <span>+90 312 XXX XX XX</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center space-x-4 md:space-x-8 py-4 border-b border-white/10 text-sm bg-black/20 backdrop-blur-sm">
          <Link to="/about" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-full hover:bg-white/10">Hakkımızda</Link>
                          <Link to="/destinations" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-full hover:bg-white/10">Gezilecek Yerler</Link>
          <Link to="/events" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-full hover:bg-white/10">Etkinlikler</Link>
          <Link to="/accommodations" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-full hover:bg-white/10">Konaklama</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition-colors px-3 py-2 rounded-full hover:bg-white/10">İletişim</Link>
        </nav>

        {/* Main Content */}
        <div className="text-center mt-20 mb-12 px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Türkiye'yi{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Keşfedin
            </span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
                            Kültür ve doğal güzelliklerle dolu ülkemizin büyüleyici gezilecek yerlerini keşfedin. 
            <br />
            <span className="text-cyan-300">Galata Kulesi'nden İstanbul'a uzanan bu yolculukta bize katılın.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/destinations"
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-cyan-500/25 hover:scale-105"
            >
              <MapPin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                              Gezilecek Yerleri Keşfet
            </Link>
            
            <Link
              to="/events"
              className="group bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center border border-white/30 hover:border-cyan-400/50 shadow-2xl hover:shadow-white/25 hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Etkinlikler
            </Link>
          </div>
          
          <div className="text-sm text-cyan-300 font-medium mb-12 animate-pulse">
                            ✨ Öne Çıkan Gezilecek Yerler ✨
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="flex justify-center gap-4 md:gap-6 px-4 flex-wrap max-w-7xl mx-auto">
          {destinations.map((item, index) => (
            <div
              key={item.id}
              className={`relative w-64 h-80 bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:scale-105 group animate-fade-in-up`}
              style={{ 
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${item.image})`,
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* ID Badge */}
              <div className="absolute top-4 left-4 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg border-2 border-white/30">
                {item.id}
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                {item.category}
              </div>
              
              {/* Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-bold text-xl mb-1 text-shadow">{item.title}</div>
                <div className="text-sm text-white/90 mb-3 font-medium">{item.location}</div>
                
                {item.hasButton && (
                  <Link
                    to={`/destinations/${item.id}`}
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Detayları Gör
                  </Link>
                )}
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16 pb-20">
          <p className="text-white/80 text-lg mb-4">
            🏛️ Galata Kulesi'nden başlayarak tüm Türkiye'yi keşfedin
          </p>
          <div className="flex justify-center space-x-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 