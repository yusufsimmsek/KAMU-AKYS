import useFavorites from '../../hooks/useFavorites';
import { Star, Trash2 } from 'lucide-react';

const FavoritesTab = () => {
  const { favorites, removeFavorite } = useFavorites();
  return (
    <div>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 py-12">Henüz favoriniz yok.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favorites.map(item => (
            <div key={item.type + '-' + item.id} className="bg-gray-900/80 rounded-xl p-4 flex flex-col gap-2 shadow border border-white/10 relative">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white text-lg">{item.title}</span>
              </div>
              <div className="flex-1 text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</div>
              <button
                onClick={() => removeFavorite(item)}
                className="absolute top-3 right-3 p-2 rounded-full bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-white transition-all"
                aria-label="Favorilerden çıkar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab; 