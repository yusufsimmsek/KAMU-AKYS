import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Heart, 
  Grid, 
  List, 
  Search, 
  Filter,
  Clock,
  Camera,
  Users,
  Eye,
  Compass,
  Mountain,
  Building,
  TreePine,
  Waves,
  Landmark,
  Calendar,
  ArrowRight,
  ChevronRight,
  Play,
  Award,
  Sparkles
} from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import konyaImage from '../assets/konya.jpg';

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Türkiye'nin popüler destinasyonları (gerçek veriler)
  const turkeyDestinations = [
    {
      id: 1,
      name: "İstanbul",
      region: "Marmara",
      category: "historical",
      description: "Tarihi Sultanahmet, Ayasofya, Topkapı Sarayı ve Boğaz'ın eşsiz güzelliği ile dünyanın en çok ziyaret edilen şehirlerinden biri.",
      image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 15420,
      visitorsCount: "15M+",
      bestTime: "Nisan-Haziran, Eylül-Kasım",
      duration: "3-5 gün",
      highlights: ["Ayasofya", "Sultanahmet", "Kapalıçarşı", "Boğaz Turu"],
      tags: ["tarihi", "kültür", "boğaz", "müze"],
      price: "Orta",
      difficulty: "Kolay",
      featured: true
    },
    {
      id: 2,
      name: "Kapadokya",
      region: "İç Anadolu",
      category: "nature",
      description: "Peribacaları, yeraltı şehirleri ve sıcak hava balonu turu ile dünyanın en romantik destinasyonlarından biri.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      rating: 4.9,
      reviewCount: 12350,
      visitorsCount: "2M+",
      bestTime: "Nisan-Haziran, Eylül-Kasım",
      duration: "2-3 gün",
      highlights: ["Balon Turu", "Göreme", "Derinkuyu", "Avanos"],
      tags: ["doğa", "balon", "romantik", "mağara"],
      price: "Yüksek",
      difficulty: "Orta",
      featured: true
    },
    {
      id: 3,
      name: "Antalya",
      region: "Akdeniz",
      category: "beach",
      description: "Turkuaz denizi, tarihi Kaleiçi ve antik şehirleri ile Akdeniz'in incisi.",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&h=400&fit=crop",
      rating: 4.7,
      reviewCount: 9876,
      visitorsCount: "8M+",
      bestTime: "Nisan-Kasım",
      duration: "4-7 gün",
      highlights: ["Kaleiçi", "Düden Şelalesi", "Aspendos", "Perge"],
      tags: ["deniz", "tarihi", "şelale", "antik"],
      price: "Orta",
      difficulty: "Kolay",
      featured: true
    },
    {
      id: 4,
      name: "Pamukkale",
      region: "Ege",
      category: "nature",
      description: "Beyaz travertenler ve antik Hierapolis şehri ile doğal ve tarihi güzelliklerin buluştuğu eşsiz yer.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6dee9d9?w=600&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 7654,
      visitorsCount: "1.5M+",
      bestTime: "Mart-Haziran, Eylül-Kasım",
      duration: "1-2 gün",
      highlights: ["Travertenler", "Hierapolis", "Antik Havuz", "Müze"],
      tags: ["doğa", "beyaz", "antik", "termal"],
      price: "Düşük",
      difficulty: "Kolay",
      featured: true
    },
    {
      id: 5,
      name: "Efes",
      region: "Ege",
      category: "historical",
      description: "Dünyanın en iyi korunmuş antik şehirlerinden biri. Artemis Tapınağı'nın bulunduğu tarihi merkez.",
      image: "https://images.unsplash.com/photo-1597395616607-41b3cfbf0b3d?w=600&h=400&fit=crop",
      rating: 4.8,
      reviewCount: 5432,
      visitorsCount: "800K+",
      bestTime: "Mart-Haziran, Eylül-Kasım",
      duration: "1 gün",
      highlights: ["Celsus Kütüphanesi", "Büyük Tiyatro", "Artemis Tapınağı", "Meryem Ana Evi"],
      tags: ["antik", "roma", "kültür", "müze"],
      price: "Düşük",
      difficulty: "Orta",
      featured: false
    },
    {
      id: 6,
      name: "Bodrum",
      region: "Ege",
      category: "beach",
      description: "Ege'nin incisi, antik Halikarnas. Gece hayatı, marina ve tarihi kalesi ile ünlü.",
      image: "https://images.unsplash.com/photo-1580492516014-4ac296ac50a4?w=600&h=400&fit=crop",
      rating: 4.5,
      reviewCount: 8765,
      visitorsCount: "1.2M+",
      bestTime: "Mayıs-Ekim",
      duration: "3-5 gün",
      highlights: ["Bodrum Kalesi", "Marina", "Gümbet", "Türkbükü"],
      tags: ["deniz", "gece", "marina", "kale"],
      price: "Yüksek",
      difficulty: "Kolay",
      featured: false
    },
    {
      id: 7,
      name: "Çanakkale",
      region: "Marmara",
      category: "historical",
      description: "Gelibolu Yarımadası ve Truva antik şehri ile tarih tutkunlarının vazgeçilmez durağı.",
      image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&h=400&fit=crop",
      rating: 4.4,
      reviewCount: 3456,
      visitorsCount: "600K+",
      bestTime: "Mart-Haziran, Eylül-Kasım",
      duration: "2-3 gün",
      highlights: ["Gelibolu", "Truva", "Anzac Koyu", "Şehitler Abidesi"],
      tags: ["tarihi", "savaş", "antik", "anıt"],
      price: "Düşük",
      difficulty: "Kolay",
      featured: false
    },
    {
      id: 8,
      name: "Trabzon",
      region: "Karadeniz",
      category: "nature",
      description: "Sümela Manastırı, Uzungöl ve yayla güzellikleriyle Karadeniz'in incisi.",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 4567,
      visitorsCount: "700K+",
      bestTime: "Mayıs-Ekim",
      duration: "3-4 gün",
      highlights: ["Sümela Manastırı", "Uzungöl", "Ayder Yaylası", "Ayasofya"],
      tags: ["doğa", "manastır", "göl", "yayla"],
      price: "Orta",
      difficulty: "Orta",
      featured: false
    },
    {
      id: 9,
      name: "Kayseri",
      region: "İç Anadolu",
      category: "nature",
      description: "Erciyes Dağı eteklerinde tarihi ve doğal güzelliklerin buluştuğu şehir.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
      rating: 4.3,
      reviewCount: 2345,
      visitorsCount: "400K+",
      bestTime: "Haziran-Ekim",
      duration: "2-3 gün",
      highlights: ["Erciyes Dağı", "Kültepe", "Gevher Nesibe", "Hunat Hatun"],
      tags: ["dağ", "kayak", "tarihi", "kültür"],
      price: "Düşük",
      difficulty: "Orta",
      featured: false
    },
    {
      id: 10,
      name: "Konya",
      region: "İç Anadolu",
      category: "cultural",
      description: "Mevlana'nın şehri, tasavvuf kültürü ve Selçuklu mimarisi ile maneviyatın merkezi.",
      image: konyaImage,
      rating: 4.5,
      reviewCount: 3210,
      visitorsCount: "500K+",
      bestTime: "Tüm yıl",
      duration: "1-2 gün",
      highlights: ["Mevlana Müzesi", "Alaaddin Tepesi", "Sille", "İnce Minareli"],
      tags: ["mevlana", "tasavvuf", "selçuklu", "müze"],
      price: "Düşük",
      difficulty: "Kolay",
      featured: false
    },
    {
      id: 11,
      name: "Fethiye",
      region: "Akdeniz",
      category: "beach",
      description: "Ölüdeniz, Butterfly Valley ve antik Likya yolu ile doğa tutkunlarının cenneti.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6dee9d9?w=600&h=400&fit=crop",
      rating: 4.7,
      reviewCount: 6543,
      visitorsCount: "900K+",
      bestTime: "Nisan-Kasım",
      duration: "4-6 gün",
      highlights: ["Ölüdeniz", "Butterfly Valley", "Kayaköy", "Dalyan"],
      tags: ["deniz", "doğa", "yamaç", "antik"],
      price: "Orta",
      difficulty: "Orta",
      featured: false
    },
    {
      id: 12,
      name: "Mardin",
      region: "Güneydoğu Anadolu",
      category: "historical",
      description: "Mezopotamya'nın kadim şehri, taş evleri ve çok kültürlü yapısı ile eşsiz bir deneyim.",
      image: "https://images.unsplash.com/photo-1596348444672-e3c6e7b5b58c?w=600&h=400&fit=crop",
      rating: 4.6,
      reviewCount: 4321,
      visitorsCount: "350K+",
      bestTime: "Mart-Haziran, Eylül-Kasım",
      duration: "2-3 gün",
      highlights: ["Deyrulzafaran", "Kasımiye Medresesi", "Zinciriye", "Midyat"],
      tags: ["tarihi", "taş", "mezopotamya", "kültür"],
      price: "Düşük",
      difficulty: "Kolay",
      featured: false
    }
  ];

  // Kategoriler
  const categories = [
    { value: 'all', label: 'Tüm Kategoriler', icon: Compass, color: 'from-blue-500 to-purple-500' },
    { value: 'historical', label: 'Tarihi Yerler', icon: Landmark, color: 'from-orange-500 to-red-500' },
    { value: 'nature', label: 'Doğa', icon: TreePine, color: 'from-green-500 to-teal-500' },
    { value: 'beach', label: 'Deniz & Plaj', icon: Waves, color: 'from-cyan-500 to-blue-500' },
    { value: 'cultural', label: 'Kültürel', icon: Building, color: 'from-purple-500 to-pink-500' },
    { value: 'mountain', label: 'Dağ & Yayla', icon: Mountain, color: 'from-gray-500 to-green-500' }
  ];

  // Bölgeler
  const regions = [
    { value: 'all', label: 'Tüm Bölgeler' },
    { value: 'Marmara', label: 'Marmara' },
    { value: 'Ege', label: 'Ege' },
    { value: 'Akdeniz', label: 'Akdeniz' },
    { value: 'İç Anadolu', label: 'İç Anadolu' },
    { value: 'Karadeniz', label: 'Karadeniz' },
    { value: 'Doğu Anadolu', label: 'Doğu Anadolu' },
    { value: 'Güneydoğu Anadolu', label: 'Güneydoğu Anadolu' }
  ];

  // Sıralama seçenekleri
  const sortOptions = [
    { value: 'popularity', label: 'Popülerlik' },
    { value: 'rating', label: 'Puan' },
    { value: 'name', label: 'İsim' },
    { value: 'visitors', label: 'Ziyaretçi Sayısı' }
  ];

  // Filtreleme ve sıralama
  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...turkeyDestinations];
    
    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }
    
    // Bölge filtresi
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(dest => dest.region === selectedRegion);
    }
    
    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'visitors':
          return parseInt(b.visitorsCount.replace(/[^0-9]/g, '')) - parseInt(a.visitorsCount.replace(/[^0-9]/g, ''));
        case 'popularity':
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
    
    setTimeout(() => {
      setFilteredDestinations(filtered);
      setIsLoading(false);
    }, 300);
  }, [searchTerm, selectedCategory, selectedRegion, sortBy]);

  // Favori toggle
  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Öne çıkan destinasyonlar
  const featuredDestinations = turkeyDestinations.filter(dest => dest.featured);

  // Yıldız render
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

  // Destinasyon kartı
  const DestinationCard = ({ destination, isListView = false }) => {
    const categoryInfo = categories.find(cat => cat.value === destination.category);
    const Icon = categoryInfo?.icon || Compass;
    
    return (
      <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isListView ? 'flex' : ''}`}>
        <div className={`relative ${isListView ? 'w-1/3' : 'h-64'} overflow-hidden`}>
          <img 
            src={destination.image} 
            alt={destination.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {destination.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <Sparkles className="w-4 h-4 mr-1" />
              Öne Çıkan
            </div>
          )}
          
          <div className={`absolute top-3 right-3 bg-gradient-to-r ${categoryInfo?.color || 'from-gray-500 to-gray-600'} text-white px-3 py-1 rounded-full text-sm font-bold flex items-center`}>
            <Icon className="w-4 h-4 mr-1" />
            {categoryInfo?.label || 'Genel'}
          </div>
          
          <button
            onClick={() => toggleFavorite(destination.id)}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              favorites.includes(destination.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorites.includes(destination.id) ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className={`p-6 ${isListView ? 'flex-1' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white">{destination.name}</h3>
            <span className="text-cyan-400 text-sm font-semibold">{destination.region}</span>
          </div>
          
          <p className="text-gray-300 mb-4 leading-relaxed">
            {destination.description.length > 120 ? `${destination.description.substring(0, 120)}...` : destination.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">{destination.duration}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">{destination.bestTime}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm">{destination.visitorsCount} yıllık ziyaret</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {destination.highlights.slice(0, 3).map((highlight, index) => (
              <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                {highlight}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {renderStars(destination.rating)}
              <span className="text-yellow-400 ml-1 font-bold">{destination.rating}</span>
              <span className="text-gray-400 ml-1 text-sm">({destination.reviewCount})</span>
            </div>
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                destination.price === 'Düşük' ? 'bg-green-500/20 text-green-300' :
                destination.price === 'Orta' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {destination.price}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/destinations/${destination.id}`}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center"
          >
            Detayları Gör
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539650116574-75c0c6dee9d9?w=1920&h=1080&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Türkiye'yi Keşfet
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Anadolu'nun kadim topraklarından modern şehirlere, doğa harikalarından tarihi kalıntılara...
              Türkiye'nin eşsiz destinasyonlarını keşfedin.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
                <span className="text-blue-400 font-bold">500+</span> Destinasyon
              </div>
              <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
                <span className="text-green-400 font-bold">7</span> Bölge
              </div>
              <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
                <span className="text-purple-400 font-bold">50M+</span> Ziyaretçi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Öne Çıkan Destinasyonlar */}
      <section className="py-16 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Öne Çıkan Destinasyonlar
              </span>
            </h2>
            <p className="text-gray-300 text-lg">En popüler ve beğenilen gezilecek yerler</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300">
                <div className="relative h-48">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Öne Çıkan
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-bold text-lg">{destination.name}</h3>
                    <div className="flex items-center text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {destination.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kategoriler */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Kategoriler</h2>
            <p className="text-gray-300">İlgi alanınıza göre destinasyonları keşfedin</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(1).map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r ' + category.color + ' text-white border-transparent'
                      : 'bg-white/5 backdrop-blur-lg border-white/10 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-3" />
                  <div className="text-sm font-semibold">{category.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filtreler ve Arama */}
      <section className="py-8 px-6 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Destinasyon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-gray-800 text-white">
                    {category.label}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value} className="bg-gray-800 text-white">
                    {region.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                    {option.label}
                  </option>
                ))}
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
                {filteredDestinations.length} destinasyon bulundu
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinasyonlar Listesi */}
      <section className="py-16 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner text="Destinasyonlar yükleniyor..." />
        </div>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Destinasyon bulunamadı</h3>
              <p className="text-gray-400">Arama kriterlerinizi değiştirip tekrar deneyin.</p>
      </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} isListView={viewMode === 'list'} />
              ))}
          </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default Destinations; 