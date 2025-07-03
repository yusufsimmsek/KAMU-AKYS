import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Event from '../models/Event.js';
import Restaurant from '../models/Restaurant.js';
import Accommodation from '../models/Accommodation.js';
import Review from '../models/Review.js';
import { config } from '../config/config.js';

// MongoDB'e bağlan
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Örnek kullanıcılar oluştur
const createUsers = async () => {
  try {
    const users = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@turistbilgilendirme.gov.tr',
        password: 'Admin123!',
        role: 'admin'
      },
      {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet.yilmaz@example.com',
        password: 'User123!',
        role: 'user',
        preferences: {
          language: 'tr',
          notifications: {
            email: true,
            events: true
          }
        }
      },
      {
        firstName: 'Mehmet',
        lastName: 'Demir',
        email: 'mehmet.demir@example.com',
        password: 'User123!',
        role: 'moderator'
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('✅ Kullanıcılar oluşturuldu:', createdUsers.length);
    return createdUsers;
  } catch (error) {
    console.error('❌ Kullanıcı oluşturma hatası:', error);
  }
};

// Örnek destinasyonlar oluştur
const createDestinations = async (adminUser) => {
  try {
    const destinations = [
      {
        name: {
          tr: 'Ayasofya Camii',
          en: 'Hagia Sophia Mosque',
          de: 'Hagia Sophia Moschee'
        },
        description: {
          tr: 'İstanbul\'un en ünlü tarihi yapılarından biri olan Ayasofya...',
          en: 'Hagia Sophia is one of the most famous historical buildings in Istanbul...'
        },
        category: 'historical',
        location: {
          city: 'İstanbul',
          district: 'Fatih',
          address: 'Sultan Ahmet, Ayasofya Meydanı No:1',
          coordinates: {
            latitude: 41.0086,
            longitude: 28.9802
          }
        },
        images: [
          {
            url: 'https://example.com/ayasofya1.jpg',
            caption: { tr: 'Ayasofya dış görünümü' },
            isPrimary: true
          }
        ],
        visitInfo: {
          entrance: {
            fee: 0,
            currency: 'TRY'
          },
          duration: '2hours',
          bestTimeToVisit: ['spring', 'autumn'],
          accessibility: {
            wheelchairAccessible: true,
            audioGuide: true
          }
        },
        amenities: ['parking', 'restroom', 'wifi'],
        tags: ['family_friendly', 'educational', 'religious'],
        createdBy: adminUser._id
      },
      {
        name: {
          tr: 'Kapadokya',
          en: 'Cappadocia'
        },
        description: {
          tr: 'Peri bacaları ve balon turlarıyla ünlü doğal harika...',
          en: 'Famous natural wonder with fairy chimneys and balloon tours...'
        },
        category: 'natural',
        location: {
          city: 'Nevşehir',
          district: 'Göreme',
          address: 'Göreme Milli Parkı',
          coordinates: {
            latitude: 38.6431,
            longitude: 34.8287
          }
        },
        visitInfo: {
          entrance: {
            fee: 45,
            currency: 'TRY'
          },
          duration: 'fullday',
          bestTimeToVisit: ['spring', 'summer', 'autumn']
        },
        tags: ['adventure', 'romantic', 'photography'],
        createdBy: adminUser._id
      }
    ];

    const createdDestinations = await Destination.insertMany(destinations);
    console.log('✅ Destinasyonlar oluşturuldu:', createdDestinations.length);
    return createdDestinations;
  } catch (error) {
    console.error('❌ Destinasyon oluşturma hatası:', error);
  }
};

// Örnek etkinlikler oluştur
const createEvents = async (adminUser) => {
  try {
    const events = [
      {
        title: {
          tr: 'İstanbul Film Festivali',
          en: 'Istanbul Film Festival'
        },
        description: {
          tr: 'Yılın en büyük film festivali...',
          en: 'The biggest film festival of the year...'
        },
        category: 'cultural',
        type: 'paid',
        dates: {
          start: new Date('2024-04-15'),
          end: new Date('2024-04-25'),
          isRecurring: true,
          recurringPattern: 'yearly'
        },
        time: {
          start: '19:00',
          end: '22:00'
        },
        location: {
          venue: 'Zorlu Center PSM',
          address: 'Levazım, Koru Sk. No:2',
          city: 'İstanbul',
          district: 'Beşiktaş',
          coordinates: {
            latitude: 41.0658,
            longitude: 29.0097
          }
        },
        organizer: {
          name: 'İstanbul Kültür Sanat Vakfı',
          contact: {
            phone: '+90 212 334 07 00',
            email: 'info@iksv.org',
            website: 'https://film.iksv.org'
          }
        },
        pricing: {
          isFree: false,
          price: {
            amount: 75,
            currency: 'TRY'
          },
          discounts: [
            {
              type: 'student',
              percentage: 25,
              description: 'Öğrenci indirimi'
            }
          ]
        },
        capacity: {
          max: 500,
          registered: 0,
          isLimited: true
        },
        tags: ['cultural', 'art', 'entertainment'],
        createdBy: adminUser._id
      }
    ];

    const createdEvents = await Event.insertMany(events);
    console.log('✅ Etkinlikler oluşturuldu:', createdEvents.length);
    return createdEvents;
  } catch (error) {
    console.error('❌ Etkinlik oluşturma hatası:', error);
  }
};

// Örnek restoranlar oluştur
const createRestaurants = async (adminUser) => {
  try {
    const restaurants = [
      {
        name: {
          tr: 'Pandeli',
          en: 'Pandeli Restaurant'
        },
        description: {
          tr: 'Geleneksel Osmanlı mutfağının en güzel örnekleri...',
          en: 'The finest examples of traditional Ottoman cuisine...'
        },
        cuisine: ['turkish', 'ottoman'],
        category: 'fine-dining',
        priceRange: 'expensive',
        location: {
          address: 'Eminönü, Mısır Çarşısı No:1',
          city: 'İstanbul',
          district: 'Fatih',
          coordinates: {
            latitude: 41.0166,
            longitude: 28.9706
          }
        },
        contact: {
          phone: '+90 212 527 39 09',
          website: 'https://pandeli.com.tr'
        },
        openingHours: {
          monday: { open: '12:00', close: '17:00' },
          tuesday: { open: '12:00', close: '17:00' },
          wednesday: { open: '12:00', close: '17:00' },
          thursday: { open: '12:00', close: '17:00' },
          friday: { open: '12:00', close: '17:00' },
          saturday: { open: '12:00', close: '17:00' },
          sunday: { isClosed: true }
        },
        features: ['historic-building', 'romantic'],
        services: ['reservation', 'valet-parking'],
        dietaryOptions: ['halal'],
        specialties: [
          {
            name: { tr: 'Kuzu Tandir', en: 'Lamb Tandoor' },
            description: { tr: 'Geleneksel tandır fırınında pişirilmiş kuzu' },
            price: 285,
            currency: 'TRY'
          }
        ],
        createdBy: adminUser._id
      }
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    console.log('✅ Restoranlar oluşturuldu:', createdRestaurants.length);
    return createdRestaurants;
  } catch (error) {
    console.error('❌ Restoran oluşturma hatası:', error);
  }
};

// Tüm örnek verileri oluştur
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Veritabanı tohum verisi oluşturuluyor...\n');
    
    // Mevcut verileri temizle
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Event.deleteMany({});
    await Restaurant.deleteMany({});
    await Accommodation.deleteMany({});
    await Review.deleteMany({});
    
    console.log('🗑️  Mevcut veriler temizlendi\n');
    
    // Yeni veriler oluştur
    const users = await createUsers();
    const adminUser = users.find(user => user.role === 'admin');
    
    await createDestinations(adminUser);
    await createEvents(adminUser);
    await createRestaurants(adminUser);
    
    console.log('\n✅ Tüm örnek veriler başarıyla oluşturuldu!');
    console.log('\n📊 Oluşturulan veriler:');
    console.log(`👥 Kullanıcılar: ${await User.countDocuments()}`);
    console.log(`📍 Destinasyonlar: ${await Destination.countDocuments()}`);
    console.log(`🎭 Etkinlikler: ${await Event.countDocuments()}`);
    console.log(`🍽️  Restoranlar: ${await Restaurant.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Tohum verisi oluşturma hatası:', error);
    process.exit(1);
  }
};

// Script'i direkt çalıştırma
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase, createUsers, createDestinations, createEvents, createRestaurants }; 