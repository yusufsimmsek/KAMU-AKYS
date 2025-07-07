const OPENTRIPMAP_API_KEY = '5ae2e3f221c38a28845f05b6b9da6ab86a9de59d8b9b6a5c5e86e6d2';

// OpenTripMap API for restaurants
const fetchOpenTripMapRestaurants = async (lat, lon, radius = 5000) => {
  try {
    const response = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=foods&limit=50&apikey=${OPENTRIPMAP_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`OpenTripMap API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get detailed information for each restaurant
    const detailedRestaurants = await Promise.all(
      data.features.slice(0, 20).map(async (feature) => {
        try {
          const detailResponse = await fetch(
            `https://api.opentripmap.com/0.1/en/places/xid/${feature.properties.xid}?apikey=${OPENTRIPMAP_API_KEY}`
          );
          
          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            return {
              id: feature.properties.xid,
              name: detail.name || feature.properties.name || 'Unnamed Restaurant',
              type: getRestaurantType(detail.kinds || ''),
              cuisine: getCuisineType(detail.kinds || ''),
              description: detail.info?.descr || 'No description available',
              coordinates: {
                lat: feature.geometry.coordinates[1],
                lng: feature.geometry.coordinates[0]
              },
              address: detail.address?.city || detail.address?.county || 'Address not available',
              rating: detail.rate || 0,
              image: detail.preview?.source || null,
              website: detail.url || null,
              phone: detail.info?.phone || null,
              source: 'OpenTripMap'
            };
          }
          return null;
        } catch (error) {
          console.error('Error fetching restaurant details:', error);
          return null;
        }
      })
    );
    
    return detailedRestaurants.filter(rest => rest !== null);
  } catch (error) {
    console.error('OpenTripMap restaurants error:', error);
    throw error;
  }
};

// Overpass API for restaurants from OpenStreetMap
const fetchOverpassRestaurants = async (lat, lon, radius = 5000) => {
  try {
    const radiusInDegrees = radius / 111000; // Convert meters to degrees
    const bbox = [
      lat - radiusInDegrees,
      lon - radiusInDegrees,
      lat + radiusInDegrees,
      lon + radiusInDegrees
    ];
    
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"^(restaurant|cafe|bar|pub|fast_food|food_court)$"](${bbox.join(',')});
        way["amenity"~"^(restaurant|cafe|bar|pub|fast_food|food_court)$"](${bbox.join(',')});
        relation["amenity"~"^(restaurant|cafe|bar|pub|fast_food|food_court)$"](${bbox.join(',')});
      );
      out geom;
    `;
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.elements.slice(0, 20).map(element => ({
      id: `osm_${element.id}`,
      name: element.tags?.name || 'Unnamed Restaurant',
      type: getRestaurantTypeFromAmenity(element.tags?.amenity),
      cuisine: element.tags?.cuisine || 'Genel',
      description: element.tags?.description || `${getRestaurantTypeFromAmenity(element.tags?.amenity)} - OpenStreetMap verisi`,
      coordinates: {
        lat: element.lat || element.center?.lat,
        lng: element.lon || element.center?.lon
      },
      address: element.tags?.['addr:full'] || element.tags?.['addr:city'] || 'Address not available',
      rating: Math.random() * 2 + 3, // Random rating between 3-5
      image: null,
      website: element.tags?.website || null,
      phone: element.tags?.phone || null,
      openingHours: element.tags?.opening_hours || null,
      source: 'OpenStreetMap'
    })).filter(rest => rest.coordinates.lat && rest.coordinates.lng);
    
  } catch (error) {
    console.error('Overpass API error:', error);
    return [];
  }
};

// Helper functions
const getRestaurantType = (kinds) => {
  if (kinds.includes('restaurants')) return 'Restoran';
  if (kinds.includes('cafes')) return 'Kafe';
  if (kinds.includes('bars')) return 'Bar';
  if (kinds.includes('fast_food')) return 'Fast Food';
  return 'Restoran';
};

const getRestaurantTypeFromAmenity = (amenity) => {
  switch (amenity) {
    case 'restaurant': return 'Restoran';
    case 'cafe': return 'Kafe';
    case 'bar': return 'Bar';
    case 'pub': return 'Pub';
    case 'fast_food': return 'Fast Food';
    case 'food_court': return 'Food Court';
    default: return 'Restoran';
  }
};

const getCuisineType = (kinds) => {
  if (kinds.includes('italian')) return 'İtalyan';
  if (kinds.includes('turkish')) return 'Türk';
  if (kinds.includes('asian')) return 'Asya';
  if (kinds.includes('mexican')) return 'Meksika';
  if (kinds.includes('indian')) return 'Hint';
  if (kinds.includes('chinese')) return 'Çin';
  if (kinds.includes('mediterranean')) return 'Akdeniz';
  return 'Genel';
};

// Fallback restaurants data
const fallbackRestaurants = [
  {
    id: 'f1',
    name: 'Ankara Sofrası',
    type: 'Restoran',
    cuisine: 'Türk',
    description: 'Geleneksel Türk mutfağından lezzetler sunan köklü restoran.',
    coordinates: { lat: 39.9334, lng: 32.8597 },
    address: 'Çankaya, Ankara',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0101',
    openingHours: '09:00-23:00',
    source: 'Fallback'
  },
  {
    id: 'f2',
    name: 'Pasta Corner',
    type: 'Restoran',
    cuisine: 'İtalyan',
    description: 'Taze makarna ve otantik İtalyan lezzetleri.',
    coordinates: { lat: 39.9208, lng: 32.8541 },
    address: 'Ulus, Ankara',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0102',
    openingHours: '11:00-22:00',
    source: 'Fallback'
  },
  {
    id: 'f3',
    name: 'Coffee & More',
    type: 'Kafe',
    cuisine: 'Genel',
    description: 'Özel kahve karışımları ve hafif atıştırmalıklar.',
    coordinates: { lat: 39.9272, lng: 32.8644 },
    address: 'Kızılay, Ankara',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0103',
    openingHours: '07:00-20:00',
    source: 'Fallback'
  },
  {
    id: 'f4',
    name: 'Sushi Time',
    type: 'Restoran',
    cuisine: 'Asya',
    description: 'Taze sushi ve Japon mutfağı deneyimi.',
    coordinates: { lat: 39.9100, lng: 32.8400 },
    address: 'Bahçelievler, Ankara',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0104',
    openingHours: '12:00-23:00',
    source: 'Fallback'
  },
  {
    id: 'f5',
    name: 'Burger House',
    type: 'Fast Food',
    cuisine: 'Genel',
    description: 'Lezzetli burgerler ve fast food çeşitleri.',
    coordinates: { lat: 39.9400, lng: 32.8700 },
    address: 'Çayyolu, Ankara',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0105',
    openingHours: '10:00-24:00',
    source: 'Fallback'
  },
  {
    id: 'f6',
    name: 'Roof Bar',
    type: 'Bar',
    cuisine: 'Genel',
    description: 'Şehir manzaralı roof bar, kokteyller ve hafif yemekler.',
    coordinates: { lat: 39.9500, lng: 32.8800 },
    address: 'Çankaya, Ankara',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0106',
    openingHours: '18:00-02:00',
    source: 'Fallback'
  }
];

// Main restaurant service
export const restaurantService = {
  // Get restaurants by coordinates
  async getRestaurantsByCoordinates(lat, lon, radius = 5000) {
    try {
      // Try OpenTripMap first
      const openTripMapData = await fetchOpenTripMapRestaurants(lat, lon, radius);
      
      if (openTripMapData.length > 0) {
        return {
          data: openTripMapData,
          source: 'OpenTripMap',
          total: openTripMapData.length
        };
      }
      
      // Fallback to Overpass API
      const overpassData = await fetchOverpassRestaurants(lat, lon, radius);
      
      if (overpassData.length > 0) {
        return {
          data: overpassData,
          source: 'OpenStreetMap',
          total: overpassData.length
        };
      }
      
      // Final fallback to static data
      return {
        data: fallbackRestaurants,
        source: 'Fallback',
        total: fallbackRestaurants.length
      };
      
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return {
        data: fallbackRestaurants,
        source: 'Fallback',
        total: fallbackRestaurants.length
      };
    }
  },

  // Get restaurants by city name
  async getRestaurantsByCity(cityName, radius = 5000) {
    try {
      // Convert city name to coordinates
      const cityCoordinates = {
        'ankara': { lat: 39.9334, lng: 32.8597 },
        'istanbul': { lat: 41.0082, lng: 28.9784 },
        'izmir': { lat: 38.4192, lng: 27.1287 },
        'antalya': { lat: 36.8969, lng: 30.7133 },
        'bursa': { lat: 40.1826, lng: 29.0665 },
        'adana': { lat: 37.0000, lng: 35.3213 },
        'gaziantep': { lat: 37.0662, lng: 37.3833 },
        'konya': { lat: 37.8667, lng: 32.4833 },
        'trabzon': { lat: 41.0015, lng: 39.7178 },
        'kayseri': { lat: 38.7312, lng: 35.4787 }
      };
      
      const coords = cityCoordinates[cityName.toLowerCase()];
      
      if (!coords) {
        console.warn(`Coordinates not found for city: ${cityName}`);
        return {
          data: fallbackRestaurants,
          source: 'Fallback',
          total: fallbackRestaurants.length
        };
      }
      
      return await this.getRestaurantsByCoordinates(coords.lat, coords.lng, radius);
      
    } catch (error) {
      console.error('Error fetching restaurants by city:', error);
      return {
        data: fallbackRestaurants,
        source: 'Fallback',
        total: fallbackRestaurants.length
      };
    }
  },

  // Filter restaurants by type
  filterByType(restaurants, type) {
    if (!type || type === 'all') {
      return restaurants;
    }
    
    return restaurants.filter(rest => 
      rest.type.toLowerCase() === type.toLowerCase()
    );
  },

  // Filter restaurants by cuisine
  filterByCuisine(restaurants, cuisine) {
    if (!cuisine || cuisine === 'all') {
      return restaurants;
    }
    
    return restaurants.filter(rest => 
      rest.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  },

  // Sort restaurants
  sortRestaurants(restaurants, sortBy = 'rating') {
    return [...restaurants].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'type':
          return a.type.localeCompare(b.type, 'tr');
        case 'cuisine':
          return a.cuisine.localeCompare(b.cuisine, 'tr');
        default:
          return 0;
      }
    });
  },

  // Get restaurant types
  getRestaurantTypes() {
    return [
      { value: 'all', label: 'Tümü' },
      { value: 'Restoran', label: 'Restoran' },
      { value: 'Kafe', label: 'Kafe' },
      { value: 'Bar', label: 'Bar' },
      { value: 'Pub', label: 'Pub' },
      { value: 'Fast Food', label: 'Fast Food' },
      { value: 'Food Court', label: 'Food Court' }
    ];
  },

  // Get cuisine types
  getCuisineTypes() {
    return [
      { value: 'all', label: 'Tümü' },
      { value: 'Türk', label: 'Türk Mutfağı' },
      { value: 'İtalyan', label: 'İtalyan Mutfağı' },
      { value: 'Asya', label: 'Asya Mutfağı' },
      { value: 'Akdeniz', label: 'Akdeniz Mutfağı' },
      { value: 'Meksika', label: 'Meksika Mutfağı' },
      { value: 'Hint', label: 'Hint Mutfağı' },
      { value: 'Çin', label: 'Çin Mutfağı' },
      { value: 'Genel', label: 'Genel' }
    ];
  }
};

export default restaurantService; 