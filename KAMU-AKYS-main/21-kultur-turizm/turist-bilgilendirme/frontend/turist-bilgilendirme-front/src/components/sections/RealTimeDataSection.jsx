import React, { useState } from 'react';
import { MapPin, Calendar, Navigation, Shield, Globe } from 'lucide-react';
import DataCard from '../cards/DataCard';

const RealTimeDataSection = ({ 
  city = 'Ankara', 
  showTitle = true, 
  onLocationClick = null,
  maxItemsPerCategory = 6 
}) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Statik örnek veriler
  const staticData = {
    cultural: [
      {
        id: 1,
        name: "Anıtkabir",
        location: "Anıttepe, Ankara",
        description: "Mustafa Kemal Atatürk'ün anıt mezarı",
        category: "Müze",
        categoryType: "cultural",
        coordinates: [39.9254, 32.8369]
      },
      {
        id: 2,
        name: "Anadolu Medeniyetleri Müzesi",
        location: "Ulus, Ankara",
        description: "Anadolu'nun tarihi eserlerini sergileyen müze",
        category: "Müze",
        categoryType: "cultural",
        coordinates: [39.9415, 32.8597]
      }
    ],
    events: [
      {
        id: 3,
        name: "Ankara Film Festivali",
        location: "Kızılay, Ankara",
        description: "Yıllık film festivali etkinliği",
        category: "Kültür",
        categoryType: "events",
        date: "2024-03-15",
        coordinates: [39.9208, 32.8541]
      }
    ],
    transportation: [
      {
        id: 4,
        name: "Kızılay Metro İstasyonu",
        location: "Kızılay, Ankara",
        description: "Ana metro bağlantı noktası",
        category: "Ulaşım",
        categoryType: "transportation",
        coordinates: [39.9208, 32.8541]
      }
    ],
    emergency: [
      {
        id: 5,
        name: "Hacettepe Hastanesi",
        location: "Sıhhiye, Ankara",
        description: "Acil servis hizmetleri",
        category: "Sağlık",
        categoryType: "emergency",
        phone: "0312 305 10 00",
        coordinates: [39.9334, 32.8597]
      }
    ]
  };

  // Kategori tanımları
  const categories = [
    { id: 'all', name: 'Tümü', icon: Globe, color: 'bg-blue-500' },
    { id: 'cultural', name: 'Kültür', icon: MapPin, color: 'bg-purple-500' },
    { id: 'events', name: 'Etkinlikler', icon: Calendar, color: 'bg-green-500' },
    { id: 'transportation', name: 'Ulaşım', icon: Navigation, color: 'bg-blue-500' },
    { id: 'emergency', name: 'Acil Durum', icon: Shield, color: 'bg-red-500' }
  ];

  // Filtrelenmiş veri
  const getFilteredData = () => {
    let allItems = [];
    
    Object.values(staticData).forEach(categoryItems => {
      allItems.push(...categoryItems);
    });
    
    if (activeCategory === 'all') {
      return allItems.slice(0, maxItemsPerCategory * 2);
    }
    
    return allItems
      .filter(item => item.categoryType === activeCategory)
      .slice(0, maxItemsPerCategory);
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      {showTitle && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🌍 Öneriler
            </h2>
            <p className="text-gray-600 mt-1">
              {city} şehrindeki popüler yerler ve etkinlikler
            </p>
          </div>
        </div>
      )}

      {/* Kategori Filtreleri */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? `${category.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Veri Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredData().map((item, index) => (
          <DataCard
            key={`${item.id}-${index}`}
            data={item}
            category={item.category}
            onLocationClick={onLocationClick}
            className="hover:scale-105 transition-transform duration-200"
          />
        ))}
      </div>

      {/* Veri yoksa mesaj */}
      {getFilteredData().length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Globe className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">
            Bu kategoride görüntülenecek veri bulunamadı.
          </p>
        </div>
      )}
    </div>
  );
};

export default RealTimeDataSection; 