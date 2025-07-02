import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '../services/api';
import { MapPin, Calendar, Clock, Users, Ticket, Share2, Heart } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatDate, formatCurrency } from '../utils';

const EventDetail = () => {
  const { id } = useParams();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsAPI.getById(id),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner text="Etkinlik yükleniyor..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Etkinlik bulunamadı
          </h1>
          <Link to="/events" className="text-primary-600 hover:text-primary-700">
            Etkinliklere geri dön
          </Link>
        </div>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isMultiDay = startDate.toDateString() !== endDate.toDateString();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 md:h-[400px] overflow-hidden">
        <img
          src={event.images?.[0] || '/images/placeholder-event.jpg'}
          alt={event.title.tr}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/90 hover:bg-white p-3 rounded-full text-gray-700 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-white/90 hover:bg-white p-3 rounded-full text-gray-700 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {event.title.tr}
            </h1>
            <div className="flex items-center text-white/90 text-lg">
              <Calendar className="w-5 h-5 mr-2" />
              <span>
                {isMultiDay 
                  ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                  : formatDate(startDate)
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Etkinlik Detayları
              </h2>
              <div className="prose max-w-none text-gray-600">
                <p>{event.description.tr}</p>
              </div>
            </div>

            {/* Schedule */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Program
                </h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded text-sm font-medium">
                          {item.time}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-primary-100">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {event.price?.amount ? formatCurrency(event.price.amount) : 'Ücretsiz'}
                </div>
                {event.price?.amount && (
                  <div className="text-sm text-gray-600">Kişi başı</div>
                )}
              </div>
              
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors">
                <Ticket className="w-5 h-5 mr-2 inline" />
                Bilet Al
              </button>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Kalan bilet:</span>
                  <span className="font-medium text-gray-900">
                    {event.capacity ? `${event.capacity} kişi` : 'Sınırsız'}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Etkinlik Bilgileri
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Tarih</div>
                    <div className="text-sm text-gray-600">
                      {isMultiDay 
                        ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                        : formatDate(startDate)
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Saat</div>
                    <div className="text-sm text-gray-600">
                      {startDate.toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {!isMultiDay && endDate && (
                        ` - ${endDate.toLocaleTimeString('tr-TR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}`
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mekan</div>
                    <div className="text-sm text-gray-600">
                      {event.location.venue}
                      <br />
                      {event.location.address}, {event.location.city}
                    </div>
                  </div>
                </div>

                {event.capacity && (
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Kapasite</div>
                      <div className="text-sm text-gray-600">{event.capacity} kişi</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organizatör
                </h3>
                <div>
                  <div className="font-medium text-gray-900">{event.organizer.name}</div>
                  {event.organizer.contact && (
                    <div className="text-sm text-gray-600 mt-1">
                      {event.organizer.contact}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 