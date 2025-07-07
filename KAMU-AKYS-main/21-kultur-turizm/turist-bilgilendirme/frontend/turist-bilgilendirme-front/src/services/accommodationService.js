const OPENTRIPMAP_API_KEY = '5ae2e3f221c38a28845f05b6b9da6ab86a9de59d8b9b6a5c5e86e6d2';

// OpenTripMap API for accommodations
const fetchOpenTripMapAccommodations = async (lat, lon, radius = 5000) => {
  try {
    const response = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=accomodations&limit=50&apikey=${OPENTRIPMAP_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`OpenTripMap API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get detailed information for each accommodation
    const detailedAccommodations = await Promise.all(
      data.features.slice(0, 20).map(async (feature) => {
        try {
          const detailResponse = await fetch(
            `https://api.opentripmap.com/0.1/en/places/xid/${feature.properties.xid}?apikey=${OPENTRIPMAP_API_KEY}`
          );
          
          if (detailResponse.ok) {
            const detail = await detailResponse.json();
            return {
              id: feature.properties.xid,
              name: detail.name || feature.properties.name || 'Unnamed Accommodation',
              type: getAccommodationType(detail.kinds || ''),
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
          console.error('Error fetching accommodation details:', error);
          return null;
        }
      })
    );
    
    return detailedAccommodations.filter(acc => acc !== null);
  } catch (error) {
    console.error('OpenTripMap accommodations error:', error);
    throw error;
  }
};

// Helper function to determine accommodation type
const getAccommodationType = (kinds) => {
  if (kinds.includes('hotels')) return 'Otel';
  if (kinds.includes('hostels')) return 'Hostel';
  if (kinds.includes('campsites')) return 'Kamp Alanı';
  if (kinds.includes('guest_houses')) return 'Pansiyon';
  if (kinds.includes('resorts')) return 'Tatil Köyü';
  if (kinds.includes('motels')) return 'Motel';
  return 'Konaklama';
};

// Google Places API fallback for accommodations
const fetchGooglePlacesAccommodations = async (lat, lon, radius = 5000) => {
  try {
    // Note: This would require a Google Places API key and proper CORS setup
    // For now, we'll return empty array as fallback
    console.log('Google Places API not configured');
    return [];
  } catch (error) {
    console.error('Google Places API error:', error);
    return [];
  }
};

// Fallback accommodations data
const fallbackAccommodations = [
  {
    id: 'f1',
    name: 'Ankara Grand Hotel',
    type: 'Otel',
    description: 'Şehir merkezinde konforlu konaklama imkanı sunan modern otel.',
    coordinates: { lat: 39.9334, lng: 32.8597 },
    address: 'Çankaya, Ankara',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0001',
    source: 'Fallback'
  },
  {
    id: 'f2',
    name: 'Kızılcahamam Kamp Alanı',
    type: 'Kamp Alanı',
    description: 'Doğa ile iç içe kamp yapma imkanı sunan güzel bir alan.',
    coordinates: { lat: 40.4690, lng: 32.6506 },
    address: 'Kızılcahamam, Ankara',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0002',
    source: 'Fallback'
  },
  {
    id: 'f3',
    name: 'Beypazarı Konuk Evi',
    type: 'Pansiyon',
    description: 'Tarihi Beypazarı evlerinde otantik konaklama deneyimi.',
    coordinates: { lat: 40.1673, lng: 31.9219 },
    address: 'Beypazarı, Ankara',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0003',
    source: 'Fallback'
  },
  {
    id: 'f4',
    name: 'Ankara Business Hotel',
    type: 'Otel',
    description: 'İş seyahatleriniz için ideal konumda modern otel.',
    coordinates: { lat: 39.9272, lng: 32.8644 },
    address: 'Kızılay, Ankara',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0004',
    source: 'Fallback'
  },
  {
    id: 'f5',
    name: 'Gölbaşı Tatil Köyü',
    type: 'Tatil Köyü',
    description: 'Gölbaşı kenarında huzurlu tatil imkanı sunan tesis.',
    coordinates: { lat: 39.7900, lng: 32.8036 },
    address: 'Gölbaşı, Ankara',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0005',
    source: 'Fallback'
  },
  {
    id: 'f6',
    name: 'Ankara Hostel',
    type: 'Hostel',
    description: 'Genç gezginler için uygun fiyatlı konaklama seçeneği.',
    coordinates: { lat: 39.9208, lng: 32.8541 },
    address: 'Ulus, Ankara',
    rating: 3.8,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    website: null,
    phone: '+90 312 555 0006',
    source: 'Fallback'
  }
];

// Main accommodation service
export const accommodationService = {
  // Get accommodations by coordinates
  async getAccommodationsByCoordinates(lat, lon, radius = 5000) {
    try {
      // Try OpenTripMap first
      const openTripMapData = await fetchOpenTripMapAccommodations(lat, lon, radius);
      
      if (openTripMapData.length > 0) {
        return {
          data: openTripMapData,
          source: 'OpenTripMap',
          total: openTripMapData.length
        };
      }
      
      // Fallback to Google Places API
      const googlePlacesData = await fetchGooglePlacesAccommodations(lat, lon, radius);
      
      if (googlePlacesData.length > 0) {
        return {
          data: googlePlacesData,
          source: 'Google Places',
          total: googlePlacesData.length
        };
      }
      
      // Final fallback to static data
      return {
        data: fallbackAccommodations,
        source: 'Fallback',
        total: fallbackAccommodations.length
      };
      
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      return {
        data: fallbackAccommodations,
        source: 'Fallback',
        total: fallbackAccommodations.length
      };
    }
  },

  // Get accommodations by city name
  async getAccommodationsByCity(cityName, radius = 5000) {
    try {
      // Convert city name to coordinates (simplified for common Turkish cities)
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
          data: fallbackAccommodations,
          source: 'Fallback',
          total: fallbackAccommodations.length
        };
      }
      
      return await this.getAccommodationsByCoordinates(coords.lat, coords.lng, radius);
      
    } catch (error) {
      console.error('Error fetching accommodations by city:', error);
      return {
        data: fallbackAccommodations,
        source: 'Fallback',
        total: fallbackAccommodations.length
      };
    }
  },

  // Filter accommodations by type
  filterByType(accommodations, type) {
    if (!type || type === 'all') {
      return accommodations;
    }
    
    return accommodations.filter(acc => 
      acc.type.toLowerCase() === type.toLowerCase()
    );
  },

  // Sort accommodations
  sortAccommodations(accommodations, sortBy = 'rating') {
    return [...accommodations].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name, 'tr');
        case 'type':
          return a.type.localeCompare(b.type, 'tr');
        default:
          return 0;
      }
    });
  },

  // Get accommodation types
  getAccommodationTypes() {
    return [
      { value: 'all', label: 'Tümü' },
      { value: 'Otel', label: 'Otel' },
      { value: 'Pansiyon', label: 'Pansiyon' },
      { value: 'Kamp Alanı', label: 'Kamp Alanı' },
      { value: 'Hostel', label: 'Hostel' },
      { value: 'Tatil Köyü', label: 'Tatil Köyü' },
      { value: 'Motel', label: 'Motel' }
    ];
  }
};

export default accommodationService; 