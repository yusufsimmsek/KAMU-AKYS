import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, MapPin, Calendar, Home, Utensils, Bed, Search, Settings } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navigationItems = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/destinations', label: 'Gezi', icon: MapPin },
    { path: '/events', label: 'Etkinlikler', icon: Calendar },
    { path: '/accommodations', label: 'Konaklama', icon: Bed },
    { path: '/restaurants', label: 'Restoranlar', icon: Utensils },
  ];

  return (
    <nav className="bg-gray-900/90 backdrop-blur-lg shadow-2xl border-b border-white border-opacity-10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 group-hover:scale-105 transition-all duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Turist Rehberi
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                    isActive(item.path)
                      ? 'text-purple-400 bg-white bg-opacity-5 backdrop-blur-lg border border-white border-opacity-10 shadow-lg'
                      : 'text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 hover:backdrop-blur-lg'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 ${
                    isActive(item.path) ? 'text-purple-400' : 'group-hover:text-purple-400'
                  }`} />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="hidden md:flex items-center mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-72 h-12 px-5 py-3 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-300 shadow-sm"
                  style={{ minWidth: '220px', maxWidth: '340px' }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center ml-2">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full shadow-lg text-white hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-purple-400"
                  aria-label="Profil menüsünü aç"
                >
                  <User className="w-5 h-5" aria-hidden="true" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-white border-opacity-10 py-2 z-50 animate-slide-down">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profil</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 transition-all duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Paneli</span>
                      </Link>
                    )}
                    <hr className="my-1 border-white border-opacity-10" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-10 transition-all duration-200"
                      aria-label="Çıkış yap"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-purple-400 rounded-xl hover:bg-white hover:bg-opacity-5 hover:backdrop-blur-lg transition-all duration-300"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 transition-all duration-300"
              aria-label="Arama kutusunu aç"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 transition-all duration-300"
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-lg flex flex-col justify-start items-center p-4 animate-fade-in">
            <form onSubmit={handleSearch} className="w-full max-w-md mt-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 px-5 py-3 pl-12 pr-4 text-base text-gray-300 bg-gray-800/80 backdrop-blur-lg border border-white border-opacity-10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 transition-all duration-300 shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white transition-all"
                  aria-label="Kapat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg flex flex-col justify-start items-center p-4 animate-fade-in">
          <div className="w-full max-w-md mt-8">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                    className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 w-full text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5"
                  onClick={() => setIsOpen(false)}
                >
                    <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          {/* Mobile Auth */}
          <div className="pt-4 pb-3 border-t border-white border-opacity-10">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <Link
                  to="/profile"
                    className="flex items-center space-x-3 px-5 py-4 rounded-2xl text-lg font-medium text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                    <User className="w-5 h-5" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                    className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-lg font-medium text-red-400 hover:text-red-300 hover:bg-red-500 hover:bg-opacity-10 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                    className="block px-5 py-4 rounded-2xl text-lg font-medium text-gray-300 hover:text-purple-400 hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                    className="block px-5 py-4 rounded-2xl text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white transition-all"
            aria-label="Kapat"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 