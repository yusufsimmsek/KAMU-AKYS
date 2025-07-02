import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eventsAPI } from '../services/api';
import { Search, Calendar, MapPin, Clock, Users, Ticket } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { formatDate, formatCurrency, truncateText, categoryTranslations } from '../utils';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'date');
  
  // Pagination
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 12;

  // Build query parameters
  const queryParams = {
    page,
    limit,
    ...(searchTerm && { search: searchTerm }),
    ...(selectedCategory && { category: selectedCategory }),
    ...(selectedCity && { city: selectedCity }),
    ...(dateFilter !== 'all' && { dateFilter }),
    sort: sortBy,
  };

  // Fetch events
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', queryParams],
    queryFn: () => eventsAPI.getAll(queryParams),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCity) params.set('city', selectedCity);
    if (dateFilter !== 'all') params.set('date', dateFilter);
    if (sortBy !== 'date') params.set('sort', sortBy);
    if (page !== 1) params.set('page', page.toString());
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, selectedCity, dateFilter, sortBy, page, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    if (newPage === 1) {
      params.delete('page');
    } else {
      params.set('page', newPage.toString());
    }
    setSearchParams(params);
  };

  const categories = Object.keys(categoryTranslations.events);
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya'];
  
  const dateFilters = [
    { value: 'all', label: 'Tüm Tarihler' },
    { value: 'today', label: 'Bugün' },
    { value: 'tomorrow', label: 'Yarın' },
    { value: 'week', label: 'Bu Hafta' },
    { value: 'month', label: 'Bu Ay' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Tarihe Göre' },
    { value: 'title', label: 'İsme Göre' },
    { value: 'price', label: 'Fiyata Göre' },
    { value: 'newest', label: 'En Yeni' },
  ];

  const events = data?.data || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Etkinlikler
            </h1>
            <p className="text-lg text-gray-600">
              Yaklaşan kültürel ve sanatsal etkinlikleri keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Etkinlik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryTranslations.events[category]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Etkinlikler yükleniyor..." />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">Bir hata oluştu: {error.message}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Etkinlik bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinizi değiştirip tekrar deneyin.
            </p>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {data?.total || 0} etkinlik bulundu
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isMultiDay = startDate.toDateString() !== endDate.toDateString();

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={event.images?.[0] || '/images/placeholder-event.jpg'}
          alt={event.title.tr}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-sm font-semibold">
          {categoryTranslations.events[event.category] || event.category}
        </div>
        <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-2 py-1 rounded text-sm font-semibold">
          {formatDate(startDate, 'dd MMM')}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {event.title.tr}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3">
          {truncateText(event.description.tr, 100)}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {isMultiDay 
                ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                : formatDate(startDate)
              }
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span>
              {startDate.toLocaleTimeString('tr-TR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{event.location.venue}, {event.location.city}</span>
          </div>

          {event.capacity && (
            <div className="flex items-center text-gray-600 text-sm">
              <Users className="w-4 h-4 mr-2" />
              <span>Kapasite: {event.capacity}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Ticket className="w-4 h-4 mr-1 text-primary-600" />
            {event.price?.amount ? (
              <span className="text-primary-600 font-semibold">
                {formatCurrency(event.price.amount)}
              </span>
            ) : (
              <span className="text-green-600 font-semibold">Ücretsiz</span>
            )}
          </div>
          
          <Link
            to={`/events/${event._id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Events; 