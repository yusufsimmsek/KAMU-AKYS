import express from 'express';
import { body } from 'express-validator';
import Review from '../models/Review.js';
import Destination from '../models/Destination.js';
import Event from '../models/Event.js';
import Accommodation from '../models/Accommodation.js';
import Restaurant from '../models/Restaurant.js';
import { authenticateToken, optionalAuth, requireModeratorOrAdmin } from '../middleware/auth.js';
import { 
  handleValidationErrors, 
  validateObjectId, 
  validatePagination 
} from '../middleware/validation.js';

const router = express.Router();

// Entity modelini getir
const getEntityModel = (entityType) => {
  switch (entityType) {
    case 'destination': return Destination;
    case 'event': return Event;
    case 'accommodation': return Accommodation;
    case 'restaurant': return Restaurant;
    default: return null;
  }
};

// Entity'nin rating'ini güncelle
const updateEntityRating = async (entityType, entityId) => {
  try {
    const Model = getEntityModel(entityType);
    if (!Model) return;

    const reviews = await Review.find({ 
      entityType, 
      entityId, 
      status: 'approved' 
    });

    if (reviews.length === 0) {
      await Model.findByIdAndUpdate(entityId, {
        'ratings.average': 0,
        'ratings.count': 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating.overall, 0);
    const averageRating = totalRating / reviews.length;

    await Model.findByIdAndUpdate(entityId, {
      'ratings.average': Math.round(averageRating * 10) / 10,
      'ratings.count': reviews.length
    });
  } catch (error) {
    console.error('Update entity rating error:', error);
  }
};

// Belirli entity için yorumları listele
router.get('/:entityType/:entityId', optionalAuth, validatePagination, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { page, limit, skip, sort } = req.pagination;
    const { status = 'approved' } = req.query;

    if (!['destination', 'event', 'accommodation', 'restaurant'].includes(entityType)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz entity türü'
      });
    }

    const filter = { entityType, entityId };
    
    // Admin/moderator değilse sadece onaylanmış yorumları göster
    if (!req.user || !['admin', 'moderator'].includes(req.user.role)) {
      filter.status = 'approved';
    } else if (status) {
      filter.status = status;
    }

    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName avatar')
      .populate('replies.user', 'firstName lastName avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yeni yorum ekle
router.post('/', authenticateToken, [
  body('entityType')
    .isIn(['destination', 'event', 'accommodation', 'restaurant'])
    .withMessage('Geçerli bir entity türü seçiniz'),
  body('entityId')
    .isMongoId()
    .withMessage('Geçerli bir entity ID giriniz'),
  body('rating.overall')
    .isInt({ min: 1, max: 5 })
    .withMessage('Genel puan 1-5 arasında olmalıdır'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Başlık 5-100 karakter arasında olmalıdır'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Yorum 10-1000 karakter arasında olmalıdır'),
  body('visitDate')
    .isISO8601()
    .withMessage('Geçerli bir ziyaret tarihi giriniz')
], handleValidationErrors, async (req, res) => {
  try {
    const { entityType, entityId } = req.body;

    // Entity'nin var olup olmadığını kontrol et
    const Model = getEntityModel(entityType);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz entity türü'
      });
    }

    const entity = await Model.findById(entityId);
    if (!entity) {
      return res.status(404).json({
        success: false,
        message: 'Entity bulunamadı'
      });
    }

    // Kullanıcının daha önce yorum yapıp yapmadığını kontrol et
    const existingReview = await Review.findOne({
      user: req.user._id,
      entityType,
      entityId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Bu içerik için zaten bir yorumunuz bulunuyor'
      });
    }

    const review = new Review({
      ...req.body,
      user: req.user._id
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'firstName lastName avatar');

    // Entity rating'ini güncelle
    await updateEntityRating(entityType, entityId);

    res.status(201).json({
      success: true,
      message: 'Yorum başarıyla eklendi',
      data: {
        review: populatedReview
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yorum güncelle
router.put('/:id', validateObjectId(), authenticateToken, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Başlık 5-100 karakter arasında olmalıdır'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Yorum 10-1000 karakter arasında olmalıdır'),
  body('rating.overall')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Genel puan 1-5 arasında olmalıdır')
], handleValidationErrors, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    // Sadece yorum sahibi veya admin/moderator güncelleyebilir
    if (review.user.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu yorumu güncelleme yetkiniz yok'
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName avatar');

    // Rating değiştiyse entity rating'ini güncelle
    if (req.body.rating?.overall) {
      await updateEntityRating(review.entityType, review.entityId);
    }

    res.json({
      success: true,
      message: 'Yorum güncellendi',
      data: {
        review: updatedReview
      }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yorum sil
router.delete('/:id', validateObjectId(), authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    // Sadece yorum sahibi veya admin/moderator silebilir
    if (review.user.toString() !== req.user._id.toString() && 
        !['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Bu yorumu silme yetkiniz yok'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    // Entity rating'ini güncelle
    await updateEntityRating(review.entityType, review.entityId);

    res.json({
      success: true,
      message: 'Yorum silindi'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yorumu beğen/beğenme
router.post('/:id/like', validateObjectId(), authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    const userId = req.user._id;
    const alreadyLiked = review.isLikedBy(userId);
    const alreadyDisliked = review.isDislikedBy(userId);

    if (alreadyLiked) {
      // Beğeniyi kaldır
      review.likes = review.likes.filter(like => like.user.toString() !== userId.toString());
    } else {
      // Dislike varsa kaldır
      if (alreadyDisliked) {
        review.dislikes = review.dislikes.filter(dislike => dislike.user.toString() !== userId.toString());
      }
      // Beğeni ekle
      review.likes.push({ user: userId });
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyLiked ? 'Beğeni kaldırıldı' : 'Yorum beğenildi',
      data: {
        likeCount: review.likes.length,
        dislikeCount: review.dislikes.length,
        isLiked: !alreadyLiked,
        isDisliked: false
      }
    });
  } catch (error) {
    console.error('Like review error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yorumu beğenme
router.post('/:id/dislike', validateObjectId(), authenticateToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    const userId = req.user._id;
    const alreadyLiked = review.isLikedBy(userId);
    const alreadyDisliked = review.isDislikedBy(userId);

    if (alreadyDisliked) {
      // Dislike'ı kaldır
      review.dislikes = review.dislikes.filter(dislike => dislike.user.toString() !== userId.toString());
    } else {
      // Like varsa kaldır
      if (alreadyLiked) {
        review.likes = review.likes.filter(like => like.user.toString() !== userId.toString());
      }
      // Dislike ekle
      review.dislikes.push({ user: userId });
    }

    await review.save();

    res.json({
      success: true,
      message: alreadyDisliked ? 'Beğenmeme kaldırıldı' : 'Yorum beğenilmedi',
      data: {
        likeCount: review.likes.length,
        dislikeCount: review.dislikes.length,
        isLiked: false,
        isDisliked: !alreadyDisliked
      }
    });
  } catch (error) {
    console.error('Dislike review error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yorum onaylama/reddetme (Admin/Moderator)
router.patch('/:id/moderate', validateObjectId(), authenticateToken, requireModeratorOrAdmin, [
  body('status')
    .isIn(['approved', 'rejected', 'hidden'])
    .withMessage('Geçerli bir durum seçiniz'),
  body('moderationNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Moderasyon notu en fazla 500 karakter olabilir')
], handleValidationErrors, async (req, res) => {
  try {
    const { status, moderationNotes } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        status,
        moderationNotes,
        moderatedBy: req.user._id,
        moderatedAt: new Date()
      },
      { new: true }
    ).populate('user moderatedBy', 'firstName lastName');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    // Entity rating'ini güncelle
    await updateEntityRating(review.entityType, review.entityId);

    res.json({
      success: true,
      message: 'Yorum durumu güncellendi',
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

export default router; 