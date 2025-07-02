import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    tr: { type: String, required: [true, 'Türkçe isim zorunludur'], trim: true },
    en: { type: String, trim: true },
    de: { type: String, trim: true },
    fr: { type: String, trim: true },
    ar: { type: String, trim: true }
  },
  description: {
    tr: { type: String, required: [true, 'Türkçe açıklama zorunludur'] },
    en: { type: String },
    de: { type: String },
    fr: { type: String },
    ar: { type: String }
  },
  cuisine: {
    type: [String],
    required: [true, 'Mutfak türü zorunludur'],
    enum: ['turkish', 'ottoman', 'mediterranean', 'seafood', 'kebab', 'pizza', 'international', 'asian', 'european', 'vegetarian', 'vegan', 'fast-food', 'cafe', 'dessert']
  },
  category: {
    type: String,
    enum: ['fine-dining', 'casual', 'fast-casual', 'cafe', 'street-food', 'buffet'],
    required: [true, 'Kategori zorunludur']
  },
  priceRange: {
    type: String,
    enum: ['budget', 'moderate', 'expensive', 'luxury'],
    required: [true, 'Fiyat aralığı zorunludur']
  },
  location: {
    address: { type: String, required: [true, 'Adres zorunludur'] },
    city: { type: String, required: [true, 'Şehir zorunludur'] },
    district: { type: String, required: [true, 'İlçe zorunludur'] },
    coordinates: {
      latitude: { type: Number, min: -90, max: 90 },
      longitude: { type: Number, min: -180, max: 180 }
    }
  },
  contact: {
    phone: { type: String, required: [true, 'Telefon zorunludur'] },
    email: String,
    website: String,
    whatsapp: String
  },
  openingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
  },
  capacity: {
    indoor: Number,
    outdoor: Number,
    total: Number
  },
  features: [String], // ['outdoor-seating', 'live-music', 'sea-view', 'historic-building', 'family-friendly', 'romantic']
  services: [String], // ['takeaway', 'delivery', 'reservation', 'valet-parking', 'wi-fi']
  dietaryOptions: [String], // ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher']
  specialties: [{
    name: {
      tr: String,
      en: String,
      de: String,
      fr: String,
      ar: String
    },
    description: {
      tr: String,
      en: String,
      de: String,
      fr: String,
      ar: String
    },
    price: Number,
    currency: { type: String, default: 'TRY' }
  }],
  menu: {
    hasMenu: { type: Boolean, default: false },
    menuUrl: String,
    lastUpdated: Date
  },
  images: [{
    url: { type: String, required: true },
    caption: {
      tr: String, en: String, de: String, fr: String, ar: String
    },
    type: { type: String, enum: ['exterior', 'interior', 'food', 'menu', 'chef', 'view'] },
    isPrimary: { type: Boolean, default: false }
  }],
  ratings: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      food: { type: Number, min: 0, max: 5, default: 0 },
      service: { type: Number, min: 0, max: 5, default: 0 },
      atmosphere: { type: Number, min: 0, max: 5, default: 0 },
      value: { type: Number, min: 0, max: 5, default: 0 }
    }
  },
  awards: [String],
  socialMedia: {
    instagram: String,
    facebook: String,
    tripadvisor: String
  },
  reservationInfo: {
    required: { type: Boolean, default: false },
    phone: String,
    website: String,
    notes: String
  },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// İndeksler
restaurantSchema.index({ 'location.coordinates': '2dsphere' });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ category: 1 });
restaurantSchema.index({ priceRange: 1 });
restaurantSchema.index({ 'location.city': 1 });
restaurantSchema.index({ 'ratings.average': -1 });

export default mongoose.model('Restaurant', restaurantSchema); 