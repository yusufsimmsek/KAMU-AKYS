import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bed, MapPin, Star, Wifi, Car, Phone, Globe, Hotel, Grid, List, Filter } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Accommodations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredAccommodations, setFilteredAccommodations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gerçek Türkiye konaklama verileri
  const turkeyAccommodations = [
    {
      id: 1,
      name: "Çırağan Palace Kempinski",
      description: "Boğaz kıyısında tarihi Osmanlı sarayında lüks konaklama deneyimi. İstanbul'un en prestijli otellerinden biri.",
      type: "Lüks Otel",
      city: "İstanbul",
      district: "Beşiktaş",
      address: "Çırağan Caddesi No:32, Beşiktaş",
      phone: "+90 212 326 46 46",
      rating: 4.9,
      priceRange: "₺₺₺₺₺",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
      amenities: ["Spa", "Boğaz Manzarası", "Infinity Pool", "Michelin Restoran"],
      roomCount: 313,
      established: "1874",
      tags: ["lüks", "tarihi", "boğaz", "saray"]
    },
    {
      id: 2,
      name: "Four Seasons Sultanahmet",
      description: "Sultanahmet'in kalbinde tarihi bir cezaevi binasında butik lüks konaklama.",
      type: "Butik Otel",
      city: "İstanbul",
      district: "Sultanahmet",
      address: "Tevkifhane Sokak No:1, Sultanahmet",
      phone: "+90 212 402 30 00",
      rating: 4.8,
      priceRange: "₺₺₺₺₺",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
      amenities: ["Spa", "Tarihi Atmosfer", "Restoran", "Concierge"],
      roomCount: 65,
      established: "1996",
      tags: ["butik", "tarihi", "sultanahmet", "lüks"]
    },
    {
      id: 3,
      name: "Mardan Palace",
      description: "Akdeniz'in incisi Antalya'da all-inclusive lüks tatil deneyimi.",
      type: "Resort",
      city: "Antalya",
      district: "Lara",
      address: "Kundu Mevkii, Lara",
      phone: "+90 242 310 12 34",
      rating: 4.7,
      priceRange: "₺₺₺₺",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
      amenities: ["All-Inclusive", "Özel Plaj", "Aquapark", "Golf Sahası"],
      roomCount: 560,
      established: "2009",
      tags: ["resort", "all-inclusive", "plaj", "aile"]
    },
    {
      id: 4,
      name: "Swissotel Ankara",
      description: "Ankara'nın merkezinde modern lüks ve iş dünyasının buluşma noktası.",
      type: "İş Oteli",
      city: "Ankara",
      district: "Çankaya",
      address: "José Marti Caddesi No:2, Çankaya",
      phone: "+90 312 409 30 00",
      rating: 4.6,
      priceRange: "₺₺₺",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
      amenities: ["Business Center", "Spa", "Fitness", "Meeting Rooms"],
      roomCount: 415,
      established: "1995",
      tags: ["iş", "modern", "merkezi", "konferans"]
    },
    {
      id: 5,
      name: "Hilton İzmir",
      description: "İzmir'in kalbinde Alsancak'ta deniz manzaralı konaklama.",
      type: "Şehir Oteli",
      city: "İzmir",
      district: "Alsancak",
      address: "Gazi Osman Paşa Bulvarı No:7, Alsancak",
      phone: "+90 232 497 60 60",
      rating: 4.5,
      priceRange: "₺₺₺",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      amenities: ["Deniz Manzarası", "Rooftop Bar", "Spa", "Business Center"],
      roomCount: 381,
      established: "1991",
      tags: ["şehir", "deniz", "alsancak", "iş"]
    },
    {
      id: 6,
      name: "Kapadokya Cave Suites",
      description: "Kapadokya'nın eşsiz manzarası ile doğal mağara odalar.",
      type: "Boutique Cave Hotel",
      city: "Nevşehir",
      district: "Göreme",
      address: "Göreme Kasabası, Nevşehir",
      phone: "+90 384 271 20 00",
      rating: 4.9,
      priceRange: "₺₺₺₺",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      amenities: ["Mağara Odalar", "Balon Turu", "Teras", "Spa"],
      roomCount: 30,
      established: "2005",
      tags: ["mağara", "kapadokya", "eşsiz", "romantik"]
    },
    {
      id: 7,
      name: "Bodrum Edition",
      description: "Bodrum'un turkuaz sularında modern lüks ve beach club deneyimi.",
      type: "Beach Resort",
      city: "Muğla",
      district: "Bodrum",
      address: "Yalikavak Marina, Bodrum",
      phone: "+90 252 311 12 34",
      rating: 4.8,
      priceRange: "₺₺₺₺₺",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
      amenities: ["Özel Plaj", "Yacht Marina", "Spa", "Nightclub"],
      roomCount: 102,
      established: "2018",
      tags: ["plaj", "marina", "lüks", "gece"]
    },
    {
      id: 8,
      name: "Sumahan on the Water",
      description: "Boğaz'ın sessiz kıyısında tarihi rakı fabrikasında butik konaklama.",
      type: "Butik Otel",
      city: "İstanbul",
      district: "Çengelköy",
      address: "Kuleli Caddesi No:51, Çengelköy",
      phone: "+90 216 422 80 00",
      rating: 4.7,
      priceRange: "₺₺₺₺",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
      amenities: ["Boğaz Manzarası", "Spa", "Restoran", "Özel İskele"],
      roomCount: 20,
      established: "2005",
      tags: ["butik", "boğaz", "tarihi", "sessiz"]
    },
    {
      id: 9,
      name: "Pamukkale Thermal Hotel",
      description: "Pamukkale'nin beyaz cennetinde termal su deneyimi.",
      type: "Termal Otel",
      city: "Denizli",
      district: "Pamukkale",
      address: "Pamukkale Mevkii, Denizli",
      phone: "+90 258 272 20 24",
      rating: 4.4,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=600&h=400&fit=crop",
      amenities: ["Termal Havuzlar", "Spa", "Doğa Yürüyüşü", "Sağlık"],
      roomCount: 150,
      established: "1988",
      tags: ["termal", "sağlık", "doğa", "pamukkale"]
    },
    {
      id: 10,
      name: "Trabzon Zorlu Grand Hotel",
      description: "Karadeniz'in yemyeşil doğasında geleneksel Trabzon misafirperverliği.",
      type: "Şehir Oteli",
      city: "Trabzon",
      district: "Ortahisar",
      address: "Maraş Caddesi No:11, Ortahisar",
      phone: "+90 462 326 84 00",
      rating: 4.3,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      amenities: ["Spa", "Restoran", "Business Center", "Otopark"],
      roomCount: 168,
      established: "1992",
      tags: ["şehir", "karadeniz", "geleneksel", "merkezi"]
    },
    {
      id: 11,
      name: "Kaya Palazzo Resort",
      description: "Belek'te all-inclusive lüks golf resort deneyimi.",
      type: "Golf Resort",
      city: "Antalya",
      district: "Belek",
      address: "Belek Turizm Merkezi, Belek",
      phone: "+90 242 710 23 00",
      rating: 4.6,
      priceRange: "₺₺₺₺",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      amenities: ["Golf Sahası", "All-Inclusive", "Spa", "Aquapark"],
      roomCount: 459,
      established: "2006",
      tags: ["golf", "all-inclusive", "lüks", "aile"]
    },
    {
      id: 12,
      name: "Gaziantep Anadolu Evleri",
      description: "Gaziantep'in tarihi dokusunda geleneksel Anadolu mimarisi.",
      type: "Butik Otel",
      city: "Gaziantep",
      district: "Şahinbey",
      address: "Şahinbey Caddesi No:45, Şahinbey",
      phone: "+90 342 220 95 25",
      rating: 4.5,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop",
      amenities: ["Tarihi Mimari", "Geleneksel Dekor", "Hamam", "Avlu"],
      roomCount: 24,
      established: "2010",
      tags: ["tarihi", "geleneksel", "anadolu", "butik"]
    }
  ];

  const accommodationTypes = [
    { value: 'all', label: 'Tüm Konaklama Türleri', icon: '🏨' },
    { value: 'Lüks Otel', label: 'Lüks Otel', icon: '👑' },
    { value: 'Butik Otel', label: 'Butik Otel', icon: '🏛️' },
    { value: 'Resort', label: 'Resort', icon: '🏖️' },
    { value: 'İş Oteli', label: 'İş Oteli', icon: '💼' },
    { value: 'Şehir Oteli', label: 'Şehir Oteli', icon: '🏙️' },
    { value: 'Beach Resort', label: 'Beach Resort', icon: '🏄' },
    { value: 'Termal Otel', label: 'Termal Otel', icon: '♨️' },
    { value: 'Golf Resort', label: 'Golf Resort', icon: '⛳' },
    { value: 'Boutique Cave Hotel', label: 'Mağara Otel', icon: '🏔️' }
  ];

  const cities = [
    { value: 'all', label: 'Tüm Şehirler' },
    { value: 'İstanbul', label: 'İstanbul' },
    { value: 'Antalya', label: 'Antalya' },
    { value: 'Ankara', label: 'Ankara' },
    { value: 'İzmir', label: 'İzmir' },
    { value: 'Muğla', label: 'Muğla' },
    { value: 'Nevşehir', label: 'Nevşehir' },
    { value: 'Denizli', label: 'Denizli' },
    { value: 'Trabzon', label: 'Trabzon' },
    { value: 'Gaziantep', label: 'Gaziantep' }
  ];

  // Filtreleme ve sıralama
  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...turkeyAccommodations];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(accommodation =>
        accommodation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accommodation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accommodation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accommodation.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accommodation.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tür filtresi
    if (selectedType !== 'all') {
      filtered = filtered.filter(accommodation => accommodation.type === selectedType);
    }
    
    // Şehir filtresi
    if (selectedCity !== 'all') {
      filtered = filtered.filter(accommodation => accommodation.city === selectedCity);
    }
    
    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.priceRange.length - b.priceRange.length;
        case 'established':
          return parseInt(a.established) - parseInt(b.established);
        default:
          return 0;
      }
    });
    
    setTimeout(() => {
      setFilteredAccommodations(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, selectedType, selectedCity, sortBy]);

  // Yıldız render etme
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-yellow-400 fill-current opacity-50" />);
    }
    
    return stars;
  };

  // Konaklama kartı
  const AccommodationCard = ({ accommodation, isListView = false }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isListView ? 'flex' : ''}`}>
      <div className={`relative ${isListView ? 'w-1/3' : 'h-48'} overflow-hidden`}>
        <img 
          src={accommodation.image} 
          alt={accommodation.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {accommodationTypes.find(t => t.value === accommodation.type)?.icon} {accommodation.type}
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          {accommodation.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
          {accommodation.priceRange}
        </div>
      </div>
      
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{accommodation.name}</h3>
          <span className="text-cyan-400 text-sm font-semibold">{accommodation.city}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{accommodation.address}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">{accommodation.phone}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Bed className="w-4 h-4 mr-2" />
            <span className="text-sm">{accommodation.roomCount} oda</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Hotel className="w-4 h-4 mr-2" />
            <span className="text-sm">{accommodation.established} yılından beri</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4 leading-relaxed">
          {accommodation.description.length > 120 ? `${accommodation.description.substring(0, 120)}...` : accommodation.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {accommodation.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
              {amenity}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {accommodation.tags.map((tag, index) => (
            <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              {renderStars(accommodation.rating)}
              <span className="text-yellow-400 ml-1 font-bold">{accommodation.rating}</span>
            </div>
            <div className="text-gray-400 text-sm">{accommodation.roomCount} oda</div>
          </div>
          <Link 
            to={`/accommodations/${accommodation.id}`}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center"
          >
            <Bed className="w-4 h-4 mr-2" />
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🏨 Konaklama
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Türkiye'nin en konforlu ve lüks konaklama seçeneklerini keşfedin
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
              placeholder="Konaklama ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
          
          <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
            >
              {accommodationTypes.map(type => (
                <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
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
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="rating" className="bg-gray-800">Puana Göre</option>
              <option value="name" className="bg-gray-800">İsme Göre</option>
              <option value="price" className="bg-gray-800">Fiyata Göre</option>
              <option value="established" className="bg-gray-800">Tarihe Göre</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-gray-300">
              {filteredAccommodations.length} konaklama yeri bulundu
            </div>
          </div>
        </div>

        {/* Accommodations Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Konaklama yerleri yükleniyor..." />
          </div>
        ) : filteredAccommodations.length === 0 ? (
          <div className="text-center py-12">
            <Bed className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Konaklama yeri bulunamadı</h3>
            <p className="text-gray-400">Arama kriterlerinizi değiştirip tekrar deneyin.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredAccommodations.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} isListView={viewMode === 'list'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accommodations; 