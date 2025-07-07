import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, Camera, Users, Info } from 'lucide-react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import GalataTowerSection from '../components/GalataTowerSection';

const GalataTower = () => {
  const visitingInfo = [
    {
      icon: <Clock className="w-6 h-6 text-cyan-400" />,
      title: "Ziyaret Saatleri",
      content: "09:00 - 22:00 (Her gün)"
    },
    {
      icon: <MapPin className="w-6 h-6 text-cyan-400" />,
      title: "Adres",
      content: "Bereketzade Mahallesi, Galata Kulesi Sk., Beyoğlu/İstanbul"
    },
    {
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      title: "Giriş Ücreti",
      content: "Yetişkin: 100 TL, Çocuk: 50 TL"
    },
    {
      icon: <Info className="w-6 h-6 text-cyan-400" />,
      title: "Özel Bilgi",
      content: "Rezervasyon önerilir, akşam saatlerinde daha az kalabalık"
    }
  ];

  const nearbyAttractions = [
    {
      name: "Galata Köprüsü",
      distance: "500m",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "Karaköy",
      distance: "300m", 
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    },
    {
      name: "İstiklal Caddesi",
      distance: "1km",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <GalataTowerSection />
      
      {/* Navigation */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            to="/destinations" 
            className="flex items-center text-gray-600 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Gezilecek Yerlere Dön
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Star className="w-8 h-8 text-yellow-400 mr-3" />
                Galata Kulesi Hakkında
              </h2>
              
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-6">
                  Galata Kulesi, İstanbul'un en önemli simgelerinden biri olarak şehrin tarihine tanıklık eden 
                  muhteşem bir yapıdır. 1348 yılında Cenevizliler tarafından inşa edilen bu tarihi kule, 
                  o dönemde Galata surlarının en yüksek noktasını oluşturuyordu.
                </p>
                
                <p className="mb-6">
                  67 metre yüksekliğindeki Galata Kulesi, İstanbul'un en güzel panoramik manzarasını sunan 
                  eşsiz bir gözlem noktasıdır. Kulenin tepesinden Haliç, Boğaz ve Tarihi Yarımada'nın 
                  büyüleyici manzarasını seyredebilirsiniz.
                </p>
                
                <p className="mb-6">
                  Kule, tarih boyunca yangın kulesi, hapishane ve gözlemevi olarak farklı amaçlarla kullanılmıştır. 
                  Günümüzde ise müze olarak hizmet vermekte ve her yıl milyonlarca ziyaretçiyi ağırlamaktadır.
                </p>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Camera className="w-7 h-7 text-purple-500 mr-3" />
                Fotoğraf Galerisi
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/photo-157225200928${index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300`}
                      alt={`Galata Kulesi ${index}`}
                      className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Visiting Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ziyaret Bilgileri</h3>
              <div className="space-y-4">
                {visitingInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{info.title}</h4>
                      <p className="text-sm text-gray-600">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Yakındaki Yerler</h3>
              <div className="space-y-4">
                {nearbyAttractions.map((attraction, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={attraction.image}
                      alt={attraction.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{attraction.name}</h4>
                      <p className="text-sm text-gray-600">{attraction.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Hemen Rezervasyon Yap</h3>
              <p className="text-sm mb-4 text-white/90">
                Kalabalıktan kaçınmak için önceden rezervasyon yapmanızı öneriyoruz.
              </p>
              <button className="w-full bg-white text-cyan-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Rezervasyon Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GalataTower; 