import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Camera, Star } from 'lucide-react';
import galataImage from '../assets/galata-tower.jpg';

const GalataTowerSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <img
        src={galataImage}
        alt="Galata Tower"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-white text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Galata Kulesi
        </h1>
        <p className="mt-4 text-xl md:text-2xl mb-8 text-white/90">
          İstanbul'un eşsiz manzarasına bir bakış
        </p>
        
        {/* Quick Info */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <MapPin className="w-5 h-5 mr-2 text-cyan-300" />
            <span className="text-sm">Beyoğlu, İstanbul</span>
          </div>
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <Clock className="w-5 h-5 mr-2 text-cyan-300" />
            <span className="text-sm">09:00 - 22:00</span>
          </div>
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            <span className="text-sm">4.8/5 (12,547 yorum)</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to="/destinations/istanbul"
            className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <MapPin className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Detayları Gör
          </Link>
          
          <button className="group bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 backdrop-blur-md text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center justify-center border border-white/20 hover:border-cyan-300/50 shadow-xl hover:shadow-2xl hover:scale-105">
            <Camera className="w-5 h-5 mr-2 group-hover:animate-bounce" />
            Fotoğraf Galerisi
          </button>
        </div>
        
        {/* Historical Info */}
        <div className="bg-gradient-to-r from-black/40 to-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-cyan-300">Tarihçe</h3>
          <p className="text-white/90 leading-relaxed">
            Galata Kulesi, 1348 yılında Cenevizliler tarafından inşa edilmiş olan ve İstanbul'un en önemli 
            simgelerinden biridir. 67 metre yüksekliğindeki bu tarihi yapı, şehrin panoramik manzarasını 
            sunan eşsiz bir gözlem noktasıdır.
          </p>
        </div>
      </div>
      
      {/* Floating Stats */}
      <div className="absolute bottom-8 left-8 right-8 z-10">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-cyan-300">67m</div>
            <div className="text-sm text-white/80">Yükseklik</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-md rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-300">1348</div>
            <div className="text-sm text-white/80">İnşa Yılı</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-teal-500/20 backdrop-blur-md rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-300">360°</div>
            <div className="text-sm text-white/80">Manzara</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GalataTowerSection; 