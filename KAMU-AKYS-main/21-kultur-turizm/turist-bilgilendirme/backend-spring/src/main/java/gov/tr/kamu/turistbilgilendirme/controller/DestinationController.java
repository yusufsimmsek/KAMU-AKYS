package gov.tr.kamu.turistbilgilendirme.controller;

import gov.tr.kamu.turistbilgilendirme.model.Destination;
import gov.tr.kamu.turistbilgilendirme.service.DestinationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Destinasyon Controller
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Tag(name = "Destinations", description = "Turist destinasyonu işlemleri")
@RestController
@RequestMapping("/destinations")
@CrossOrigin(origins = "*")
public class DestinationController {

    private static final Logger logger = LoggerFactory.getLogger(DestinationController.class);

    @Autowired
    private DestinationService destinationService;

    /**
     * Tüm aktif destinasyonları getirme (Public)
     */
    @Operation(summary = "Aktif destinasyonları listele", description = "Sayfalama ile aktif destinasyonları getir")
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getActiveDestinations(
            @Parameter(description = "Sayfa numarası") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Sayfa boyutu") @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Destination> destinations = destinationService.getActiveDestinations(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("destinations", destinations.getContent());
            response.put("currentPage", destinations.getNumber());
            response.put("totalItems", destinations.getTotalElements());
            response.put("totalPages", destinations.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Destinasyonları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyonları getirirken hata oluştu"));
        }
    }

    /**
     * Öne çıkan destinasyonları getirme (Public)
     */
    @Operation(summary = "Öne çıkan destinasyonlar", description = "Öne çıkarılmış destinasyonları getir")
    @GetMapping("/public/featured")
    public ResponseEntity<?> getFeaturedDestinations() {
        try {
            List<Destination> destinations = destinationService.getFeaturedDestinations();
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            logger.error("Öne çıkan destinasyonları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Öne çıkan destinasyonları getirirken hata oluştu"));
        }
    }

    /**
     * ID ile destinasyon getirme (Public)
     */
    @Operation(summary = "Destinasyon detayı", description = "ID ile belirli destinasyonun detayını getir")
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getDestinationById(@PathVariable String id) {
        try {
            return destinationService.getActiveDestinationById(Long.parseLong(id))
                .map(destination -> ResponseEntity.ok(destination))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Destinasyon getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon getirilirken hata oluştu"));
        }
    }

    /**
     * Şehre göre destinasyonları getirme (Public)
     */
    @Operation(summary = "Şehre göre destinasyonlar", description = "Belirli şehirdeki destinasyonları getir")
    @GetMapping("/public/city/{city}")
    public ResponseEntity<Map<String, Object>> getDestinationsByCity(
            @PathVariable String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Destination> destinations = destinationService.getDestinationsByCity(city, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("destinations", destinations.getContent());
            response.put("currentPage", destinations.getNumber());
            response.put("totalItems", destinations.getTotalElements());
            response.put("totalPages", destinations.getTotalPages());
            response.put("city", city);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Şehre göre destinasyonları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Şehre göre destinasyonları getirirken hata oluştu"));
        }
    }

    /**
     * Kategoriye göre destinasyonları getirme (Public)
     */
    @Operation(summary = "Kategoriye göre destinasyonlar", description = "Belirli kategorideki destinasyonları getir")
    @GetMapping("/public/category/{category}")
    public ResponseEntity<Map<String, Object>> getDestinationsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Destination> destinations = destinationService.getDestinationsByCategory(category, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("destinations", destinations.getContent());
            response.put("currentPage", destinations.getNumber());
            response.put("totalItems", destinations.getTotalElements());
            response.put("totalPages", destinations.getTotalPages());
            response.put("category", category);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Kategoriye göre destinasyonları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kategoriye göre destinasyonları getirirken hata oluştu"));
        }
    }

    /**
     * Destinasyon arama (Public)
     */
    @Operation(summary = "Destinasyon arama", description = "İsim veya açıklamada arama yap")
    @GetMapping("/public/search")
    public ResponseEntity<Map<String, Object>> searchDestinations(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Destination> destinations = destinationService.searchDestinations(query, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("destinations", destinations.getContent());
            response.put("currentPage", destinations.getNumber());
            response.put("totalItems", destinations.getTotalElements());
            response.put("totalPages", destinations.getTotalPages());
            response.put("query", query);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Destinasyon arama hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon arama sırasında hata oluştu"));
        }
    }

    /**
     * En yüksek puanlı destinasyonları getirme (Public)
     */
    @Operation(summary = "En yüksek puanlı destinasyonlar", description = "Puana göre sıralanmış destinasyonları getir")
    @GetMapping("/public/top-rated")
    public ResponseEntity<Map<String, Object>> getTopRatedDestinations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Destination> destinations = destinationService.getTopRatedDestinations(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("destinations", destinations.getContent());
            response.put("currentPage", destinations.getNumber());
            response.put("totalItems", destinations.getTotalElements());
            response.put("totalPages", destinations.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("En yüksek puanlı destinasyonları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("En yüksek puanlı destinasyonları getirirken hata oluştu"));
        }
    }

    /**
     * Yakındaki destinasyonları getirme (Public)
     */
    @Operation(summary = "Yakındaki destinasyonlar", description = "Belirtilen konuma yakın destinasyonları getir")
    @GetMapping("/public/nearby")
    public ResponseEntity<?> getNearbyDestinations(
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(defaultValue = "50") Double radiusKm) {
        
        try {
            List<Destination> destinations = destinationService.getNearbyDestinations(latitude, longitude, radiusKm);
            return ResponseEntity.ok(destinations);
        } catch (Exception e) {
            logger.error("Yakındaki destinasyonları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Yakındaki destinasyonları getirirken hata oluştu"));
        }
    }

    // MANAGEMENT ENDPOINTS (ADMIN/MODERATOR)

    /**
     * Yeni destinasyon oluşturma (Admin/Moderator)
     */
    @Operation(summary = "Yeni destinasyon oluştur", description = "Yeni turist destinasyonu ekle")
    @PostMapping("/manage")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> createDestination(@Valid @RequestBody Destination destination) {
        try {
            Destination savedDestination = destinationService.createDestination(destination);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedDestination);
        } catch (Exception e) {
            logger.error("Destinasyon oluşturma hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon oluşturulurken hata oluştu"));
        }
    }

    /**
     * Destinasyon güncelleme (Admin/Moderator)
     */
    @Operation(summary = "Destinasyon güncelle", description = "Mevcut destinasyonu güncelle")
    @PutMapping("/manage/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> updateDestination(@PathVariable String id, @Valid @RequestBody Destination destination) {
        try {
            Destination updatedDestination = destinationService.updateDestination(Long.parseLong(id), destination);
            return ResponseEntity.ok(updatedDestination);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Destinasyon güncelleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon güncellenirken hata oluştu"));
        }
    }

    /**
     * Destinasyon durumu değiştirme (Admin/Moderator)
     */
    @Operation(summary = "Destinasyon durumu değiştir", description = "Destinasyonu aktif/pasif yap")
    @PatchMapping("/manage/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> toggleDestinationStatus(@PathVariable String id) {
        try {
            Destination destination = destinationService.toggleDestinationStatus(Long.parseLong(id));
            return ResponseEntity.ok(destination);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Destinasyon durum değiştirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon durumu değiştirilirken hata oluştu"));
        }
    }

    /**
     * Destinasyon öne çıkarma durumu değiştirme (Admin/Moderator)
     */
    @Operation(summary = "Öne çıkarma durumu değiştir", description = "Destinasyonu öne çıkar/çıkarma")
    @PatchMapping("/manage/{id}/toggle-featured")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> toggleFeaturedStatus(@PathVariable String id) {
        try {
            Destination destination = destinationService.toggleFeaturedStatus(Long.parseLong(id));
            return ResponseEntity.ok(destination);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Destinasyon öne çıkarma durumu değiştirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon öne çıkarma durumu değiştirilirken hata oluştu"));
        }
    }

    /**
     * Destinasyon silme (Admin only)
     */
    @Operation(summary = "Destinasyon sil", description = "Destinasyonu sil (soft delete)")
    @DeleteMapping("/manage/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDestination(@PathVariable String id) {
        try {
            destinationService.deleteDestination(Long.parseLong(id));
            return ResponseEntity.ok(createSuccessResponse("Destinasyon başarıyla silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Destinasyon silme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon silinirken hata oluştu"));
        }
    }

    /**
     * Destinasyon istatistikleri (Admin/Moderator)
     */
    @Operation(summary = "Destinasyon istatistikleri", description = "Destinasyon sayıları ve istatistikleri")
    @GetMapping("/manage/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> getDestinationStats() {
        try {
            DestinationService.DestinationStats stats = destinationService.getDestinationStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Destinasyon istatistikleri getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Destinasyon istatistikleri getirilirken hata oluştu"));
        }
    }

    /**
     * Hata response'u oluşturma
     */
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("error", message);
        return error;
    }

    /**
     * Başarı response'u oluşturma
     */
    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> success = new HashMap<>();
        success.put("message", message);
        return success;
    }
} 