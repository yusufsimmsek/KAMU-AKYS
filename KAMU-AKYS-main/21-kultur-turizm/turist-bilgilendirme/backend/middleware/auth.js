import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { config } from '../config/config.js';

// Token doğrulama middleware'i
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Erişim token\'ı bulunamadı'
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Hesabınız devre dışı bırakılmış'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token süresi dolmuş'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz token'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Sunucu hatası'
    });
  }
};

// Optional authentication - token varsa doğrula, yoksa devam et
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Optional auth'da hata olursa sadece devam et, kullanıcı null kalır
    next();
  }
};

// Admin yetkisi kontrolü
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Giriş yapmanız gerekiyor'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bu işlem için admin yetkisi gerekiyor'
    });
  }

  next();
};

// Moderator veya Admin yetkisi kontrolü
export const requireModeratorOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Giriş yapmanız gerekiyor'
    });
  }

  if (!['admin', 'moderator'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Bu işlem için moderator veya admin yetkisi gerekiyor'
    });
  }

  next();
};

// Kullanıcının kendi içeriğini düzenlemesi veya admin/moderator yetkisi
export const requireOwnershipOrModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Giriş yapmanız gerekiyor'
    });
  }

  // Admin ve moderator her zaman yapabilir
  if (['admin', 'moderator'].includes(req.user.role)) {
    return next();
  }

  // req.resource objesinde createdBy varsa kontrol et
  if (req.resource && req.resource.createdBy) {
    if (req.resource.createdBy.toString() === req.user._id.toString()) {
      return next();
    }
  }

  return res.status(403).json({
    success: false,
    message: 'Bu işlem için yetkiniz bulunmuyor'
  });
}; 