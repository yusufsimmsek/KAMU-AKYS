import express from 'express';
import { body } from 'express-validator';
import Destination from '../models/Destination.js';
import Review from '../models/Review.js';
import { authenticateToken, optionalAuth, requireModeratorOrAdmin } from '../middleware/auth.js';
import { 
  handleValidationErrors, 
  validateObjectId, 
  validatePagination, 
  validateLanguage 
} from '../middleware/validation.js';

const router = express.Router();

// Helper function - Dil tercihine göre içerik getir
const getLocalizedContent = (obj, language = 'tr') => {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null && obj[key][language]) {
      result[key] = obj[key][language] || obj[key]['tr'];
    } else {
      result[key] = obj[key];
    }
  });
  return result;
};

// Tüm turistik yerleri listele
router.get('/', optionalAuth, validatePagination, validateLanguage, async (req, res) => {
  try {
    const { page, limit, skip, sort } = req.pagination;
    const { 
      category, 
      city, 
      search, 
      minRating, 
      tags, 
      lat, 
      lng, 
      radius 
    } = req.query;

    // Filtre objesi oluştur
    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { [`name.${req.language}`]: { $regex: search, $options: 'i' } },
        { [`description.${req.language}`]: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    if (minRating) {
      filter['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }

    // Coğrafi arama
    if (lat && lng && radius) {
      filter['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius) * 1000 // km to meters
        }
      };
    }

    const destinations = await Destination.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Destination.countDocuments(filter);

    // Dil tercihine göre içeriği filtrele
    const localizedDestinations = destinations.map(dest => ({
      ...dest,
      name: dest.name[req.language] || dest.name.tr,
      description: dest.description[req.language] || dest.description.tr
    }));

    res.json({
      success: true,
      data: {
        destinations: localizedDestinations,
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
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Tek turistik yer detayı
router.get('/:id', validateObjectId(), optionalAuth, validateLanguage, async (req, res) => {
  try {
    const destination = await Destination.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('createdBy', 'firstName lastName')
    .lean();

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Turistik yer bulunamadı'
      });
    }

    // İlgili yorumları getir
    const reviews = await Review.find({ 
      entityType: 'destination', 
      entityId: req.params.id,
      status: 'approved'
    })
    .populate('user', 'firstName lastName avatar')
    .sort('-createdAt')
    .limit(10)
    .lean();

    // Dil tercihine göre içeriği filtrele
    const localizedDestination = {
      ...destination,
      name: destination.name[req.language] || destination.name.tr,
      description: destination.description[req.language] || destination.description.tr
    };

    res.json({
      success: true,
      data: {
        destination: localizedDestination,
        reviews
      }
    });
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yeni turistik yer ekle
router.post('/', authenticateToken, requireModeratorOrAdmin, [
  body('name.tr')
    .notEmpty()
    .withMessage('Türkçe isim zorunludur'),
  body('description.tr')
    .notEmpty()
    .withMessage('Türkçe açıklama zorunludur'),
  body('category')
    .isIn(['historical', 'natural', 'cultural', 'religious', 'museum', 'beach', 'mountain', 'thermal', 'adventure', 'entertainment'])
    .withMessage('Geçerli bir kategori seçiniz'),
  body('location.city')
    .notEmpty()
    .withMessage('Şehir zorunludur'),
  body('location.district')
    .notEmpty()
    .withMessage('İlçe zorunludur'),
  body('location.address')
    .notEmpty()
    .withMessage('Adres zorunludur'),
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Geçerli bir enlem değeri giriniz'),
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Geçerli bir boylam değeri giriniz')
], handleValidationErrors, async (req, res) => {
  try {
    const destination = new Destination({
      ...req.body,
      createdBy: req.user._id
    });

    await destination.save();

    const populatedDestination = await Destination.findById(destination._id)
      .populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Turistik yer başarıyla eklendi',
      data: {
        destination: populatedDestination
      }
    });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Turistik yer güncelle
router.put('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, [
  body('name.tr')
    .optional()
    .notEmpty()
    .withMessage('Türkçe isim boş olamaz'),
  body('description.tr')
    .optional()
    .notEmpty()
    .withMessage('Türkçe açıklama boş olamaz'),
  body('category')
    .optional()
    .isIn(['historical', 'natural', 'cultural', 'religious', 'museum', 'beach', 'mountain', 'thermal', 'adventure', 'entertainment'])
    .withMessage('Geçerli bir kategori seçiniz')
], handleValidationErrors, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Turistik yer bulunamadı'
      });
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        lastUpdatedBy: req.user._id 
      },
      { new: true, runValidators: true }
    ).populate('createdBy lastUpdatedBy', 'firstName lastName');

    res.json({
      success: true,
      message: 'Turistik yer güncellendi',
      data: {
        destination: updatedDestination
      }
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Turistik yer sil
router.delete('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Turistik yer bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Turistik yer silindi'
    });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yakındaki turistik yerleri getir
router.get('/:id/nearby', validateObjectId(), optionalAuth, validateLanguage, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Turistik yer bulunamadı'
      });
    }

    const radius = req.query.radius || 10; // km
    const limit = parseInt(req.query.limit) || 5;

    const nearbyDestinations = await Destination.find({
      _id: { $ne: req.params.id },
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: destination.location.coordinates
          },
          $maxDistance: radius * 1000
        }
      }
    })
    .limit(limit)
    .lean();

    // Dil tercihine göre içeriği filtrele
    const localizedDestinations = nearbyDestinations.map(dest => ({
      ...dest,
      name: dest.name[req.language] || dest.name.tr,
      description: dest.description[req.language] || dest.description.tr
    }));

    res.json({
      success: true,
      data: {
        nearbyDestinations: localizedDestinations
      }
    });
  } catch (error) {
    console.error('Get nearby destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Kategorileri getir
router.get('/categories/list', async (req, res) => {
  try {
    const categories = [
      { value: 'historical', label: { tr: 'Tarihi', en: 'Historical' } },
      { value: 'natural', label: { tr: 'Doğal', en: 'Natural' } },
      { value: 'cultural', label: { tr: 'Kültürel', en: 'Cultural' } },
      { value: 'religious', label: { tr: 'Dini', en: 'Religious' } },
      { value: 'museum', label: { tr: 'Müze', en: 'Museum' } },
      { value: 'beach', label: { tr: 'Plaj', en: 'Beach' } },
      { value: 'mountain', label: { tr: 'Dağ', en: 'Mountain' } },
      { value: 'thermal', label: { tr: 'Termal', en: 'Thermal' } },
      { value: 'adventure', label: { tr: 'Macera', en: 'Adventure' } },
      { value: 'entertainment', label: { tr: 'Eğlence', en: 'Entertainment' } }
    ];

    res.json({
      success: true,
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

export default router; 