import express from 'express';
import { body } from 'express-validator';
import Accommodation from '../models/Accommodation.js';
import { authenticateToken, optionalAuth, requireModeratorOrAdmin } from '../middleware/auth.js';
import { 
  handleValidationErrors, 
  validateObjectId, 
  validatePagination, 
  validateLanguage 
} from '../middleware/validation.js';

const router = express.Router();

// Tüm konaklamaları listele
router.get('/', optionalAuth, validatePagination, validateLanguage, async (req, res) => {
  try {
    const { page, limit, skip, sort } = req.pagination;
    const { 
      type, 
      category, 
      city, 
      search, 
      minPrice,
      maxPrice,
      stars,
      amenities
    } = req.query;

    const filter = { isActive: true };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (stars) filter.stars = parseInt(stars);

    if (search) {
      filter.$or = [
        { [`name.${req.language}`]: { $regex: search, $options: 'i' } },
        { [`description.${req.language}`]: { $regex: search, $options: 'i' } }
      ];
    }

    // Fiyat filtresi
    if (minPrice || maxPrice) {
      filter['pricing.priceRange.min'] = {};
      if (minPrice) filter['pricing.priceRange.min']['$gte'] = parseFloat(minPrice);
      if (maxPrice) filter['pricing.priceRange.max'] = { '$lte': parseFloat(maxPrice) };
    }

    // Özellik filtresi
    if (amenities) {
      const amenityArray = amenities.split(',');
      filter.amenities = { $all: amenityArray };
    }

    const accommodations = await Accommodation.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Accommodation.countDocuments(filter);

    const localizedAccommodations = accommodations.map(acc => ({
      ...acc,
      name: acc.name[req.language] || acc.name.tr,
      description: acc.description[req.language] || acc.description.tr
    }));

    res.json({
      success: true,
      data: {
        accommodations: localizedAccommodations,
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
    console.error('Get accommodations error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Tek konaklama detayı
router.get('/:id', validateObjectId(), optionalAuth, validateLanguage, async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('createdBy', 'firstName lastName')
    .lean();

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Konaklama bulunamadı'
      });
    }

    const localizedAccommodation = {
      ...accommodation,
      name: accommodation.name[req.language] || accommodation.name.tr,
      description: accommodation.description[req.language] || accommodation.description.tr
    };

    res.json({
      success: true,
      data: {
        accommodation: localizedAccommodation
      }
    });
  } catch (error) {
    console.error('Get accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yeni konaklama ekle
router.post('/', authenticateToken, requireModeratorOrAdmin, [
  body('name.tr').notEmpty().withMessage('Türkçe isim zorunludur'),
  body('description.tr').notEmpty().withMessage('Türkçe açıklama zorunludur'),
  body('type').isIn(['hotel', 'pension', 'boutique', 'resort', 'hostel', 'apartment', 'villa', 'camping', 'thermal']).withMessage('Geçerli bir tür seçiniz'),
  body('category').isIn(['budget', 'mid-range', 'luxury', 'backpacker']).withMessage('Geçerli bir kategori seçiniz'),
  body('location.city').notEmpty().withMessage('Şehir zorunludur'),
  body('contact.phone').notEmpty().withMessage('Telefon zorunludur'),
  body('rooms.total').isInt({ min: 1 }).withMessage('Geçerli oda sayısı giriniz'),
  body('pricing.priceRange.min').isFloat({ min: 0 }).withMessage('Geçerli minimum fiyat giriniz'),
  body('pricing.priceRange.max').isFloat({ min: 0 }).withMessage('Geçerli maksimum fiyat giriniz')
], handleValidationErrors, async (req, res) => {
  try {
    const accommodation = new Accommodation({
      ...req.body,
      createdBy: req.user._id
    });

    await accommodation.save();

    const populatedAccommodation = await Accommodation.findById(accommodation._id)
      .populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Konaklama başarıyla eklendi',
      data: {
        accommodation: populatedAccommodation
      }
    });
  } catch (error) {
    console.error('Create accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Konaklama güncelle
router.put('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, async (req, res) => {
  try {
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        lastUpdatedBy: req.user._id 
      },
      { new: true, runValidators: true }
    ).populate('createdBy lastUpdatedBy', 'firstName lastName');

    if (!updatedAccommodation) {
      return res.status(404).json({
        success: false,
        message: 'Konaklama bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Konaklama güncellendi',
      data: {
        accommodation: updatedAccommodation
      }
    });
  } catch (error) {
    console.error('Update accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Konaklama sil
router.delete('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, async (req, res) => {
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Konaklama bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Konaklama silindi'
    });
  } catch (error) {
    console.error('Delete accommodation error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

export default router; 