import express from 'express';
import { body } from 'express-validator';
import Restaurant from '../models/Restaurant.js';
import { authenticateToken, optionalAuth, requireModeratorOrAdmin } from '../middleware/auth.js';
import { 
  handleValidationErrors, 
  validateObjectId, 
  validatePagination, 
  validateLanguage 
} from '../middleware/validation.js';

const router = express.Router();

// Tüm restoranları listele
router.get('/', optionalAuth, validatePagination, validateLanguage, async (req, res) => {
  try {
    const { page, limit, skip, sort } = req.pagination;
    const { 
      cuisine, 
      category, 
      priceRange,
      city, 
      search, 
      features,
      dietaryOptions
    } = req.query;

    const filter = { isActive: true };

    if (cuisine) {
      const cuisineArray = cuisine.split(',');
      filter.cuisine = { $in: cuisineArray };
    }
    
    if (category) filter.category = category;
    if (priceRange) filter.priceRange = priceRange;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };

    if (search) {
      filter.$or = [
        { [`name.${req.language}`]: { $regex: search, $options: 'i' } },
        { [`description.${req.language}`]: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    if (features) {
      const featureArray = features.split(',');
      filter.features = { $in: featureArray };
    }

    if (dietaryOptions) {
      const dietaryArray = dietaryOptions.split(',');
      filter.dietaryOptions = { $in: dietaryArray };
    }

    const restaurants = await Restaurant.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Restaurant.countDocuments(filter);

    const localizedRestaurants = restaurants.map(rest => ({
      ...rest,
      name: rest.name[req.language] || rest.name.tr,
      description: rest.description[req.language] || rest.description.tr
    }));

    res.json({
      success: true,
      data: {
        restaurants: localizedRestaurants,
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
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Tek restoran detayı
router.get('/:id', validateObjectId(), optionalAuth, validateLanguage, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ 
      _id: req.params.id, 
      isActive: true 
    })
    .populate('createdBy', 'firstName lastName')
    .lean();

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restoran bulunamadı'
      });
    }

    const localizedRestaurant = {
      ...restaurant,
      name: restaurant.name[req.language] || restaurant.name.tr,
      description: restaurant.description[req.language] || restaurant.description.tr
    };

    res.json({
      success: true,
      data: {
        restaurant: localizedRestaurant
      }
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Yeni restoran ekle
router.post('/', authenticateToken, requireModeratorOrAdmin, [
  body('name.tr').notEmpty().withMessage('Türkçe isim zorunludur'),
  body('description.tr').notEmpty().withMessage('Türkçe açıklama zorunludur'),
  body('cuisine').isArray({ min: 1 }).withMessage('En az bir mutfak türü seçiniz'),
  body('category').isIn(['fine-dining', 'casual', 'fast-casual', 'cafe', 'street-food', 'buffet']).withMessage('Geçerli bir kategori seçiniz'),
  body('priceRange').isIn(['budget', 'moderate', 'expensive', 'luxury']).withMessage('Geçerli bir fiyat aralığı seçiniz'),
  body('location.city').notEmpty().withMessage('Şehir zorunludur'),
  body('contact.phone').notEmpty().withMessage('Telefon zorunludur')
], handleValidationErrors, async (req, res) => {
  try {
    const restaurant = new Restaurant({
      ...req.body,
      createdBy: req.user._id
    });

    await restaurant.save();

    const populatedRestaurant = await Restaurant.findById(restaurant._id)
      .populate('createdBy', 'firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Restoran başarıyla eklendi',
      data: {
        restaurant: populatedRestaurant
      }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Restoran güncelle
router.put('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, async (req, res) => {
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body, 
        lastUpdatedBy: req.user._id 
      },
      { new: true, runValidators: true }
    ).populate('createdBy lastUpdatedBy', 'firstName lastName');

    if (!updatedRestaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restoran bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Restoran güncellendi',
      data: {
        restaurant: updatedRestaurant
      }
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

// Restoran sil
router.delete('/:id', validateObjectId(), authenticateToken, requireModeratorOrAdmin, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restoran bulunamadı'
      });
    }

    res.json({
      success: true,
      message: 'Restoran silindi'
    });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
});

export default router; 