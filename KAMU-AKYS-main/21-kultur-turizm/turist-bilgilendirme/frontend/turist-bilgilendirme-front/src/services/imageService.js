// Image Service for fetching open-source licensed images
import axios from 'axios';

const IMAGE_CACHE = new Map();
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour

class ImageService {
  constructor() {
    this.apiKeys = {
      europeana: 'apikeyvibeturkey', // Free tier API key
      wikimedia: null, // No API key needed
      smithsonian: null, // No API key needed
      met: null // No API key needed
    };
  }

  // Metropolitan Museum of Art API
  async fetchMetMuseumImages(query, limit = 5) {
    try {
      const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(query)}&hasImages=true`;
      const searchResponse = await axios.get(searchUrl);
      
      if (!searchResponse.data.objectIDs || searchResponse.data.objectIDs.length === 0) {
        return [];
      }

      const objectIds = searchResponse.data.objectIDs.slice(0, limit);
      const imagePromises = objectIds.map(async (id) => {
        try {
          const objectResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
          const obj = objectResponse.data;
          
          if (obj.primaryImageSmall) {
            return {
              url: obj.primaryImageSmall,
              title: obj.title || 'Untitled',
              description: obj.artistDisplayName || 'Unknown Artist',
              source: 'Metropolitan Museum of Art',
              license: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
              attribution: `Metropolitan Museum of Art, New York`
            };
          }
          return null;
        } catch (error) {
          console.warn(`Failed to fetch MET object ${id}:`, error);
          return null;
        }
      });

      const images = await Promise.all(imagePromises);
      return images.filter(img => img !== null);
    } catch (error) {
      console.error('MET Museum API error:', error);
      return [];
    }
  }

  // Europeana API
  async fetchEuropeanaImages(query, limit = 5) {
    try {
      const apiUrl = `https://api.europeana.eu/record/v2/search.json?wskey=${this.apiKeys.europeana}&query=${encodeURIComponent(query)}&media=true&thumbnail=true&rows=${limit}`;
      const response = await axios.get(apiUrl);
      
      if (!response.data.items || response.data.items.length === 0) {
        return [];
      }

      return response.data.items.map(item => ({
        url: item.edmPreview?.[0] || item.edmIsShownBy?.[0],
        title: item.title?.[0] || 'Untitled',
        description: item.dcCreator?.[0] || 'Unknown Creator',
        source: 'Europeana',
        license: item.rights?.[0] || 'Rights information not available',
        attribution: `Europeana - ${item.dataProvider?.[0] || 'Unknown Provider'}`
      })).filter(img => img.url);
    } catch (error) {
      console.error('Europeana API error:', error);
      return [];
    }
  }

  // Smithsonian API
  async fetchSmithsonianImages(query, limit = 5) {
    try {
      const apiUrl = `https://api.si.edu/openaccess/api/v1.0/search?q=${encodeURIComponent(query)}&api_key=DEMO_KEY&rows=${limit}&media.usage=CC0`;
      const response = await axios.get(apiUrl);
      
      if (!response.data.response?.rows || response.data.response.rows.length === 0) {
        return [];
      }

      return response.data.response.rows.map(item => {
        const content = item.content;
        const media = content.descriptiveNonRepeating?.online_media?.media;
        
        if (media && media.length > 0) {
          const image = media.find(m => m.type === 'Images');
          if (image) {
            return {
              url: image.content || image.thumbnail,
              title: content.freetext?.name?.[0]?.content || 'Untitled',
              description: content.freetext?.physicalDescription?.[0]?.content || 'Smithsonian Collection',
              source: 'Smithsonian Institution',
              license: 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication',
              attribution: `Smithsonian Institution`
            };
          }
        }
        return null;
      }).filter(img => img !== null);
    } catch (error) {
      console.error('Smithsonian API error:', error);
      return [];
    }
  }

  // Wikimedia Commons API
  async fetchWikimediaImages(query, limit = 5) {
    try {
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=600`;
      const response = await axios.get(apiUrl);
      
      if (!response.data.query?.pages) {
        return [];
      }

      const pages = Object.values(response.data.query.pages);
      return pages.map(page => {
        const imageInfo = page.imageinfo?.[0];
        if (imageInfo && imageInfo.thumburl) {
          return {
            url: imageInfo.thumburl,
            title: page.title.replace('File:', ''),
            description: 'Wikimedia Commons',
            source: 'Wikimedia Commons',
            license: 'Creative Commons or Public Domain',
            attribution: 'Wikimedia Commons'
          };
        }
        return null;
      }).filter(img => img !== null);
    } catch (error) {
      console.error('Wikimedia Commons API error:', error);
      return [];
    }
  }

  // Main function to fetch images from all sources
  async fetchImagesForContent(query, category = 'general', limit = 10) {
    const cacheKey = `${query}-${category}-${limit}`;
    
    // Check cache first
    if (IMAGE_CACHE.has(cacheKey)) {
      const cached = IMAGE_CACHE.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_EXPIRY) {
        return cached.data;
      }
    }

    // Enhance query based on category
    const enhancedQuery = this.enhanceQueryForCategory(query, category);
    
    try {
      // Fetch from all sources in parallel
      const [metImages, europeanaImages, smithsonianImages, wikimediaImages] = await Promise.all([
        this.fetchMetMuseumImages(enhancedQuery, Math.ceil(limit / 4)),
        this.fetchEuropeanaImages(enhancedQuery, Math.ceil(limit / 4)),
        this.fetchSmithsonianImages(enhancedQuery, Math.ceil(limit / 4)),
        this.fetchWikimediaImages(enhancedQuery, Math.ceil(limit / 4))
      ]);

      // Combine and shuffle results
      const allImages = [...metImages, ...europeanaImages, ...smithsonianImages, ...wikimediaImages];
      const shuffledImages = this.shuffleArray(allImages).slice(0, limit);

      // Add fallback images if needed
      const finalImages = await this.addFallbackImages(shuffledImages, query, category, limit);

      // Cache the results
      IMAGE_CACHE.set(cacheKey, {
        data: finalImages,
        timestamp: Date.now()
      });

      return finalImages;
    } catch (error) {
      console.error('Error fetching images:', error);
      return this.getFallbackImages(query, category, limit);
    }
  }

  // Enhance query based on content category
  enhanceQueryForCategory(query, category) {
    const categoryEnhancements = {
      'museum': `${query} museum artifact culture`,
      'culture': `${query} cultural heritage tradition`,
      'nature': `${query} landscape natural scenery`,
      'architecture': `${query} building architecture monument`,
      'art': `${query} artwork painting sculpture`,
      'history': `${query} historical ancient heritage`,
      'tourism': `${query} tourist attraction travel`,
      'event': `${query} festival celebration event`,
      'food': `${query} cuisine traditional food`,
      'general': query
    };

    return categoryEnhancements[category] || query;
  }

  // Add fallback images using Unsplash Source
  async addFallbackImages(existingImages, query, category, targetCount) {
    if (existingImages.length >= targetCount) {
      return existingImages;
    }

    const needed = targetCount - existingImages.length;
    const fallbackImages = [];

    // Generate Unsplash fallback images
    for (let i = 0; i < needed; i++) {
      const fallbackCategories = {
        'museum': 'museum,art,culture',
        'culture': 'culture,heritage,traditional',
        'nature': 'landscape,nature,scenery',
        'architecture': 'architecture,building,monument',
        'art': 'art,painting,sculpture',
        'history': 'history,ancient,heritage',
        'tourism': 'travel,tourist,attraction',
        'event': 'festival,celebration,event',
        'food': 'food,cuisine,traditional',
        'general': 'turkey,istanbul,culture'
      };

      const unsplashQuery = fallbackCategories[category] || 'turkey,culture';
      const seed = Math.floor(Math.random() * 1000);
      
      fallbackImages.push({
        url: `https://source.unsplash.com/600x400/?${unsplashQuery}&sig=${seed}`,
        title: `${query} - Görsel ${i + 1}`,
        description: 'Unsplash kaynaklı görsel',
        source: 'Unsplash',
        license: 'Unsplash License',
        attribution: 'Unsplash',
        isFallback: true
      });
    }

    return [...existingImages, ...fallbackImages];
  }

  // Get pure fallback images when APIs fail
  getFallbackImages(query, category, count) {
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

    return fallbackImages;
  }

  // Utility function to shuffle array
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get a single image for a specific content
  async getSingleImage(query, category = 'general') {
    const images = await this.fetchImagesForContent(query, category, 1);
    return images[0] || null;
  }

  // Clear cache
  clearCache() {
    IMAGE_CACHE.clear();
  }

  // Preload images for better performance
  async preloadImages(imageUrls) {
    const promises = imageUrls.map(url => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    });

    return Promise.all(promises);
  }
}

export default new ImageService(); 