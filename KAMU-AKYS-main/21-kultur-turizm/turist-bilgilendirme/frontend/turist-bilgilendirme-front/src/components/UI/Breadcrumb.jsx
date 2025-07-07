import { Link, useLocation, matchPath } from 'react-router-dom';
import { Home } from 'lucide-react';

const routeMap = {
  '/': 'Ana Sayfa',
  '/destinations': 'Gezi',
  '/events': 'Etkinlikler',
  '/accommodations': 'Konaklama',
  '/restaurants': 'Restoranlar',
  '/profile': 'Profil',
  '/login': 'Giriş',
  '/register': 'Kayıt',
};

const Breadcrumb = () => {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  let pathAcc = '';

  return (
    <nav className="flex items-center text-sm text-gray-400 py-2 px-2 sm:px-0" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2">
        <li>
          <Link to="/" className="flex items-center gap-1 hover:text-purple-400">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Ana Sayfa</span>
          </Link>
        </li>
        {paths.map((segment, idx) => {
          pathAcc += '/' + segment;
          const isLast = idx === paths.length - 1;
          const label = routeMap[pathAcc] || segment.charAt(0).toUpperCase() + segment.slice(1);
          return (
            <li key={pathAcc} className="flex items-center">
              <span className="mx-1">/</span>
              {isLast ? (
                <span className="text-purple-400 font-semibold truncate max-w-[100px] sm:max-w-none">{label}</span>
              ) : (
                <Link to={pathAcc} className="hover:text-purple-400 truncate max-w-[100px] sm:max-w-none">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 