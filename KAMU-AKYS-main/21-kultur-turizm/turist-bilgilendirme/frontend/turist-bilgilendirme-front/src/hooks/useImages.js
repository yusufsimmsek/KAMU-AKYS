import { useState, useEffect, useCallback } from 'react';
import imageService from '../services/imageService';

const useImages = (query, category = 'general', count = 1, autoFetch = true) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    if (!query) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const fetchedImages = await imageService.fetchImagesForContent(query, category, count);
      setImages(fetchedImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
      
      // Set fallback images
      const fallbackImages = [];
      for (let i = 0; i < count; i++) {
        const seed = Math.floor(Math.random() * 1000);
        fallbackImages.push({
          url: `https://source.unsplash.com/600x400/?${category || 'turkey'},culture&sig=${seed}`,
          title: `${query} - Görsel ${i + 1}`,
          description: 'Varsayılan görsel',
          source: 'Unsplash',
          license: 'Unsplash License',
          attribution: 'Unsplash',
          isFallback: true
        });
      }
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  }, [query, category, count]);

  useEffect(() => {
    if (autoFetch) {
      fetchImages();
    }
  }, [fetchImages, autoFetch]);

  const getSingleImage = useCallback(async (specificQuery, specificCategory) => {
    const singleImage = await imageService.getSingleImage(
      specificQuery || query, 
      specificCategory || category
    );
    return singleImage;
  }, [query, category]);

  const refreshImages = useCallback(() => {
    fetchImages();
  }, [fetchImages]);

  const clearCache = useCallback(() => {
    imageService.clearCache();
  }, []);

  return {
    images,
    loading,
    error,
    fetchImages,
    getSingleImage,
    refreshImages,
    clearCache
  };
};

export default useImages; 