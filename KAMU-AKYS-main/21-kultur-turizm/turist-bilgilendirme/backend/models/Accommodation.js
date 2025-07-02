import mongoose from 'mongoose';

const accommodationSchema = new mongoose.Schema({
  name: {
    tr: {
      type: String,
      required: [true, 'Türkçe isim zorunludur'],
      trim: true
    },
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
  type: {
    type: String,
    enum: ['hotel', 'pension', 'boutique', 'resort', 'hostel', 'apartment', 'villa', 'camping', 'thermal'],
    required: [true, 'Tür zorunludur']
  },
  category: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'backpacker'],
    required: [true, 'Kategori zorunludur']
  },
  stars: {
    type: Number,
    min: 1,
    max: 5
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
  rooms: {
    total: { type: Number, required: [true, 'Toplam oda sayısı zorunludur'] },
    types: [{
      name: String,
      capacity: Number,
      count: Number,
      amenities: [String],
      priceRange: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'TRY' }
      }
    }]
  },
  pricing: {
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      currency: { type: String, default: 'TRY' }
    },
    seasons: [{
      name: String,
      startDate: String, // MM-DD format
      endDate: String,   // MM-DD format
      multiplier: { type: Number, default: 1 }
    }]
  },
  amenities: [String], // ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'parking', 'breakfast']
  policies: {
    checkIn: String,
    checkOut: String,
    cancellation: String,
    pets: { type: Boolean, default: false },
    smoking: { type: Boolean, default: false }
  },
  images: [{
    url: { type: String, required: true },
    caption: {
      tr: String, en: String, de: String, fr: String, ar: String
    },
    type: { type: String, enum: ['exterior', 'lobby', 'room', 'restaurant', 'pool', 'spa', 'other'] },
    isPrimary: { type: Boolean, default: false }
  }],
  ratings: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    count: { type: Number, default: 0 },
    breakdown: {
      location: { type: Number, min: 0, max: 5, default: 0 },
      cleanliness: { type: Number, min: 0, max: 5, default: 0 },
      service: { type: Number, min: 0, max: 5, default: 0 },
      value: { type: Number, min: 0, max: 5, default: 0 }
    }
  },
  awards: [String],
  certifications: [String], // ['eco-friendly', 'halal', 'family-friendly']
  nearbyAttractions: [{
    name: String,
    distance: Number, // in km
    walkingTime: Number // in minutes
  }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// İndeksler
accommodationSchema.index({ 'location.coordinates': '2dsphere' });
accommodationSchema.index({ type: 1 });
accommodationSchema.index({ category: 1 });
accommodationSchema.index({ 'location.city': 1 });
accommodationSchema.index({ 'ratings.average': -1 });
accommodationSchema.index({ 'pricing.priceRange.min': 1 });

export default mongoose.model('Accommodation', accommodationSchema); 