package gov.tr.kamu.turistbilgilendirme.service;

import gov.tr.kamu.turistbilgilendirme.model.Destination;
import gov.tr.kamu.turistbilgilendirme.repository.DestinationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Destinasyon Service Sınıfı
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Service
public class DestinationService {

    private static final Logger logger = LoggerFactory.getLogger(DestinationService.class);

    @Autowired
    private DestinationRepository destinationRepository;

    /**
     * Yeni destinasyon oluşturma
     */
    public Destination createDestination(Destination destination) {
        logger.info("Yeni destinasyon oluşturuluyor: {}", destination.getName());

        destination.setActive(true);
        destination.setCreatedAt(LocalDateTime.now());
        destination.setRating(0.0);
        destination.setReviewCount(0);

        Destination savedDestination = destinationRepository.save(destination);
        logger.info("Destinasyon başarıyla oluşturuldu: {}", savedDestination.getId());
        
        return savedDestination;
    }

    /**
     * Destinasyon güncelleme
     */
    public Destination updateDestination(Long id, Destination destinationDetails) {
        logger.info("Destinasyon güncelleniyor: {}", id);

        Destination destination = getDestinationById(id);

        // Güncellenebilir alanlar
        if (destinationDetails.getName() != null) {
            destination.setName(destinationDetails.getName());
        }
        if (destinationDetails.getDescription() != null) {
            destination.setDescription(destinationDetails.getDescription());
        }
        if (destinationDetails.getShortDescription() != null) {
            destination.setShortDescription(destinationDetails.getShortDescription());
        }
        if (destinationDetails.getCategory() != null) {
            destination.setCategory(destinationDetails.getCategory());
        }
        if (destinationDetails.getLocation() != null) {
            destination.setLocation(destinationDetails.getLocation());
        }
        if (destinationDetails.getImages() != null) {
            destination.setImages(destinationDetails.getImages());
        }
        if (destinationDetails.getContact() != null) {
            destination.setContact(destinationDetails.getContact());
        }
        if (destinationDetails.getVisitingInfo() != null) {
            destination.setVisitingInfo(destinationDetails.getVisitingInfo());
        }
        if (destinationDetails.getAccessibility() != null) {
            destination.setAccessibility(destinationDetails.getAccessibility());
        }
        if (destinationDetails.getTags() != null) {
            destination.setTags(destinationDetails.getTags());
        }

        destination.setUpdatedAt(LocalDateTime.now());

        Destination updatedDestination = destinationRepository.save(destination);
        logger.info("Destinasyon başarıyla güncellendi: {}", id);
        
        return updatedDestination;
    }

    /**
     * ID ile destinasyon bulma
     */
    public Destination getDestinationById(Long id) {
        return destinationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Destinasyon bulunamadı: " + id));
    }

    /**
     * Aktif destinasyon bulma
     */
    public Optional<Destination> getActiveDestinationById(Long id) {
        Destination destination = getDestinationById(id);
        return destination.isActive() ? Optional.of(destination) : Optional.empty();
    }

    /**
     * Tüm aktif destinasyonları getirme
     */
    public List<Destination> getAllActiveDestinations() {
        return destinationRepository.findByIsActiveTrue();
    }

    /**
     * Sayfalama ile destinasyonları getirme
     */
    public Page<Destination> getDestinations(Pageable pageable) {
        return destinationRepository.findAll(pageable);
    }

    /**
     * Aktif destinasyonları sayfalama ile getirme
     */
    public Page<Destination> getActiveDestinations(Pageable pageable) {
        return destinationRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
    }

    /**
     * Öne çıkan destinasyonları getirme
     */
    public List<Destination> getFeaturedDestinations() {
        return destinationRepository.findByIsFeaturedTrueAndIsActiveTrue();
    }

    /**
     * Şehre göre destinasyonları getirme
     */
    public Page<Destination> getDestinationsByCity(String city, Pageable pageable) {
        return destinationRepository.findByCityAndIsActiveTrue(city, pageable);
    }

    /**
     * Kategoriye göre destinasyonları getirme
     */
    public Page<Destination> getDestinationsByCategory(String category, Pageable pageable) {
        return destinationRepository.findByCategoryAndIsActiveTrue(category, pageable);
    }

    /**
     * Destinasyon arama
     */
    public Page<Destination> searchDestinations(String searchTerm, Pageable pageable) {
        return destinationRepository.findBySearchTerm(searchTerm, pageable);
    }

    /**
     * Tag'e göre destinasyonları getirme
     */
    public Page<Destination> getDestinationsByTag(String tag, Pageable pageable) {
        return destinationRepository.findByTagsContaining(tag, pageable);
    }

    /**
     * En yüksek puanlı destinasyonları getirme
     */
    public Page<Destination> getTopRatedDestinations(Pageable pageable) {
        return destinationRepository.findByIsActiveTrueOrderByRatingDescReviewCountDesc(pageable);
    }

    /**
     * Popüler destinasyonları getirme
     */
    public Page<Destination> getPopularDestinations(Pageable pageable) {
        return destinationRepository.findByIsActiveTrueOrderByReviewCountDesc(pageable);
    }

    /**
     * Yakındaki destinasyonları bulma
     */
    public List<Destination> getNearbyDestinations(Double latitude, Double longitude, Double radiusKm) {
        // Basit yaklaşım - daha detaylı geo-spatial queries için MongoDB'nin geo features kullanılabilir
        Double latRange = radiusKm / 111.0; // Yaklaşık 1 derece = 111 km
        Double lngRange = radiusKm / (111.0 * Math.cos(Math.toRadians(latitude)));

        Double minLat = latitude - latRange;
        Double maxLat = latitude + latRange;
        Double minLng = longitude - lngRange;
        Double maxLng = longitude + lngRange;

        return destinationRepository.findByLocationNear(minLat, maxLat, minLng, maxLng);
    }

    /**
     * Destinasyon aktif/pasif yapma
     */
    public Destination toggleDestinationStatus(Long id) {
        logger.info("Destinasyon durumu değiştiriliyor: {}", id);

        Destination destination = getDestinationById(id);
        destination.setActive(!destination.isActive());
        destination.setUpdatedAt(LocalDateTime.now());

        Destination updatedDestination = destinationRepository.save(destination);
        logger.info("Destinasyon durumu değiştirildi: {} - Aktif: {}", id, updatedDestination.isActive());
        
        return updatedDestination;
    }

    /**
     * Destinasyonu öne çıkarma/çıkarmama
     */
    public Destination toggleFeaturedStatus(Long id) {
        logger.info("Destinasyon öne çıkarma durumu değiştiriliyor: {}", id);

        Destination destination = getDestinationById(id);
        destination.setFeatured(!destination.isFeatured());
        destination.setUpdatedAt(LocalDateTime.now());

        Destination updatedDestination = destinationRepository.save(destination);
        logger.info("Destinasyon öne çıkarma durumu değiştirildi: {} - Öne Çıkan: {}", id, updatedDestination.isFeatured());
        
        return updatedDestination;
    }

    /**
     * Destinasyon puanını güncelleme
     */
    public void updateDestinationRating(Long destinationId, Double newRating, int reviewCount) {
        logger.info("Destinasyon puanı güncelleniyor: {} - Yeni puan: {}", destinationId, newRating);

        Destination destination = getDestinationById(destinationId);
        destination.setRating(newRating);
        destination.setReviewCount(reviewCount);
        destination.setUpdatedAt(LocalDateTime.now());

        destinationRepository.save(destination);
        logger.info("Destinasyon puanı güncellendi: {}", destinationId);
    }

    /**
     * Destinasyon silme (soft delete)
     */
    public void deleteDestination(Long id) {
        logger.info("Destinasyon siliniyor: {}", id);

        Destination destination = getDestinationById(id);
        destination.setActive(false);
        destination.setUpdatedAt(LocalDateTime.now());

        destinationRepository.save(destination);
        logger.info("Destinasyon başarıyla silindi: {}", id);
    }

    /**
     * Destinasyon istatistikleri
     */
    public DestinationStats getDestinationStats() {
        long totalDestinations = destinationRepository.countByIsActiveTrue();
        long featuredCount = destinationRepository.countByIsFeaturedTrueAndIsActiveTrue();

        return new DestinationStats(totalDestinations, featuredCount);
    }

    /**
     * Destinasyon istatistikleri için inner class
     */
    public static class DestinationStats {
        private final long totalDestinations;
        private final long featuredCount;

        public DestinationStats(long totalDestinations, long featuredCount) {
            this.totalDestinations = totalDestinations;
            this.featuredCount = featuredCount;
        }

        // Getters
        public long getTotalDestinations() { return totalDestinations; }
        public long getFeaturedCount() { return featuredCount; }
    }
} 