import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { accommodationsAPI } from '../services/api';
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, Phone, Mail } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatCurrency, generateStars } from '../utils';

const AccommodationDetail = () => {
  const { id } = useParams();

  const { data: accommodation, isLoading, error } = useQuery({
    queryKey: ['accommodation', id],
    queryFn: () => accommodationsAPI.getById(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Konaklama yükleniyor..." />
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Konaklama bulunamadı
          </h1>
          <Link to="/accommodations" className="text-primary-600 hover:text-primary-700">
            Konaklamalara geri dön
          </Link>
        </div>
      </div>
    );
  }

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    breakfast: Coffee,
    gym: Dumbbell,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[400px] overflow-hidden">
        <img
                        src={accommodation.images?.[0] || 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400'}
          alt={accommodation.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {accommodation.type}
              </span>
              <div className="flex items-center space-x-1">
                {generateStars(accommodation.averageRating || 0).map((star, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      star === 'full' ? 'text-yellow-400 fill-current' : 'text-white/50'
                    }`}
                  />
                ))}
                <span className="text-white/90 text-sm ml-1">
                  ({accommodation.reviewCount || 0} yorum)
                </span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {accommodation.name}
            </h1>
            <div className="flex items-center text-white/90">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{accommodation.location.address}, {accommodation.location.city}</span>
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
                <p>{accommodation.description}</p>
              </div>
            </div>

            {/* Amenities */}
            {accommodation.amenities && accommodation.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Olanaklar
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {accommodation.amenities.map((amenity, index) => {
                    const Icon = amenityIcons[amenity] || Wifi;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className="w-5 h-5 text-primary-600" />
                        <span className="text-gray-700 capitalize">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Room Types */}
            {accommodation.roomTypes && accommodation.roomTypes.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Oda Tipleri
                </h2>
                <div className="space-y-4">
                  {accommodation.roomTypes.map((room, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{room.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary-600">
                            {formatCurrency(room.price)}/gece
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Kapasite: {room.capacity} kişi
                        </div>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                          Rezervasyon Yap
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Booking */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-primary-100">
              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {accommodation.priceRange?.min && (
                    <>
                      {formatCurrency(accommodation.priceRange.min)}
                      {accommodation.priceRange.max && accommodation.priceRange.max !== accommodation.priceRange.min && (
                        <span className="text-lg text-gray-600"> - {formatCurrency(accommodation.priceRange.max)}</span>
                      )}
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600">gecelik</div>
              </div>
              
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors mb-4">
                Rezervasyon Yap
              </button>
              
              <div className="text-center text-sm text-gray-600">
                Ücretsiz iptal • Ön ödeme yok
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                İletişim
              </h3>
              <div className="space-y-3">
                {accommodation.contact?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Telefon</div>
                      <div className="text-sm text-gray-600">{accommodation.contact.phone}</div>
                    </div>
                  </div>
                )}
                
                {accommodation.contact?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">E-posta</div>
                      <div className="text-sm text-gray-600">{accommodation.contact.email}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Konum
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>{accommodation.location.address}</div>
                <div>{accommodation.location.city}</div>
                {accommodation.location.district && (
                  <div>{accommodation.location.district}</div>
                )}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Konaklama Kuralları
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Giriş: 14:00 sonrası</div>
                <div>• Çıkış: 12:00 öncesi</div>
                <div>• Sigara içilmez</div>
                <div>• Evcil hayvan kabul edilmez</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail; 