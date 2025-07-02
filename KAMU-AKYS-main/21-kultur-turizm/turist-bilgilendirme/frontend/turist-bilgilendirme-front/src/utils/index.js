import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { tr } from 'date-fns/locale';

// Tailwind class merger
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format date
export const formatDate = (date, formatString = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return format(parsedDate, formatString, { locale: tr });
};

// Format relative time
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: tr });
};

// Format currency
export const formatCurrency = (amount, currency = 'TRY') => {
  if (typeof amount !== 'number') return '';
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Generate star rating
export const generateStars = (rating, maxStars = 5) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  if (hasHalfStar) {
    stars.push('half');
  }
  
  while (stars.length < maxStars) {
    stars.push('empty');
  }
  
  return stars;
};

// Truncate text
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Generate slug from text
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Get image URL with fallback
export const getImageUrl = (imagePath, fallback = '/images/placeholder.jpg') => {
  if (!imagePath) return fallback;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // If it's a relative path, add base URL
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePath}`;
};

// Calculate distance between two coordinates
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

// URL helpers
export const buildUrl = (base, params = {}) => {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

// Array helpers
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Category translations
export const categoryTranslations = {
  destinations: {
    historical: 'Tarihi',
    natural: 'Doğal',
    cultural: 'Kültürel',
    religious: 'Dini',
    museum: 'Müze',
    beach: 'Plaj',
    mountain: 'Dağ',
    thermal: 'Termal',
    adventure: 'Macera',
    entertainment: 'Eğlence'
  },
  events: {
    cultural: 'Kültürel',
    art: 'Sanat',
    music: 'Müzik',
    theater: 'Tiyatro',
    sports: 'Spor',
    food: 'Yemek',
    festival: 'Festival',
    conference: 'Konferans',
    workshop: 'Workshop',
    exhibition: 'Sergi',
    religious: 'Dini',
    traditional: 'Geleneksel'
  },
  accommodations: {
    hotel: 'Otel',
    pension: 'Pansiyon',
    boutique: 'Butik Otel',
    resort: 'Resort',
    hostel: 'Hostel',
    apartment: 'Apart',
    villa: 'Villa',
    camping: 'Kamp',
    thermal: 'Termal'
  },
  restaurants: {
    'fine-dining': 'Fine Dining',
    casual: 'Casual',
    'fast-casual': 'Fast Casual',
    cafe: 'Cafe',
    'street-food': 'Sokak Lezzeti',
    buffet: 'Büfe'
  }
};

export const getCategoryTranslation = (type, category) => {
  return categoryTranslations[type]?.[category] || category;
}; 