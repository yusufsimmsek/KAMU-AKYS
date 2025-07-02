import { validationResult } from 'express-validator';

// Validation sonuçlarını kontrol eden middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation hatası',
      errors: errorMessages
    });
  }
  
  next();
};

// MongoDB ObjectId formatını kontrol eden middleware
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: `Geçersiz ${paramName} formatı`
      });
    }
    
    next();
  };
};

// Sayfalama parametrelerini kontrol eden middleware
export const validatePagination = (req, res, next) => {
  let { page = 1, limit = 10, sort = '-createdAt' } = req.query;
  
  // String'leri number'a çevir
  page = parseInt(page);
  limit = parseInt(limit);
  
  // Geçerli değer kontrolü
  if (isNaN(page) || page < 1) {
    page = 1;
  }
  
  if (isNaN(limit) || limit < 1 || limit > 100) {
    limit = 10;
  }
  
  // Skip değerini hesapla
  const skip = (page - 1) * limit;
  
  // Request objesine ekle
  req.pagination = {
    page,
    limit,
    skip,
    sort
  };
  
  next();
};

// Koordinat formatını kontrol eden middleware
export const validateCoordinates = (req, res, next) => {
  const { latitude, longitude } = req.body.location?.coordinates || {};
  
  if (latitude !== undefined || longitude !== undefined) {
    if (
      typeof latitude !== 'number' || 
      typeof longitude !== 'number' ||
      latitude < -90 || latitude > 90 ||
      longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz koordinat değerleri',
        details: 'Latitude: -90 ile 90 arası, Longitude: -180 ile 180 arası olmalıdır'
      });
    }
  }
  
  next();
};

// Dosya upload validation
export const validateFileUpload = (allowedTypes = ['image/jpeg', 'image/png', 'image/gif'], maxSize = 5 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }
    
    const files = req.files || [req.file];
    
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Desteklenmeyen dosya türü',
          allowedTypes
        });
      }
      
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'Dosya boyutu çok büyük',
          maxSize: `${maxSize / (1024 * 1024)}MB`
        });
      }
    }
    
    next();
  };
};

// Tarih formatını kontrol eden middleware
export const validateDateFormat = (req, res, next) => {
  const dateFields = ['startDate', 'endDate', 'visitDate'];
  
  for (const field of dateFields) {
    if (req.body[field]) {
      const date = new Date(req.body[field]);
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: `Geçersiz tarih formatı: ${field}`,
          example: '2024-01-15T10:30:00.000Z'
        });
      }
    }
  }
  
  next();
};

// Language kodu validation
export const validateLanguage = (req, res, next) => {
  const supportedLanguages = ['tr', 'en', 'de', 'fr', 'ar'];
  const { language } = req.query;
  
  if (language && !supportedLanguages.includes(language)) {
    return res.status(400).json({
      success: false,
      message: 'Desteklenmeyen dil kodu',
      supportedLanguages
    });
  }
  
  // Default language
  req.language = language || 'tr';
  next();
}; 