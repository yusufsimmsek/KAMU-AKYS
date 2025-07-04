-- Ayasofya Camii verisi ekleme
INSERT INTO destinations (
    name,
    description,
    short_description,
    category,
    city,
    district,
    region,
    location,
    images,
    contact,
    visiting_info,
    accessibility,
    rating,
    review_count,
    translations,
    tags,
    is_active,
    is_featured,
    created_at,
    updated_at
) VALUES (
    'Ayasofya Camii',
    'Ayasofya, Bizans ve Osmanlı dönemlerinin izlerini taşıyan tarihi bir yapıdır. 537 yılında İmparator Justinianus tarafından inşa ettirilen bu muhteşem yapı, bin yıl boyunca dünyanın en büyük kilisesi olma özelliğini korumuştur. 1453 yılında İstanbul''un fethinden sonra camiye çevrilmiş, Osmanlı mimarisinin de etkisiyle bugünkü görünümüne kavuşmuştur. UNESCO Dünya Mirası Listesi''nde yer alan Ayasofya, benzersiz mimarisi, tarihi önemi ve kültürel değeriyle dünyanın en önemli anıtları arasında yer almaktadır.',
    'Bizans ve Osmanlı dönemlerinin izlerini taşıyan tarihi cami ve müze.',
    'Tarihi Yer',
    'İstanbul',
    'Fatih',
    'Marmara',
    '{"latitude": 41.0086, "longitude": 28.9802}',
    ARRAY['https://example.com/images/ayasofya1.jpg', 'https://example.com/images/ayasofya2.jpg', 'https://example.com/images/ayasofya3.jpg'],
    '{"phone": "+90 212 522 17 50", "email": "info@ayasofya.gov.tr", "website": "https://ayasofyacamii.gov.tr"}',
    '{"openingHours": "Namaz saatleri dışında ziyaret edilebilir", "ticketPrice": "Ücretsiz", "closedDays": "Özel günler hariç her gün açık", "guidedTours": "Rehberli turlar mevcuttur"}',
    '{"wheelchairAccessible": true, "audioGuideAvailable": true, "brailleSignage": false, "wheelchairRamp": true, "elevatorAccess": false}',
    4.8,
    1245,
    '{"en_name": "Hagia Sophia Mosque", "en_description": "Hagia Sophia is a historic structure reflecting Byzantine and Ottoman eras, serving as a mosque today.", "ar_name": "جامع آيا صوفيا", "ar_description": "آيا صوفيا هو مبنى تاريخي يعكس فترتي البيزنطية والعثمانية، ويعمل كمسجد اليوم.", "de_name": "Hagia Sophia Moschee", "de_description": "Die Hagia Sophia ist ein historisches Bauwerk, das byzantinische und osmanische Epochen widerspiegelt.", "fr_name": "Mosquée Sainte-Sophie", "fr_description": "Sainte-Sophie est une structure historique reflétant les époques byzantine et ottomane."}',
    ARRAY['tarihi', 'cami', 'müze', 'bizans', 'osmanlı', 'unesco', 'istanbul', 'fatih', 'mimar sinan', 'sultan ahmet'],
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (name) DO NOTHING;

-- Eğer destinations tablosu yoksa, önce tablo oluşturma komutları
CREATE TABLE IF NOT EXISTS destinations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    category VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    region VARCHAR(100),
    location JSONB,
    images TEXT[],
    contact JSONB,
    visiting_info JSONB,
    accessibility JSONB,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    translations JSONB,
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_destinations_city ON destinations(city);
CREATE INDEX IF NOT EXISTS idx_destinations_category ON destinations(category);
CREATE INDEX IF NOT EXISTS idx_destinations_rating ON destinations(rating);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(is_featured);
CREATE INDEX IF NOT EXISTS idx_destinations_active ON destinations(is_active); 