import express from 'express';
import { body } from 'express-validator';
import Event from '../models/Event.js';
import { authenticateToken, optionalAuth, requireModeratorOrAdmin } from '../middleware/auth.js';
import { 
  handleValidationErrors, 
  validateObjectId, 
  validatePagination, 
  validateLanguage 
} from '../middleware/validation.js';

const router = express.Router();

// Tüm etkinlikleri listele
router.get('/', optionalAuth, validatePagination, validateLanguage, async (req, res) => {
  try {
    const { page, limit, skip, sort } = req.pagination;
    const { 
      category, 
      city, 
      search, 
      status,
      startDate,
      endDate,
      isFree,
      isFeatured
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (status) filter.status = status;
    if (isFree === 'true') filter['pricing.isFree'] = true;
    if (isFeatured === 'true') filter.isFeatured = true;

    if (search) {
      filter.$or = [
        { [`title.${req.language}`]: { $regex: search, $options: 'i' } },
        { [`description.${req.language}`]: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Tarih filtreleri
    if (startDate || endDate) {
      filter['dates.start'] = {};
      if (startDate) filter['dates.start']['$gte'] = new Date(startDate);
      if (endDate) filter['dates.start']['$lte'] = new Date(endDate);
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Event.countDocuments(filter);

    const localizedEvents = events.map(event => ({
      ...event,
      title: event.title[req.language] || event.title.tr,
      description: event.description[req.language] || event.description.tr
    }));

    res.json({
      success: true,
      data: {
        events: localizedEvents,
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
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Tek etkinlik detayı
router.get('/:id', validateObjectId(), optionalAuth, validateLanguage, async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('createdBy', 'firstName lastName')
    .lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Etkinlik bulunamadı'
      });
    }

    const localizedEvent = {
      ...event,
      title: event.title[req.language] || event.title.tr,
      description: event.description[req.language] || event.description.tr
    };

    res.json({
      success: true,
      data: {
        event: localizedEvent
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yeni etkinlik ekle
router.post('/', authenticateToken, requireModeratorOrAdmin, [
  body('title.tr').notEmpty().withMessage('Türkçe başlık zorunludur'),
  body('description.tr').notEmpty().withMessage('Türkçe açıklama zorunludur'),
  body('category').isIn(['cultural', 'art', 'music', 'theater', 'sports', 'food', 'festival', 'conference', 'workshop', 'exhibition', 'religious', 'traditional']).withMessage('Geçerli bir kategori seçiniz'),
  body('dates.start').isISO8601().withMessage('Geçerli başlangıç tarihi giriniz'),
  body('dates.end').isISO8601().withMessage('Geçerli bitiş tarihi giriniz'),
  body('location.venue').notEmpty().withMessage('Mekan zorunludur'),
  body('location.city').notEmpty().withMessage('Şehir zorunludur'),
  body('organizer.name').notEmpty().withMessage('Organizatör adı zorunludur')
], handleValidationErrors, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      createdBy: req.user._id
    });

    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Etkinlik başarıyla eklendi',
      data: {
        event: populatedEvent
      }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Etkinlik güncelle
router.put('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, [
  body('title.tr').optional().notEmpty().withMessage('Türkçe başlık boş olamaz'),
  body('description.tr').optional().notEmpty().withMessage('Türkçe açıklama boş olamaz')
], handleValidationErrors, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        lastUpdatedBy: req.user._id 
      },
      { new: true, runValidators: true }
    ).populate('createdBy lastUpdatedBy', 'firstName lastName');

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Etkinlik bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Etkinlik güncellendi',
      data: {
        event: updatedEvent
      }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Etkinlik sil
router.delete('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Etkinlik bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Etkinlik silindi'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yaklaşan etkinlikler
router.get('/upcoming/list', optionalAuth, validateLanguage, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const now = new Date();

    const events = await Event.find({
      isActive: true,
      status: 'scheduled',
      'dates.start': { $gte: now }
    })
    .sort({ 'dates.start': 1 })
    .limit(limit)
    .lean();

    const localizedEvents = events.map(event => ({
      ...event,
      title: event.title[req.language] || event.title.tr,
      description: event.description[req.language] || event.description.tr
    }));

    res.json({
      success: true,
      data: {
        upcomingEvents: localizedEvents
      }
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

export default router; 