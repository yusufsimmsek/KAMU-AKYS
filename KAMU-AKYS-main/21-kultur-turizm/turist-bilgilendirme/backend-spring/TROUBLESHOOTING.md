# Turist Bilgilendirme Spring Boot Backend - Troubleshooting Guide

## 🚨 500 Internal Server Error - Çözüm Kılavuzu

### 📋 Problem Tanımı
`http://localhost:8080/api/auth/register` endpoint'inde 500 Internal Server Error alıyorsunuz.

### 🔍 Tespit Edilen Sorunlar

#### 1. **Bellek Sorunu (Memory Issue)**
- JVM çok düşük bellek ayarlarıyla çalışıyor: `-Xms64m -Xmx512m`
- Hata logları: "insufficient memory for the Java Runtime Environment"
- Spring Boot 3.x + JDK 17 için bu ayarlar yetersiz

#### 2. **Eksik Security Konfigürasyonu**
- `SecurityConfig.java` dosyası boş
- Spring Security konfigürasyonu eksik
- Authentication/Authorization çalışmıyor

#### 3. **Veritabanı Bağlantı Sorunu**
- PostgreSQL bağlantısı kurulamıyor
- Veritabanı servisi çalışmıyor

---

## ✅ Çözüm Adımları

### 1. **Bellek Ayarlarını Düzeltme**

#### Windows için:
```batch
# run.bat dosyasını kullanın
.\run.bat
```

#### Linux/Mac için:
```bash
# run.sh dosyasını kullanın
chmod +x run.sh
./run.sh
```

#### Manuel çalıştırma:
```bash
# Daha iyi bellek ayarlarıyla çalıştırma
export JAVA_OPTS="-Xms1g -Xmx2g -XX:+UseG1GC"
./mvnw spring-boot:run -Dspring-boot.run.jvmArguments="$JAVA_OPTS"
```

### 2. **Geliştirme Ortamında H2 Database Kullanma**

Development profile ile çalıştırın:
```bash
# H2 in-memory database ile çalıştırma
./mvnw spring-boot:run -Dspring.profiles.active=dev
```

### 3. **PostgreSQL Kullanmak İçin**

Docker ile PostgreSQL çalıştırın:
```bash
# PostgreSQL konteynerini başlatma
docker-compose up -d postgres

# Veritabanının hazır olduğunu kontrol etme
docker-compose logs postgres

# Uygulamayı production profile ile çalıştırma
./mvnw spring-boot:run -Dspring.profiles.active=prod
```

---

## 🔧 Test ve Doğrulama

### 1. **Uygulama Başlatma Kontrolü**
```bash
# Health check
curl http://localhost:8080/actuator/health

# Swagger UI
# http://localhost:8080/swagger-ui.html
```

### 2. **Kullanıcı Kaydı Testi**
```bash
# Kullanıcı kaydı
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "123456"
  }'
```

### 3. **Giriş Testi**
```bash
# Kullanıcı girişi
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```

---

## 🗂️ Yapılan Değişiklikler

### ✅ Düzeltilen Dosyalar:
1. `SecurityConfig.java` - Spring Security konfigürasyonu eklendi
2. `JwtAuthenticationEntryPoint.java` - JWT auth entry point eklendi
3. `application-dev.properties` - H2 database konfigürasyonu
4. `data.sql` - Sample data dosyası
5. `run.bat` / `run.sh` - Optimized JVM startup scripts
6. `docker-compose.yml` - PostgreSQL setup
7. `TROUBLESHOOTING.md` - Bu dosya

### 📋 Yeni Özellikler:
- **H2 Console**: `http://localhost:8080/h2-console`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **Health Check**: `http://localhost:8080/actuator/health`
- **API Docs**: `http://localhost:8080/api-docs`

---

## 🚀 Hızlı Başlangıç

1. **Geliştirme ortamında çalıştırma:**
   ```bash
   # Windows
   .\run.bat
   
   # Linux/Mac
   ./run.sh
   ```

2. **PostgreSQL ile çalıştırma:**
   ```bash
   # Docker ile database başlatma
   docker-compose up -d postgres
   
   # Uygulamayı çalıştırma
   ./mvnw spring-boot:run -Dspring.profiles.active=prod
   ```

3. **Test hesapları:**
   - **Admin**: `admin@turistbilgilendirme.gov.tr` / `admin123`
   - **User**: `test@example.com` / `user123`

---

## 📞 İletişim

Sorun devam ederse:
1. Console loglarını kontrol edin
2. `http://localhost:8080/actuator/health` endpoint'ini kontrol edin
3. JVM memory kullanımını kontrol edin
4. Database bağlantısını kontrol edin

**Başarılar!** 🎉 