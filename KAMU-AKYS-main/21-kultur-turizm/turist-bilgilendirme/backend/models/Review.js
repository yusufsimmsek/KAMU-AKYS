import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Kullanıcı zorunludur']
  },
  entityType: {
    type: String,
    enum: ['destination', 'event', 'accommodation', 'restaurant'],
    required: [true, 'Entity türü zorunludur']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Entity ID zorunludur']
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  accommodation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  },
  rating: {
    overall: {
      type: Number,
      required: [true, 'Genel puan zorunludur'],
      min: 1,
      max: 5
    },
    // Destination için
    accessibility: { type: Number, min: 1, max: 5 },
    facilities: { type: Number, min: 1, max: 5 },
    value: { type: Number, min: 1, max: 5 },
    // Event için
    organization: { type: Number, min: 1, max: 5 },
    content: { type: Number, min: 1, max: 5 },
    venue: { type: Number, min: 1, max: 5 },
    // Accommodation için
    location: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    // Restaurant için
    food: { type: Number, min: 1, max: 5 },
    atmosphere: { type: Number, min: 1, max: 5 }
  },
  title: {
    type: String,
    required: [true, 'Başlık zorunludur'],
    trim: true,
    maxlength: [100, 'Başlık en fazla 100 karakter olabilir']
  },
  comment: {
    type: String,
    required: [true, 'Yorum zorunludur'],
    maxlength: [1000, 'Yorum en fazla 1000 karakter olabilir']
  },
  visitDate: {
    type: Date,
    required: [true, 'Ziyaret tarihi zorunludur']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dislikedAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [500, 'Yanıt en fazla 500 karakter olabilir']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ['manual', 'booking_confirmation', 'photo_verification']
  },
  language: {
    type: String,
    enum: ['tr', 'en', 'de', 'fr', 'ar'],
    default: 'tr'
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      enum: ['spam', 'inappropriate', 'fake', 'off-topic', 'other']
    },
    description: String,
    reportedAt: {
      type: Date,
      default: Date.now
    }
  }],
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  moderationNotes: String
}, {
  timestamps: true
});

// Compound indeksler
reviewSchema.index({ entityType: 1, entityId: 1 });
reviewSchema.index({ user: 1, entityType: 1, entityId: 1 }, { unique: true }); // Bir kullanıcı aynı entity'ye sadece bir yorum yapabilir
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ helpfulCount: -1 });

// Pre-save middleware - entity referansını ayarla
reviewSchema.pre('save', function(next) {
  // Entity referansını ayarla
  this[this.entityType] = this.entityId;
  next();
});

// Virtual for like count
reviewSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for dislike count
reviewSchema.virtual('dislikeCount').get(function() {
  return this.dislikes.length;
});

// Virtual for reply count
reviewSchema.virtual('replyCount').get(function() {
  return this.replies.length;
});

// Method to check if user liked the review
reviewSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Method to check if user disliked the review
reviewSchema.methods.isDislikedBy = function(userId) {
  return this.dislikes.some(dislike => dislike.user.toString() === userId.toString());
};

export default mongoose.model('Review', reviewSchema); 