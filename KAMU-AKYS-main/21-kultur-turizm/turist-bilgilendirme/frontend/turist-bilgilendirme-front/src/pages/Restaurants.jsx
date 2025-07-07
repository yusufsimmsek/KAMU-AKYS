import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Utensils, MapPin, Star, Clock, Phone, Globe, ChefHat, Grid, List, Filter } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Restaurants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Gerçek Türkiye restoran verileri
  const turkeyRestaurants = [
    {
      id: 1,
      name: "Pandeli",
      description: "1901 yılından beri İstanbul'un kalbinde Ottoman mutfağının en lezzetli örneklerini sunan tarihi restoran.",
      cuisine: "Türk",
      city: "İstanbul",
      district: "Eminönü",
      address: "Mısır Çarşısı No:1, Eminönü",
      phone: "+90 212 527 39 09",
      rating: 4.8,
      priceRange: "₺₺₺",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
      openingHours: "11:00 - 22:00",
      specialty: "Hünkar Beğendi, Kuzu Tandır",
      tags: ["tarihi", "ottoman", "lüks"],
      established: "1901"
    },
    {
      id: 2,
      name: "Nusr-Et Steakhouse",
      description: "Dünya çapında tanınan ünlü chef Nusret'in eşsiz et deneyimi sunan steakhouse'u.",
      cuisine: "Steakhouse",
      city: "İstanbul",
      district: "Etiler",
      address: "Nispetiye Caddesi No:87, Etiler",
      phone: "+90 212 358 20 07",
      rating: 4.6,
      priceRange: "₺₺₺₺",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop",
      openingHours: "12:00 - 02:00",
      specialty: "Tomahawk Steak, Salt Bae Special",
      tags: ["lüks", "et", "ünlü"],
      established: "2010"
    },
    {
      id: 3,
      name: "Çiya Sofrası",
      description: "Anadolu'nun unutulmaya yüz tutmuş yemeklerini canlandıran, geleneksel mutfak kültürünü yaşatan restoran.",
      cuisine: "Anadolu",
      city: "İstanbul",
      district: "Kadıköy",
      address: "Güneşlibahçe Sokak No:43, Kadıköy",
      phone: "+90 216 330 31 90",
      rating: 4.7,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
      openingHours: "10:00 - 23:00",
      specialty: "Anadolu Yemekleri, Keşkek",
      tags: ["geleneksel", "anadolu", "otantik"],
      established: "1987"
    },
    {
      id: 4,
      name: "Kral Sofrası",
      description: "Ankara'nın en köklü restoranlarından biri. Geleneksel Türk mutfağının en güzel örnekleri.",
      cuisine: "Türk",
      city: "Ankara",
      district: "Kızılay",
      address: "Yüksel Caddesi No:12, Kızılay",
      phone: "+90 312 431 52 46",
      rating: 4.5,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
      openingHours: "11:00 - 23:00",
      specialty: "Ankara Tava, Döner",
      tags: ["geleneksel", "aile", "döner"],
      established: "1965"
    },
    {
      id: 5,
      name: "Deniz Restaurant",
      description: "İzmir'in eşsiz körfez manzarası eşliğinde taze deniz ürünleri ve Ege mutfağı.",
      cuisine: "Deniz Ürünleri",
      city: "İzmir",
      district: "Alsancak",
      address: "Kordon Boyu, Alsancak",
      phone: "+90 232 463 74 47",
      rating: 4.9,
      priceRange: "₺₺₺",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
      openingHours: "12:00 - 24:00",
      specialty: "Levrek, Çipura, Midye Dolma",
      tags: ["deniz", "manzara", "taze"],
      established: "1982"
    },
    {
      id: 6,
      name: "Antalya Kebap Evi",
      description: "Antalya'nın en lezzetli kebapları ve Akdeniz mutfağının enfes örnekleri.",
      cuisine: "Kebap",
      city: "Antalya",
      district: "Kaleiçi",
      address: "Kaleiçi Mahallesi, Hesapçı Sokak No:15",
      phone: "+90 242 243 81 64",
      rating: 4.4,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=400&fit=crop",
      openingHours: "11:00 - 23:00",
      specialty: "Antalya Kebabı, Piyaz",
      tags: ["kebap", "akdeniz", "tarihi"],
      established: "1975"
    },
    {
      id: 7,
      name: "Bodrum Balık Evi",
      description: "Bodrum'un turkuaz sularından çıkan en taze balıklar ve meze çeşitleri.",
      cuisine: "Deniz Ürünleri",
      city: "Muğla",
      district: "Bodrum",
      address: "Bodrum Marina, Neyzen Tevfik Caddesi",
      phone: "+90 252 316 12 06",
      rating: 4.8,
      priceRange: "₺₺₺",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      openingHours: "12:00 - 02:00",
      specialty: "Levrek Izgara, Kalamar",
      tags: ["marina", "gece", "lüks"],
      established: "1990"
    },
    {
      id: 8,
      name: "Trabzon Hamsi Lokantası",
      description: "Karadeniz'in en değerli hazinesi hamsinin en lezzetli halini tadın.",
      cuisine: "Karadeniz",
      city: "Trabzon",
      district: "Ortahisar",
      address: "Meydan Parkı Karşısı, Ortahisar",
      phone: "+90 462 321 54 78",
      rating: 4.6,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&h=400&fit=crop",
      openingHours: "10:00 - 22:00",
      specialty: "Hamsi Tava, Karadeniz Pidesi",
      tags: ["hamsi", "karadeniz", "yerel"],
      established: "1988"
    },
    {
      id: 9,
      name: "Konya Etli Ekmek",
      description: "Konya'nın meşhur etli ekmeğinin en lezzetli hali ve Selçuklu mutfağı.",
      cuisine: "Türk",
      city: "Konya",
      district: "Selçuklu",
      address: "Mevlana Caddesi No:45, Selçuklu",
      phone: "+90 332 235 67 89",
      rating: 4.5,
      priceRange: "₺",
      image: "https://images.unsplash.com/photo-1571197119037-4bd71d35372c?w=600&h=400&fit=crop",
      openingHours: "09:00 - 23:00",
      specialty: "Etli Ekmek, Tandır",
      tags: ["etli ekmek", "selçuklu", "ekonomik"],
      established: "1995"
    },
    {
      id: 10,
      name: "Gaziantep Lahmacun",
      description: "Gaziantep'in dünyaca ünlü lahmacunu ve baklava geleneğini sürdüren aile işletmesi.",
      cuisine: "Güneydoğu",
      city: "Gaziantep",
      district: "Şahinbey",
      address: "Eski Kürkçübaşı Caddesi No:78",
      phone: "+90 342 221 45 67",
      rating: 4.9,
      priceRange: "₺",
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&h=400&fit=crop",
      openingHours: "08:00 - 23:00",
      specialty: "Lahmacun, Baklava",
      tags: ["lahmacun", "baklava", "aile"],
      established: "1962"
    },
    {
      id: 11,
      name: "Kapadokya Seramik Cafe",
      description: "Kapadokya'nın eşsiz manzarası eşliğinde yerel lezzetler ve avanos çömlekçiliği.",
      cuisine: "Kapadokya",
      city: "Nevşehir",
      district: "Avanos",
      address: "Avanos Çömlekçiler Sokağı No:12",
      phone: "+90 384 511 23 45",
      rating: 4.7,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
      openingHours: "09:00 - 22:00",
      specialty: "Testi Kebabı, Keşkek",
      tags: ["manzara", "yerel", "çömlek"],
      established: "2001"
    },
    {
      id: 12,
      name: "Bursa İskender",
      description: "İskender kebabının ana vatanı Bursa'da asırlık gelenek ve lezzet.",
      cuisine: "Türk",
      city: "Bursa",
      district: "Osmangazi",
      address: "Cumhuriyet Caddesi No:67, Osmangazi",
      phone: "+90 224 223 34 56",
      rating: 4.8,
      priceRange: "₺₺",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop",
      openingHours: "11:00 - 23:00",
      specialty: "İskender Kebabı, Pideli Köfte",
      tags: ["iskender", "tarihi", "bursa"],
      established: "1897"
    }
  ];

  const cuisines = [
    { value: 'all', label: 'Tüm Mutfaklar', icon: '🍽️' },
    { value: 'Türk', label: 'Türk Mutfağı', icon: '🇹🇷' },
    { value: 'Deniz Ürünleri', label: 'Deniz Ürünleri', icon: '🐟' },
    { value: 'Kebap', label: 'Kebap', icon: '🥩' },
    { value: 'Steakhouse', label: 'Steakhouse', icon: '🥩' },
    { value: 'Anadolu', label: 'Anadolu', icon: '🏔️' },
    { value: 'Karadeniz', label: 'Karadeniz', icon: '🌊' },
    { value: 'Güneydoğu', label: 'Güneydoğu', icon: '🌶️' },
    { value: 'Kapadokya', label: 'Kapadokya', icon: '🏺' }
  ];

  const cities = [
    { value: 'all', label: 'Tüm Şehirler' },
    { value: 'İstanbul', label: 'İstanbul' },
    { value: 'Ankara', label: 'Ankara' },
    { value: 'İzmir', label: 'İzmir' },
    { value: 'Antalya', label: 'Antalya' },
    { value: 'Muğla', label: 'Muğla' },
    { value: 'Trabzon', label: 'Trabzon' },
    { value: 'Konya', label: 'Konya' },
    { value: 'Gaziantep', label: 'Gaziantep' },
    { value: 'Nevşehir', label: 'Nevşehir' },
    { value: 'Bursa', label: 'Bursa' }
  ];

  // Filtreleme ve sıralama
  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...turkeyRestaurants];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Mutfak filtresi
    if (selectedCuisine !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.cuisine === selectedCuisine);
    }
    
    // Şehir filtresi
    if (selectedCity !== 'all') {
      filtered = filtered.filter(restaurant => restaurant.city === selectedCity);
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
      setFilteredRestaurants(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, selectedCuisine, selectedCity, sortBy]);

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

  // Restoran kartı
  const RestaurantCard = ({ restaurant, isListView = false }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isListView ? 'flex' : ''}`}>
      <div className={`relative ${isListView ? 'w-1/3' : 'h-48'} overflow-hidden`}>
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {cuisines.find(c => c.value === restaurant.cuisine)?.icon} {restaurant.cuisine}
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm flex items-center">
          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
          {restaurant.rating}
        </div>
        <div className="absolute bottom-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
          {restaurant.priceRange}
        </div>
      </div>
      
      <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-white">{restaurant.name}</h3>
          <span className="text-cyan-400 text-sm font-semibold">{restaurant.city}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{restaurant.address}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{restaurant.openingHours}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 mr-2" />
            <span className="text-sm">{restaurant.phone}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <ChefHat className="w-4 h-4 mr-2" />
            <span className="text-sm">{restaurant.specialty}</span>
          </div>
        </div>
        
        <p className="text-gray-400 mb-4 leading-relaxed">
          {restaurant.description.length > 120 ? `${restaurant.description.substring(0, 120)}...` : restaurant.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {restaurant.tags.map((tag, index) => (
            <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-1">
              {renderStars(restaurant.rating)}
              <span className="text-yellow-400 ml-1 font-bold">{restaurant.rating}</span>
            </div>
            <div className="text-gray-400 text-sm">{restaurant.established} yılından beri</div>
          </div>
          <Link 
            to={`/restaurants/${restaurant.id}`}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center"
          >
            <Utensils className="w-4 h-4 mr-2" />
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-900 via-red-900 to-gray-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🍽️ Restoranlar
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Türkiye'nin en lezzetli adreslerini keşfedin, yerel ve geleneksel tatları deneyimleyin
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
              placeholder="Restoran ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"
            />
          </div>
          
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 text-white"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine.value} value={cuisine.value} className="bg-gray-800 text-white">
                  {cuisine.icon} {cuisine.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 text-white"
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
              className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-orange-500 text-white"
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
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-gray-300">
              {filteredRestaurants.length} restoran bulundu
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Restoranlar yükleniyor..." />
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Restoran bulunamadı</h3>
            <p className="text-gray-400">Arama kriterlerinizi değiştirip tekrar deneyin.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} isListView={viewMode === 'list'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants; 