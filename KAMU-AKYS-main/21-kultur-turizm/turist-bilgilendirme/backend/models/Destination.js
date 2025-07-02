import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    tr: {
      type: String,
      required: [true, 'Türkçe isim zorunludur'],
      trim: true
    },
    en: {
      type: String,
      trim: true
    },
    de: {
      type: String,
      trim: true
    },
    fr: {
      type: String,
      trim: true
    },
    ar: {
      type: String,
      trim: true
    }
  },
  description: {
    tr: {
      type: String,
      required: [true, 'Türkçe açıklama zorunludur']
    },
    en: {
      type: String
    },
    de: {
      type: String
    },
    fr: {
      type: String
    },
    ar: {
      type: String
    }
  },
  category: {
    type: String,
    enum: [
      'historical', 'natural', 'cultural', 'religious', 
      'museum', 'beach', 'mountain', 'thermal', 
      'adventure', 'entertainment'
    ],
    required: [true, 'Kategori zorunludur']
  },
  location: {
    city: {
      type: String,
      required: [true, 'Şehir zorunludur']
    },
    district: {
      type: String,
      required: [true, 'İlçe zorunludur']
    },
    address: {
      type: String,
      required: [true, 'Adres zorunludur']
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Enlem zorunludur'],
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        required: [true, 'Boylam zorunludur'],
        min: -180,
        max: 180
      }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      tr: String,
      en: String,
      de: String,
      fr: String,
      ar: String
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  contact: {
    phone: String,
    website: String,
    email: String
  },
  visitInfo: {
    openingHours: {
      monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
      tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
      wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
      thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
      friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
      saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
      sunday: { open: String, close: String, isClosed: { type: Boolean, default: false } }
    },
    entrance: {
      fee: Number,
      currency: {
        type: String,
        default: 'TRY'
      },
      freeFor: [String] // ['students', 'seniors', 'disabled']
    },
    duration: {
      type: String, // "1-2 saat", "yarım gün", "tam gün"
      enum: ['30min', '1hour', '2hours', 'halfday', 'fullday', 'multiday']
    },
    bestTimeToVisit: [String], // ['spring', 'summer', 'autumn', 'winter']
    accessibility: {
      wheelchairAccessible: {
        type: Boolean,
        default: false
      },
      guideDogFriendly: {
        type: Boolean,
        default: false
      },
      audioGuide: {
        type: Boolean,
        default: false
      }
    }
  },
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  amenities: [String], // ['parking', 'restroom', 'cafe', 'gift_shop', 'wifi', 'audio_guide']
  tags: [String], // ['family_friendly', 'romantic', 'adventure', 'educational']
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// İndeksler
destinationSchema.index({ 'location.coordinates': '2dsphere' });
destinationSchema.index({ category: 1 });
destinationSchema.index({ 'location.city': 1 });
destinationSchema.index({ 'ratings.average': -1 });
destinationSchema.index({ tags: 1 });

// Virtual for review count
destinationSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'destination',
  count: true
});

export default mongoose.model('Destination', destinationSchema); 