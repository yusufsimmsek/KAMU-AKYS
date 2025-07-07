import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Globe,
  Heart,
  Star,
  Calendar,
  Camera,
  Shield,
  Award,
  Users
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-glass footer-background-pattern text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 footer-container">
        {/* Newsletter Section */}
        <div className="border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">
                <span className="footer-title">
                  En Son Haberler
                </span>
              </h3>
              <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                Türkiye'deki en yeni gezilecek yerler, etkinlikler ve turizm haberleri hakkında bilgi alın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto footer-newsletter-container">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 footer-newsletter-input rounded-xl text-white placeholder-gray-400 transition duration-300"
                />
                <button className="footer-newsletter-button footer-interactive text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center footer-interactive">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold footer-title">Türkiye</h2>
                  <p className="text-green-400 text-sm">Travel Guide</p>
                </div>
              </div>
              
              <p className="text-gray-400 leading-relaxed">
                Türkiye'nin en güzel yerlerini keşfedin. Binlerce yıllık tarihi, eşsiz doğası ve 
                zengin kültürüyle Türkiye'yi tanıyın.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 footer-stats">
                <div className="footer-card footer-stat rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">500+</div>
                  <div className="text-xs text-gray-400">Gezilecek Yer</div>
                </div>
                <div className="footer-card footer-stat rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">50K+</div>
                  <div className="text-xs text-gray-400">Mutlu Ziyaretçi</div>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 footer-social-links">
                <a href="https://facebook.com/kulturturizm" target="_blank" rel="noopener noreferrer" 
                   className="footer-social-link footer-interactive w-10 h-10 footer-card rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com/kulturturizm" target="_blank" rel="noopener noreferrer"
                   className="footer-social-link footer-interactive w-10 h-10 footer-card rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-sky-500 transition-all duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/kulturturizm" target="_blank" rel="noopener noreferrer"
                   className="footer-social-link footer-interactive w-10 h-10 footer-card rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-pink-500 transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/kulturturizm" target="_blank" rel="noopener noreferrer"
                   className="footer-social-link footer-interactive w-10 h-10 footer-card rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-600 transition-all duration-300">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-400" />
                Keşfet
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/destinations" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <MapPin className="w-4 h-4 mr-2 group-hover:text-green-400 transition-colors" />
                    Gezilecek Yerler
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Calendar className="w-4 h-4 mr-2 group-hover:text-blue-400 transition-colors" />
                    Etkinlikler
                  </Link>
                </li>
                <li>
                  <Link to="/accommodations" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Heart className="w-4 h-4 mr-2 group-hover:text-pink-400 transition-colors" />
                    Konaklama
                  </Link>
                </li>
                <li>
                  <Link to="/restaurants" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Award className="w-4 h-4 mr-2 group-hover:text-orange-400 transition-colors" />
                    Restoranlar
                  </Link>
                </li>
                <li>
                  <Link to="/image-demo" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Camera className="w-4 h-4 mr-2 group-hover:text-purple-400 transition-colors" />
                    Galeri
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                Destek
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Globe className="w-4 h-4 mr-2 group-hover:text-green-400 transition-colors" />
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Mail className="w-4 h-4 mr-2 group-hover:text-blue-400 transition-colors" />
                    İletişim
                  </Link>
                </li>
                <li>
                  <a href="#" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Shield className="w-4 h-4 mr-2 group-hover:text-yellow-400 transition-colors" />
                    Gizlilik Politikası
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Award className="w-4 h-4 mr-2 group-hover:text-purple-400 transition-colors" />
                    Kullanım Şartları
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link text-gray-400 hover:text-white transition-colors flex items-center group">
                    <Users className="w-4 h-4 mr-2 group-hover:text-pink-400 transition-colors" />
                    SSS
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center">
                <Phone className="w-5 h-5 mr-2 text-green-400" />
                İletişim
              </h3>
              
              <div className="space-y-4 footer-contact-cards">
                <div className="footer-card rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-white">Adres</div>
                      <div className="text-gray-400 text-sm">
                        T.C. Kültür ve Turizm Bakanlığı<br />
                        İsmet İnönü Bulvarı No:32<br />
                        Emek, Ankara
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-card rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-white">Telefon</div>
                      <div className="text-gray-400 text-sm">+90 (312) 470 80 00</div>
                    </div>
                  </div>
                </div>

                <div className="footer-card rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-sm text-white">E-posta</div>
                      <div className="text-gray-400 text-sm">bilgi@ktb.gov.tr</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Info */}
              <div className="footer-emergency rounded-xl p-4">
                <div className="text-center">
                  <div className="text-red-400 font-semibold text-sm mb-1">Acil Durumlar</div>
                  <div className="text-white font-bold">155 (Polis)</div>
                  <div className="text-white font-bold">112 (Ambulans)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Türkiye Travel Guide. Tüm hakları saklıdır.
                </p>
                <div className="hidden md:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full footer-online-indicator"></div>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <p className="text-gray-400 text-sm">
                  T.C. Kültür ve Turizm Bakanlığı
                </p>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500 footer-love-icon" />
                  <span className="text-xs text-gray-500">Made with love in Turkey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 