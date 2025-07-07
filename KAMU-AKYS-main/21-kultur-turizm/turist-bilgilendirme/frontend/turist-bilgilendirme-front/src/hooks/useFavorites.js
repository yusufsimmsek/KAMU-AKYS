import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'favorites';

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (item) => favorites.some(fav => fav.type === item.type && fav.id === item.id);

  const addFavorite = (item) => {
    if (!isFavorite(item)) setFavorites([...favorites, item]);
  };

  const removeFavorite = (item) => {
    setFavorites(favorites.filter(fav => !(fav.type === item.type && fav.id === item.id)));
  };

  const toggleFavorite = (item) => {
    isFavorite(item) ? removeFavorite(item) : addFavorite(item);
  };

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
} 