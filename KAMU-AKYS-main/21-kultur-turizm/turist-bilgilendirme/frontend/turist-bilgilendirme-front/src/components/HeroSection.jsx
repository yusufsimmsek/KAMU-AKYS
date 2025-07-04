import React from "react";
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Search, Phone } from 'lucide-react';

const destinations = [
  {
    id: 1,
    title: "Kapadokya",
    location: "Nevşehir, Türkiye",
    image: "/images/1.jpg",
    category: "Tarih & Kültür"
  },
  {
    id: 2,
    title: "Pamukkale",
    location: "Denizli, Türkiye", 
    image: "/images/2.jpg",
    category: "Doğa"
  },
  {
    id: 3,
    title: "Antalya",
    location: "Antalya, Türkiye",
    image: "/images/3.jpg",
    category: "Deniz & Plaj"
  },
  {
    id: 4,
    title: "İstanbul",
    location: "İstanbul, Türkiye",
    image: "/images/4.jpg",
    category: "Metropol",
    hasButton: true,
  },
];

const HeroSection = () => {
  return (
    <section 
      className="w-full min-h-screen bg-cover bg-center text-white relative" 
      style={{ backgroundImage: "url('/images/bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4 border-b border-white/20">
          <div className="text-xl md:text-2xl font-bold">
            <span className="text-white">Türkiye</span>
            <span className="text-cyan-400">Travel</span>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 w-1/3 max-w-md">
            <Search className="w-4 h-4 text-white/70 mr-2" />
            <input
              type="text"
              placeholder="Destinasyon veya etkinlik ara..."
              className="bg-transparent text-white placeholder-white/70 outline-none w-full"
            />
          </div>
          
          <div className="flex items-center text-sm">
            <Phone className="w-4 h-4 mr-2" />
            <span>+90 312 XXX XX XX</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center space-x-4 md:space-x-10 py-4 border-b border-white/10 text-sm">
          <Link to="/about" className="hover:text-cyan-400 transition-colors">Hakkımızda</Link>
          <Link to="/destinations" className="hover:text-cyan-400 transition-colors">Destinasyonlar</Link>
          <Link to="/events" className="hover:text-cyan-400 transition-colors">Etkinlikler</Link>
          <Link to="/accommodations" className="hover:text-cyan-400 transition-colors">Konaklama</Link>
          <Link to="/contact" className="hover:text-cyan-400 transition-colors">İletişim</Link>
        </nav>

        {/* Main Content */}
        <div className="text-center mt-16 mb-8 px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Türkiye'yi <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Keşfedin</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Kültür ve doğal güzelliklerle dolu ülkemizin büyüleyici destinasyonlarını keşfedin
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              to="/destinations"
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <MapPin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Destinasyonları Keşfet
            </Link>
            
            <Link
              to="/events"
              className="group bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center border border-white/30 hover:border-white/50 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Calendar className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Etkinlikler
            </Link>
          </div>
          
          <div className="text-sm text-white/70 mb-8">Öne Çıkan Destinasyonlar</div>
        </div>

        {/* Destinations Grid */}
        <div className="flex justify-center gap-4 md:gap-6 mt-8 px-4 flex-wrap max-w-6xl mx-auto">
          {destinations.map((item) => (
            <div
              key={item.id}
              className="relative w-64 h-80 bg-cover bg-center rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
              
              {/* ID Badge */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                {item.id}
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                {item.category}
              </div>
              
              {/* Content */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="font-bold text-lg mb-1">{item.title}</div>
                <div className="text-sm text-white/80 mb-2">{item.location}</div>
                
                {item.hasButton && (
                  <Link
                    to={`/destinations/${item.id}`}
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Detayları Gör
                  </Link>
                )}
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom Spacing */}
        <div className="pb-16"></div>
      </div>
    </section>
  );
};

export default HeroSection; 