import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    tr: {
      type: String,
      required: [true, 'Türkçe başlık zorunludur'],
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
      'cultural', 'art', 'music', 'theater', 'sports', 
      'food', 'festival', 'conference', 'workshop', 
      'exhibition', 'religious', 'traditional'
    ],
    required: [true, 'Kategori zorunludur']
  },
  type: {
    type: String,
    enum: ['free', 'paid', 'invitation', 'registration_required'],
    default: 'free'
  },
  dates: {
    start: {
      type: Date,
      required: [true, 'Başlangıç tarihi zorunludur']
    },
    end: {
      type: Date,
      required: [true, 'Bitiş tarihi zorunludur']
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringPattern: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly']
    }
  },
  time: {
    start: {
      type: String,
      required: [true, 'Başlangıç saati zorunludur']
    },
    end: {
      type: String,
      required: [true, 'Bitiş saati zorunludur']
    }
  },
  location: {
    venue: {
      type: String,
      required: [true, 'Mekan zorunludur']
    },
    address: {
      type: String,
      required: [true, 'Adres zorunludur']
    },
    city: {
      type: String,
      required: [true, 'Şehir zorunludur']
    },
    district: {
      type: String,
      required: [true, 'İlçe zorunludur']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  organizer: {
    name: {
      type: String,
      required: [true, 'Organizatör adı zorunludur']
    },
    contact: {
      phone: String,
      email: String,
      website: String
    }
  },
  pricing: {
    isFree: {
      type: Boolean,
      default: true
    },
    price: {
      amount: Number,
      currency: {
        type: String,
        default: 'TRY'
      }
    },
    discounts: [{
      type: {
        type: String,
        enum: ['student', 'senior', 'group', 'early_bird', 'member']
      },
      amount: Number,
      percentage: Number,
      description: String
    }]
  },
  capacity: {
    max: Number,
    registered: {
      type: Number,
      default: 0
    },
    isLimited: {
      type: Boolean,
      default: false
    }
  },
  registration: {
    required: {
      type: Boolean,
      default: false
    },
    url: String,
    deadline: Date,
    instructions: {
      tr: String,
      en: String,
      de: String,
      fr: String,
      ar: String
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
  tags: [String], // ['family_friendly', 'outdoor', 'indoor', 'educational', 'entertainment']
  ageRestriction: {
    min: Number,
    max: Number,
    description: String
  },
  accessibility: {
    wheelchairAccessible: {
      type: Boolean,
      default: false
    },
    signLanguage: {
      type: Boolean,
      default: false
    },
    audioDescription: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'postponed', 'completed'],
    default: 'scheduled'
  },
  highlights: [String], // Öne çıkan özellikler
  requirements: [String], // Gereksinimler (getirmeniz gerekenler vs.)
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    youtube: String
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
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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
eventSchema.index({ 'dates.start': 1 });
eventSchema.index({ 'dates.end': 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ 'location.city': 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ isFeatured: -1 });

// Virtual for duration
eventSchema.virtual('duration').get(function() {
  const start = new Date(`1970-01-01T${this.time.start}:00`);
  const end = new Date(`1970-01-01T${this.time.end}:00`);
  const diffMs = end - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}:${diffMins.toString().padStart(2, '0')}`;
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.dates.start > new Date();
});

// Virtual for checking if event is ongoing
eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.dates.start <= now && this.dates.end >= now;
});

export default mongoose.model('Event', eventSchema); 