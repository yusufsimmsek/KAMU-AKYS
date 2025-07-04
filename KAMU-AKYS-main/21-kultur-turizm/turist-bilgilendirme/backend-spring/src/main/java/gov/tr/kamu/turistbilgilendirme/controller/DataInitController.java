package gov.tr.kamu.turistbilgilendirme.controller;

import gov.tr.kamu.turistbilgilendirme.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/data")
@CrossOrigin(origins = "*")
public class DataInitController {

    @Autowired
    private DestinationRepository destinationRepository;

   /* @PostMapping("/init-ayasofya")
    public ResponseEntity<Map<String, Object>> initAyasofyaData() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Ayasofya zaten var mı kontrol et
            Optional<Destination> existingAyasofya = destinationRepository.findByName("Ayasofya Camii");
            
            if (existingAyasofya.isPresent()) {
                response.put("status", "already_exists");
                response.put("message", "Ayasofya verisi zaten mevcut");
                response.put("data", existingAyasofya.get());
                return ResponseEntity.ok(response);
            }

            // Yeni Ayasofya verisi oluştur
            Destination ayasofya = new Destination();
            ayasofya.setName("Ayasofya Camii");
            ayasofya.setDescription("Ayasofya, Bizans ve Osmanlı dönemlerinin izlerini taşıyan tarihi bir yapıdır. " +
                    "537 yılında İmparator Justinianus tarafından inşa ettirilen bu muhteşem yapı, bin yıl boyunca " +
                    "dünyanın en büyük kilisesi olma özelliğini korumuştur. 1453 yılında İstanbul'un fethinden sonra " +
                    "camiye çevrilmiş, Osmanlı mimarisinin de etkisiyle bugünkü görünümüne kavuşmuştur. " +
                    "UNESCO Dünya Mirası Listesi'nde yer alan Ayasofya, benzersiz mimarisi, tarihi önemi ve " +
                    "kültürel değeriyle dünyanın en önemli anıtları arasında yer almaktadır.");
            ayasofya.setShortDescription("Bizans ve Osmanlı dönemlerinin izlerini taşıyan tarihi cami ve müze.");
            ayasofya.setCategory("Tarihi Yer");
            ayasofya.setCity("İstanbul");
            ayasofya.setDistrict("Fatih");
            ayasofya.setRegion("Marmara");

            // Location JSON
            Map<String, Double> location = new HashMap<>();
            location.put("latitude", 41.0086);
            location.put("longitude", 28.9802);
            ayasofya.setLocationJson(location);

            // Images
            ayasofya.setImages(Arrays.asList(
                    "https://example.com/images/ayasofya1.jpg",
                    "https://example.com/images/ayasofya2.jpg",
                    "https://example.com/images/ayasofya3.jpg"
            ));

            // Contact info
            Map<String, String> contact = new HashMap<>();
            contact.put("phone", "+90 212 522 17 50");
            contact.put("email", "info@ayasofya.gov.tr");
            contact.put("website", "https://ayasofyacamii.gov.tr");
            ayasofya.setContactJson(contact);

            // Visiting info
            Map<String, String> visitingInfo = new HashMap<>();
            visitingInfo.put("openingHours", "Namaz saatleri dışında ziyaret edilebilir");
            visitingInfo.put("ticketPrice", "Ücretsiz");
            visitingInfo.put("closedDays", "Özel günler hariç her gün açık");
            visitingInfo.put("guidedTours", "Rehberli turlar mevcuttur");
            ayasofya.setVisitingInfoJson(visitingInfo);

            // Accessibility
            Map<String, Boolean> accessibility = new HashMap<>();
            accessibility.put("wheelchairAccessible", true);
            accessibility.put("audioGuideAvailable", true);
            accessibility.put("brailleSignage", false);
            accessibility.put("wheelchairRamp", true);
            accessibility.put("elevatorAccess", false);
            ayasofya.setAccessibilityJson(accessibility);

            // Translations
            Map<String, String> translations = new HashMap<>();
            translations.put("en_name", "Hagia Sophia Mosque");
            translations.put("en_description", "Hagia Sophia is a historic structure reflecting Byzantine and Ottoman eras, serving as a mosque today.");
            translations.put("ar_name", "جامع آيا صوفيا");
            translations.put("ar_description", "آيا صوفيا هو مبنى تاريخي يعكس فترتي البيزنطية والعثمانية، ويعمل كمسجد اليوم.");
            translations.put("de_name", "Hagia Sophia Moschee");
            translations.put("de_description", "Die Hagia Sophia ist ein historisches Bauwerk, das byzantinische und osmanische Epochen widerspiegelt.");
            translations.put("fr_name", "Mosquée Sainte-Sophie");
            translations.put("fr_description", "Sainte-Sophie est une structure historique reflétant les époques byzantine et ottomane.");
            ayasofya.setTranslationsJson(translations);

            // Tags
            ayasofya.setTags(Arrays.asList(
                    "tarihi", "cami", "müze", "bizans", "osmanlı", 
                    "unesco", "istanbul", "fatih", "mimar sinan", "sultan ahmet"
            ));

            // Rating and stats
            ayasofya.setRating(4.8);
            ayasofya.setReviewCount(1245);
            ayasofya.setActive(true);
            ayasofya.setFeatured(true);
            ayasofya.setCreatedAt(LocalDateTime.now());
            ayasofya.setUpdatedAt(LocalDateTime.now());

            // Veritabanına kaydet
            Destination savedAyasofya = destinationRepository.save(ayasofya);

            response.put("status", "success");
            response.put("message", "Ayasofya verisi başarıyla eklendi");
            response.put("data", savedAyasofya);
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Veri eklenirken hata oluştu: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }*/

    @GetMapping("/destinations/count")
    public ResponseEntity<Map<String, Object>> getDestinationCount() {
        Map<String, Object> response = new HashMap<>();
        try {
            long count = destinationRepository.count();
            response.put("status", "success");
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/destinations/all")
    public ResponseEntity<Map<String, Object>> getAllDestinations() {
        Map<String, Object> response = new HashMap<>();
        try {
            var destinations = destinationRepository.findAll();
            response.put("status", "success");
            response.put("data", destinations);
            response.put("count", destinations.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
} 