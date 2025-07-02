import dotenv from 'dotenv';

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/turist-bilgilendirme',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'turist-bilgilendirme-super-secret-key-2024',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  
  // Weather API
  WEATHER_API_KEY: process.env.WEATHER_API_KEY || '',
  
  // File upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/gif'],
  
  // Email
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@turistbilgilendirme.gov.tr',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || ''
}; 