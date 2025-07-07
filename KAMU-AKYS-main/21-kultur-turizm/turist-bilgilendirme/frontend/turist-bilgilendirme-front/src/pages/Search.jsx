import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Bed, Utensils, Star, Clock, Users, Filter, X, Heart } from 'lucide-react';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorCard from '../components/UI/ErrorCard';
import useFavorites from '../hooks/useFavorites';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Sample data for search - in real app, this would come from an API
  const allData = {
    destinations: [
      {
        id: 1,
        type: 'destination',
        title: 'İstanbul',
        description: 'Tarihi ve modern yaşamın buluştuğu büyülü şehir',
        image: '/images/istanbul.jpg',
        rating: 4.8,
        reviews: 1240,
        location: 'Marmara Bölgesi',
        keywords: ['istanbul', 'tarihi', 'müze', 'boğaz', 'ayasofya', 'topkapi', 'galata kulesi']
      },
      {
        id: 2,
        type: 'destination',
        title: 'Kapadokya',
        description: 'Peri bacaları ve balon turları ile ünlü mistik bölge',
        image: '/images/kapadokya.jpg',
        rating: 4.9,
        reviews: 892,
        location: 'Nevşehir',
        keywords: ['kapadokya', 'balon', 'peri bacası', 'göreme', 'underground', 'fairy chimneys']
      },
      {
        id: 3,
        type: 'destination',
        title: 'Antalya',
        description: 'Akdeniz\'in incisi, güneş ve deniz',
        image: '/images/antalya.jpg',
        rating: 4.7,
        reviews: 1560,
        location: 'Akdeniz Bölgesi',
        keywords: ['antalya', 'deniz', 'güneş', 'plaj', 'kaleici', 'olympos', 'phaselis']
      },
      {
        id: 4,
        type: 'destination',
        title: 'Pamukkale',
        description: 'Beyaz travertenleriyle doğa harikası',
        image: '/images/pamukkale.jpg',
        rating: 4.6,
        reviews: 743,
        location: 'Denizli',
        keywords: ['pamukkale', 'travertenler', 'hierapolis', 'kaplıca', 'beyaz', 'termal']
      }
    ],
    events: [
      {
        id: 1,
        type: 'event',
        title: 'İstanbul Müzik Festivali',
        description: 'Dünya çapında sanatçıların katılımıyla müzik şöleni',
        image: '/images/music-festival.jpg',
        rating: 4.7,
        reviews: 320,
        date: '2024-06-15',
        location: 'İstanbul',
        price: 150,
        keywords: ['müzik', 'festival', 'konser', 'sanat', 'istanbul', 'canlı müzik']
      },
      {
        id: 2,
        type: 'event',
        title: 'Kapadokya Balon Festivali',
        description: 'Gökyüzünde renkli balonlarla unutulmaz deneyim',
        image: '/images/balloon-festival.jpg',
        rating: 4.9,
        reviews: 287,
        date: '2024-07-20',
        location: 'Kapadokya',
        price: 200,
        keywords: ['balon', 'festival', 'kapadokya', 'uçuş', 'manzara', 'sunrise']
      }
    ],
    accommodations: [
      {
        id: 1,
        type: 'accommodation',
        title: 'Sultanahmet Palace Hotel',
        description: 'Tarihi yarımadada lüks konaklama',
        image: '/images/sultanahmet-hotel.jpg',
        rating: 4.8,
        reviews: 524,
        location: 'İstanbul',
        price: 350,
        rooms: 45,
        keywords: ['otel', 'sultanahmet', 'tarihi', 'lüks', 'istanbul', 'ayasofya yakın']
      },
      {
        id: 2,
        type: 'accommodation',
        title: 'Kapadokya Cave Hotel',
        description: 'Mağara odalarında eşsiz konaklama deneyimi',
        image: '/images/cave-hotel.jpg',
        rating: 4.9,
        reviews: 312,
        location: 'Kapadokya',
        price: 280,
        rooms: 28,
        keywords: ['mağara otel', 'kapadokya', 'butik', 'romantik', 'unique', 'göreme']
      }
    ],
    restaurants: [
      {
        id: 1,
        type: 'restaurant',
        title: 'Pandeli Restaurant',
        description: 'Osmanlı mutfağının en seçkin lezzetleri',
        image: '/images/pandeli.jpg',
        rating: 4.6,
        reviews: 892,
        location: 'İstanbul',
        cuisine: 'Osmanlı',
        priceLevel: 4,
        keywords: ['osmanlı mutfağı', 'tarihi', 'eminönü', 'geleneksel', 'lezzet', 'authentic']
      },
      {
        id: 2,
        type: 'restaurant',
        title: 'Mikla Restaurant',
        description: 'Modern Türk mutfağı ve şehir manzarası',
        image: '/images/mikla.jpg',
        rating: 4.8,
        reviews: 654,
        location: 'İstanbul',
        cuisine: 'Modern Türk',
        priceLevel: 5,
        keywords: ['modern', 'fine dining', 'manzara', 'şef', 'contemporary', 'beyoğlu']
      }
    ]
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate error (örnek: query 'hata' ise hata fırlat)
      if (query.toLowerCase() === 'hata') {
        throw new Error('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
      }
      const searchTerm = query.toLowerCase();
      const results = [];

      // Search through all data types
      Object.entries(allData).forEach(([category, items]) => {
        items.forEach(item => {
          // Check if search term matches title, description, or keywords
          const matchesTitle = item.title.toLowerCase().includes(searchTerm);
          const matchesDescription = item.description.toLowerCase().includes(searchTerm);
          const matchesKeywords = item.keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm)
          );
          const matchesLocation = item.location.toLowerCase().includes(searchTerm);

          if (matchesTitle || matchesDescription || matchesKeywords || matchesLocation) {
            results.push({
              ...item,
              relevanceScore: matchesTitle ? 3 : matchesDescription ? 2 : 1
            });
          }
        });
      });

      // Sort by relevance initially
      results.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      setFilteredResults(results);
    } catch (err) {
      setError(err.message || 'Bir hata oluştu, lütfen tekrar deneyin.');
      setFilteredResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  const filterResults = (type) => {
    setActiveFilter(type);
    if (type === 'all') {
      return;
    }
    
    const filtered = filteredResults.filter(item => item.type === type);
    setFilteredResults(filtered);
  };

  const sortResults = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredResults].sort((a, b) => {
      switch (sortType) {
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'price':
          return (a.price || 0) - (b.price || 0);
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });
    setFilteredResults(sorted);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'destination':
        return <MapPin className="w-5 h-5 text-blue-400" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-purple-400" />;
      case 'accommodation':
        return <Bed className="w-5 h-5 text-green-400" />;
      case 'restaurant':
        return <Utensils className="w-5 h-5 text-orange-400" />;
      default:
        return <Search className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'destination':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'event':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'accommodation':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'restaurant':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'destination':
        return 'Gezilecek Yer';
      case 'event':
        return 'Etkinlik';
      case 'accommodation':
        return 'Konaklama';
      case 'restaurant':
        return 'Restoran';
      default:
        return type;
    }
  };

  const getItemUrl = (item) => {
    switch (item.type) {
      case 'destination':
        return `/destinations/${item.id}`;
      case 'event':
        return `/events/${item.id}`;
      case 'accommodation':
        return `/accommodations/${item.id}`;
      case 'restaurant':
        return `/restaurants/${item.id}`;
      default:
        return '#';
    }
  };

  return (
    <>
      <Helmet>
        <title>Arama Sonuçları | Turist Rehberi</title>
        <meta name="description" content="Turist Rehberi'nde aradığınız destinasyon, etkinlik, restoran ve konaklama sonuçlarını keşfedin." />
        <meta property="og:title" content="Arama Sonuçları | Turist Rehberi" />
        <meta property="og:description" content="Turist Rehberi'nde aradığınız destinasyon, etkinlik, restoran ve konaklama sonuçlarını keşfedin." />
        <meta property="og:image" content="/icons/icon-512.png" />
        <meta property="og:url" content="https://turistrehberi.com/search" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Arama Sonuçları | Turist Rehberi" />
        <meta name="twitter:description" content="Turist Rehberi'nde aradığınız destinasyon, etkinlik, restoran ve konaklama sonuçlarını keşfedin." />
        <meta name="twitter:image" content="/icons/icon-512.png" />
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Arama Sonuçları
              </h1>
              <p className="text-xl text-gray-300">
                "{searchParams.get('q')}" için sonuçlar
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleNewSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Yeni arama yapın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-12 pr-12 text-lg text-gray-300 bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-300"
                  aria-label="Arama"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  Ara
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          {isLoading && <LoadingSpinner text="Aranıyor..." />}
          {error && <ErrorCard title="Arama Hatası" message={error} />}
          {!isLoading && !error && (
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
              {/* Filters Sidebar */}
              <div className="w-full lg:w-80 mb-4 lg:mb-0">
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/10 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtreler
                  </h3>

                  {/* Type Filters */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Kategori</h4>
                    <div className="space-y-2">
                      {['all', 'destination', 'event', 'accommodation', 'restaurant'].map((type) => (
                        <button
                          key={type}
                          onClick={() => filterResults(type)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            activeFilter === type
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700/50'
                          }`}
                          aria-label={type === 'all' ? 'Tüm kategoriler' : getTypeName(type)}
                        >
                          <div className="flex items-center gap-2">
                            {type !== 'all' && getTypeIcon(type)}
                            {type === 'all' ? 'Tümü' : getTypeName(type)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Sıralama</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'relevance', label: 'İlgili' },
                        { value: 'rating', label: 'Puan' },
                        { value: 'reviews', label: 'Yorum Sayısı' },
                        { value: 'price', label: 'Fiyat' }
                      ].map((sort) => (
                        <button
                          key={sort.value}
                          onClick={() => sortResults(sort.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            sortBy === sort.value
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700/50'
                          }`}
                          aria-label={sort.label + ' ile sırala'}
                        >
                          {sort.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-300">
                    {filteredResults.length} sonuç bulundu
                  </h2>
                </div>

                {filteredResults.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <Search className="w-16 h-16 sm:w-24 sm:h-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-400 mb-2">Sonuç bulunamadı</h3>
                    <p className="text-gray-500">Lütfen farklı anahtar kelimeler deneyin</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {filteredResults.map((item) => (
                      <div key={`${item.type}-${item.id}`} className="relative group bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
                        {/* Favori butonu */}
                        <button
                          onClick={() => {
                            toggleFavorite(item);
                            toast.success(isFavorite(item) ? 'Favorilerden çıkarıldı' : 'Favorilere eklendi');
                          }}
                          className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-900/70 hover:bg-purple-600 transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          aria-label={isFavorite(item) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                          tabIndex={0}
                        >
                          <Heart className={`w-6 h-6 ${isFavorite(item) ? 'fill-pink-500 text-pink-500' : 'text-gray-400'} transition-all`} aria-hidden="true" />
                        </button>
                        <Link
                          to={getItemUrl(item)}
                          className="block"
                        >
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-4 left-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(item.type)}`}>
                                {getTypeIcon(item.type)}
                                {getTypeName(item.type)}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-gray-400 mb-4 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-white font-medium">{item.rating}</span>
                                <span className="text-gray-500 text-sm">({item.reviews})</span>
                              </div>
                              {item.price && (
                                <div className="text-purple-400 font-bold">
                                  {item.price}₺
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                              <MapPin className="w-4 h-4" />
                              {item.location}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPage; 