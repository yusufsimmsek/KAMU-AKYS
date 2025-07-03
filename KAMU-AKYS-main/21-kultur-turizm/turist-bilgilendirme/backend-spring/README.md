# 🏛️ Turist Bilgilendirme Backend API (Spring Boot)

## 📋 Proje Özeti

Node.js'den Spring Boot'a geçirilen güçlü ve ölçeklenebilir Turist Bilgilendirme Sistemi backend API'si.

## 🚀 Teknolojiler

- **Framework:** Spring Boot 3.2.0
- **Java Sürümü:** 17
- **Veritabanı:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Token)
- **API Dokümantasyonu:** OpenAPI 3.0 (Swagger)
- **Build Tool:** Maven
- **Password Encoding:** BCrypt

## 📦 Özellikler

### ✅ Tamamlanan Bileşenler

1. **🔐 Authentication & Security**
   - JWT Token tabanlı authentication
   - BCrypt ile şifre encryption
   - Role-based access control (USER, ADMIN, MODERATOR)
   - Spring Security configuration
   - CORS configuration

2. **👤 User Management**
   - User registration/login
   - Profile management
   - Role management
   - Password change
   - User statistics

3. **🏛️ Core Entities**
   - User (Kullanıcı)
   - Destination (Destinasyon)
   - [Diğer entity'ler eklenecek]

4. **🗃️ Database Layer**
   - MongoDB integration
   - Spring Data MongoDB
   - Custom repository methods
   - Indexing support

5. **📚 API Documentation**
   - Swagger UI integration
   - OpenAPI 3.0 specification
   - Interactive API testing

## 🏗️ Proje Yapısı

```
src/
├── main/
│   ├── java/gov/tr/kamu/turistbilgilendirme/
│   │   ├── TuristBilgilendirmeApplication.java    # Main class
│   │   ├── config/
│   │   │   └── SecurityConfig.java                # Security configuration
│   │   ├── controller/
│   │   │   └── AuthController.java                # Authentication endpoints
│   │   ├── model/
│   │   │   ├── User.java                         # User entity
│   │   │   └── Destination.java                  # Destination entity
│   │   ├── repository/
│   │   │   ├── UserRepository.java               # User data access
│   │   │   └── DestinationRepository.java        # Destination data access
│   │   ├── security/
│   │   │   ├── JwtAuthenticationFilter.java      # JWT filter
│   │   │   └── JwtTokenUtil.java                 # JWT utilities
│   │   └── service/
│   │       └── UserService.java                  # User business logic
│   └── resources/
│       └── application.properties                # Configuration
└── test/
    └── java/gov/tr/kamu/turistbilgilendirme/     # Test classes
```

## ⚙️ Konfigürasyon

### MongoDB Bağlantısı
```properties
spring.data.mongodb.uri=mongodb+srv://csfsmk:cfJAUtq1bHh8aKKn@cluster0.bk8vupw.mongodb.net/turist_bilgilendirme?retryWrites=true&w=majority&appName=Cluster0
```

### Server Ayarları
```properties
server.port=8080
server.servlet.context-path=/api
```

### JWT Ayarları
```properties
jwt.secret=turist-bilgilendirme-super-secret-key-2024-spring-boot
jwt.expiration=604800000
```

## 🛠️ Geliştirme

### Gereksinimler
- Java 17+
- Maven 3.6+
- MongoDB Atlas account

### Projeyi Çalıştırma

1. **Bağımlılıkları yükle:**
   ```bash
   ./mvnw clean install
   ```

2. **Uygulamayı başlat:**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **API'ye erişim:**
   - Base URL: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/swagger-ui.html
   - Health Check: http://localhost:8080/actuator/health

## 🔗 API Endpoints

### 🔐 Authentication
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/register` - Kullanıcı kaydı  
- `POST /auth/refresh` - Token yenileme

### 👤 User Management
- `GET /users/profile` - Profil bilgileri
- `PUT /users/profile` - Profil güncelleme
- `POST /users/change-password` - Şifre değiştirme

### 🏛️ Destinations (Gelecekte eklenecek)
- `GET /destinations/public` - Genel destinasyonlar
- `POST /destinations` - Yeni destinasyon ekleme
- `PUT /destinations/{id}` - Destinasyon güncelleme

## 🔜 Gelecek Özellikler

- [ ] DestinationController ve Service
- [ ] Event Management (Etkinlik Yönetimi)
- [ ] Restaurant Management (Restoran Yönetimi)
- [ ] Accommodation Management (Konaklama Yönetimi)
- [ ] Review System (Yorum Sistemi)
- [ ] File Upload (Dosya Yükleme)
- [ ] Email Service (Email Servisi)
- [ ] Notification System (Bildirim Sistemi)
- [ ] Search & Filter (Arama ve Filtreleme)
- [ ] Geolocation Services (Konum Servisleri)
- [ ] Admin Dashboard APIs
- [ ] Rate Limiting
- [ ] Caching (Redis)
- [ ] Unit & Integration Tests

## 🐛 Bilinen Sorunlar

1. MongoDB Atlas IP whitelist problemi (çözüm: IP'yi whitelist'e eklenmeli)
2. Maven wrapper eksik dependency'ler (çözüm: Maven kurulumu)

## 🤝 Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 İletişim

**Proje:** Kamu AKYS - Turist Bilgilendirme Sistemi  
**Framework:** Spring Boot 3.2.0  
**Durum:** Development

---

⚡ **Spring Boot ile güçlü, ölçeklenebilir ve modern bir backend API!** 