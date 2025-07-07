import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Clock, Users, Ticket, Star, Filter, Grid, List } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ImageComponent from '../components/common/ImageComponent';

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gerçek Türkiye etkinlik verileri
  const turkeyEvents = [
    {
      id: 1,
      title: "İstanbul Müzik Festivali",
      description: "Klasik müziğin en güzel örnekleri İstanbul'da buluşuyor. Dünya çapında sanatçılar eşliğinde unutulmaz bir müzik deneyimi yaşayın.",
      date: "2024-06-15",
      endDate: "2024-06-30",
      time: "20:00",
      location: "Cemil Topuzlu Açıkhava Tiyatrosu",
      city: "İstanbul",
      category: "musik",
      price: "150-300",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
      organizer: "İstanbul Kültür Sanat Vakfı",
      capacity: 2000,
      rating: 4.8,
      tags: ["klasik müzik", "festival", "açıkhava"]
    },
    {
      id: 2,
      title: "Kapadokya Balon Festivali",
      description: "Dünyanın en güzel manzarasında balon uçuşu deneyimi. Kapadokya'nın eşsiz coğrafyasında unutulmaz anlar yaşayın.",
      date: "2024-07-20",
      endDate: "2024-07-25",
      time: "06:00",
      location: "Göreme Açıkhava Müzesi",
      city: "Nevşehir",
      category: "turizm",
      price: "500-800",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      organizer: "Kapadokya Turizm Birliği",
      capacity: 500,
      rating: 4.9,
      tags: ["balon", "manzara", "turizm"]
    },
    {
      id: 3,
      title: "Antalya Altın Portakal Film Festivali",
      description: "Türk sinemasının en prestijli ödülleri Antalya'da sahiplerini buluyor. Sinema severler için vazgeçilmez bir etkinlik.",
      date: "2024-10-05",
      endDate: "2024-10-12",
      time: "19:00",
      location: "Antalya Kültür Merkezi",
      city: "Antalya",
      category: "sinema",
      price: "75-200",
      image: "https://images.unsplash.com/photo-1489599735086-9c6c6b8c6e5c?w=600&h=400&fit=crop",
      organizer: "Antalya Büyükşehir Belediyesi",
      capacity: 1200,
      rating: 4.7,
      tags: ["sinema", "film", "ödül"]
    },
    {
      id: 4,
      title: "Bodrum Müzik Festivali",
      description: "Bodrum'un muhteşem atmosferinde elektronik müzik ve DJ performansları. Gece boyunca dans edin!",
      date: "2024-08-10",
      endDate: "2024-08-15",
      time: "22:00",
      location: "Bodrum Antik Tiyatro",
      city: "Muğla",
      category: "musik",
      price: "200-500",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=400&fit=crop",
      organizer: "Bodrum Belediyesi",
      capacity: 3000,
      rating: 4.6,
      tags: ["elektronik", "dance", "gece"]
    },
    {
      id: 5,
      title: "Ankara Tiyatro Festivali",
      description: "Başkentin kültür hayatına renk katan tiyatro festivali. Yerli ve yabancı oyunlar bir arada.",
      date: "2024-09-15",
      endDate: "2024-09-30",
      time: "20:00",
      location: "Ankara Devlet Tiyatrosu",
      city: "Ankara",
      category: "tiyatro",
      price: "50-150",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      organizer: "Ankara Büyükşehir Belediyesi",
      capacity: 800,
      rating: 4.5,
      tags: ["tiyatro", "sanat", "kültür"]
    },
    {
      id: 6,
      title: "İzmir Enternasyonal Fuarı",
      description: "Ege'nin incisi İzmir'de düzenlenen büyük fuar etkinliği. Teknoloji, sanat ve ticaret bir arada.",
      date: "2024-08-25",
      endDate: "2024-09-05",
      time: "10:00",
      location: "İzmir Fuar Alanı",
      city: "İzmir",
      category: "fuar",
      price: "25-50",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
      organizer: "İzmir Ticaret Odası",
      capacity: 10000,
      rating: 4.3,
      tags: ["fuar", "teknoloji", "ticaret"]
    },
    {
      id: 7,
      title: "Pamukkale Doğa Festivali",
      description: "Pamukkale'nin beyaz cennetinde doğa yürüyüşü ve yoga etkinlikleri. Huzur dolu bir hafta sonu.",
      date: "2024-05-20",
      endDate: "2024-05-22",
      time: "08:00",
      location: "Pamukkale Travertenleri",
      city: "Denizli",
      category: "doga",
      price: "100-250",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=400&fit=crop",
      organizer: "Pamukkale Belediyesi",
      capacity: 300,
      rating: 4.8,
      tags: ["doğa", "yoga", "huzur"]
    },
    {
      id: 8,
      title: "Trabzon Hamsi Festivali",
      description: "Karadeniz'in en lezzetli balığı hamsi için özel festival. Yemek yarışmaları ve kültürel etkinlikler.",
      date: "2024-11-10",
      endDate: "2024-11-12",
      time: "12:00",
      location: "Trabzon Sahil Parkı",
      city: "Trabzon",
      category: "gastronomi",
      price: "30-80",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop",
      organizer: "Trabzon Büyükşehir Belediyesi",
      capacity: 5000,
      rating: 4.4,
      tags: ["gastronomi", "hamsi", "karadeniz"]
    },
    {
      id: 9,
      title: "Konya Mevlana Festivali",
      description: "Mevlana'nın şehrinde tasavvuf müziği ve sema gösterileri. Manevi bir yolculuk deneyimi.",
      date: "2024-12-07",
      endDate: "2024-12-17",
      time: "21:00",
      location: "Mevlana Kültür Merkezi",
      city: "Konya",
      category: "kultur",
      price: "40-120",
      image: "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?w=600&h=400&fit=crop",
      organizer: "Konya Büyükşehir Belediyesi",
      capacity: 1500,
      rating: 4.9,
      tags: ["mevlana", "tasavvuf", "sema"]
    },
    {
      id: 10,
      title: "Kayseri Erciyes Kayak Festivali",
      description: "Erciyes'in karlı zirvelerinde kayak festivali. Kış sporları tutkunları için mükemmel etkinlik.",
      date: "2024-12-20",
      endDate: "2024-12-25",
      time: "09:00",
      location: "Erciyes Kayak Merkezi",
      city: "Kayseri",
      category: "spor",
      price: "300-600",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      organizer: "Erciyes A.Ş.",
      capacity: 1000,
      rating: 4.7,
      tags: ["kayak", "kış", "spor"]
    }
  ];

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler', icon: '🎭' },
    { value: 'musik', label: 'Müzik', icon: '🎵' },
    { value: 'tiyatro', label: 'Tiyatro', icon: '🎭' },
    { value: 'sinema', label: 'Sinema', icon: '🎬' },
    { value: 'fuar', label: 'Fuar', icon: '🏢' },
    { value: 'spor', label: 'Spor', icon: '⚽' },
    { value: 'gastronomi', label: 'Gastronomi', icon: '🍽️' },
    { value: 'kultur', label: 'Kültür', icon: '🕌' },
    { value: 'doga', label: 'Doğa', icon: '🌲' },
    { value: 'turizm', label: 'Turizm', icon: '🏔️' }
  ];

  const cities = [
    { value: 'all', label: 'Tüm Şehirler' },
    { value: 'İstanbul', label: 'İstanbul' },
    { value: 'Ankara', label: 'Ankara' },
    { value: 'İzmir', label: 'İzmir' },
    { value: 'Antalya', label: 'Antalya' },
    { value: 'Nevşehir', label: 'Nevşehir' },
    { value: 'Muğla', label: 'Muğla' },
    { value: 'Trabzon', label: 'Trabzon' },
    { value: 'Konya', label: 'Konya' },
    { value: 'Kayseri', label: 'Kayseri' },
    { value: 'Denizli', label: 'Denizli' }
  ];

  // Filtreleme ve sıralama
  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...turkeyEvents];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    // Şehir filtresi
    if (selectedCity !== 'all') {
      filtered = filtered.filter(event => event.city === selectedCity);
    }
    
    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        case 'price':
          return parseInt(a.price.split('-')[0]) - parseInt(b.price.split('-')[0]);
        default:
          return 0;
      }
    });
    
    setTimeout(() => {
      setFilteredEvents(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, selectedCategory, selectedCity, sortBy]);

  // Tarih formatlama
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Etkinlik kartı
  const EventCard = ({ event, isListView = false }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isListView ? 'flex' : ''}`}>
      <div className={`relative ${isListView ? 'w-1/3' : 'h-48'} overflow-hidden`}>
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {categories.find(cat => cat.value === event.category)?.icon} {categories.find(cat => cat.value === event.category)?.label}
        </div>
        {event.rating && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            {event.rating}
          </div>
        )}
      </div>
      
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <span className="text-cyan-400 text-sm font-semibold">{event.city}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.capacity} kişi</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4 leading-relaxed">
          {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-green-400 font-bold text-lg">{event.price} ₺</div>
            <div className="text-gray-400 text-sm">{event.organizer}</div>
          </div>
          <Link 
            to={`/events/${event.id}`}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center"
          >
            <Ticket className="w-4 h-4 mr-2" />
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎭 Etkinlikler
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Türkiye'nin dört bir yanından kültürel, sanatsal ve sosyal etkinlikleri keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Etkinlik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-gray-800 text-white">
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
            >
              {cities.map(city => (
                <option key={city.value} value={city.value} className="bg-gray-800 text-white">
                  {city.label}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="date" className="bg-gray-800">Tarihe Göre</option>
              <option value="title" className="bg-gray-800">İsme Göre</option>
              <option value="rating" className="bg-gray-800">Puana Göre</option>
              <option value="price" className="bg-gray-800">Fiyata Göre</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-gray-300">
              {filteredEvents.length} etkinlik bulundu
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Etkinlikler yükleniyor..." />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Etkinlik bulunamadı</h3>
            <p className="text-gray-400">Arama kriterlerinizi değiştirip tekrar deneyin.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} isListView={viewMode === 'list'} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Events; 