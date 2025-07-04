import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, X, User, LogOut, MapPin, Calendar, Home, Utensils, Bed } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  const navigationItems = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/destinations', label: 'Destinasyonlar', icon: MapPin },
    { path: '/events', label: 'Etkinlikler', icon: Calendar },
    { path: '/accommodations', label: 'Konaklama', icon: Bed },
    { path: '/restaurants', label: 'Restoranlar', icon: Utensils },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
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
                      ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-accent-50 shadow-sm'
                      : 'text-dark-600 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 ${
                    isActive(item.path) ? 'text-primary-500' : 'group-hover:text-primary-500'
                  }`} />
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-dark-600 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-300 border border-transparent hover:border-primary-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.firstName || user?.email}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-primary-100 py-2 z-50 animate-slide-down">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-dark-600 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profil</span>
                    </Link>
                    <hr className="my-1 border-primary-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-error-500 hover:text-error-600 hover:bg-error-50 transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-dark-600 hover:text-primary-600 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-300"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile Auth */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="px-2 space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
                  onClick={() => setIsOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 