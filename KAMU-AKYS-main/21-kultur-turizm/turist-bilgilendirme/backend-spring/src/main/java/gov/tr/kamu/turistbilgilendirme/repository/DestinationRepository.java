package gov.tr.kamu.turistbilgilendirme.repository;

import gov.tr.kamu.turistbilgilendirme.model.Destination;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Destinasyon Repository Interface
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Repository
public interface DestinationRepository extends JpaRepository<Destination, Long> {

    /**
     * Aktif destinasyonları bulma
     */
    List<Destination> findByIsActiveTrue();

    /**
     * Öne çıkan destinasyonları bulma
     */
    List<Destination> findByIsFeaturedTrueAndIsActiveTrue();

    /**
     * Şehre göre destinasyonları bulma
     */
    Page<Destination> findByCityAndIsActiveTrue(String city, Pageable pageable);

    /**
     * Kategoriye göre destinasyonları bulma
     */
    Page<Destination> findByCategoryAndIsActiveTrue(String category, Pageable pageable);

    /**
     * İsim ile arama (case-insensitive)
     */
    @Query("SELECT d FROM Destination d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :name, '%')) AND d.isActive = true")
    Page<Destination> findByNameContainingIgnoreCase(@Param("name") String name, Pageable pageable);

    /**
     * Açıklama ile arama (case-insensitive)
     */
    @Query("SELECT d FROM Destination d WHERE " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(d.shortDescription) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND d.isActive = true")
    Page<Destination> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Tag'e göre destinasyonları bulma
     */
    @Query("SELECT d FROM Destination d JOIN d.tags t WHERE t = :tag AND d.isActive = true")
    Page<Destination> findByTagsContaining(@Param("tag") String tag, Pageable pageable);

    /**
     * Belirli puan üzeri destinasyonları bulma
     */
    List<Destination> findByRatingGreaterThanEqualAndIsActiveTrue(Double rating);

    /**
     * Konum yakınlığına göre destinasyonları bulma (basit yaklaşım)
     */
    @Query("SELECT d FROM Destination d WHERE " +
           "d.location.latitude >= :minLat AND d.location.latitude <= :maxLat AND " +
           "d.location.longitude >= :minLng AND d.location.longitude <= :maxLng AND " +
           "d.isActive = true")
    List<Destination> findByLocationNear(@Param("minLat") Double minLat, 
                                        @Param("maxLat") Double maxLat, 
                                        @Param("minLng") Double minLng, 
                                        @Param("maxLng") Double maxLng);

    /**
     * Şehir ve kategoriye göre destinasyonları bulma
     */
    Page<Destination> findByCityAndCategoryAndIsActiveTrue(String city, String category, Pageable pageable);

    /**
     * İlçeye göre destinasyonları bulma
     */
    List<Destination> findByDistrictAndIsActiveTrue(String district);

    /**
     * Bölgeye göre destinasyonları bulma
     */
    List<Destination> findByRegionAndIsActiveTrue(String region);

    /**
     * Aktif destinasyon sayısını alma
     */
    long countByIsActiveTrue();

    /**
     * Şehre göre aktif destinasyon sayısını alma
     */
    long countByCityAndIsActiveTrue(String city);

    /**
     * Kategoriye göre aktif destinasyon sayısını alma
     */
    long countByCategoryAndIsActiveTrue(String category);

    /**
     * Öne çıkan destinasyon sayısını alma
     */
    long countByIsFeaturedTrueAndIsActiveTrue();

    /**
     * En yüksek puanlı destinasyonları bulma
     */
    Page<Destination> findByIsActiveTrueOrderByRatingDescReviewCountDesc(Pageable pageable);

    /**
     * En yeni destinasyonları bulma
     */
    Page<Destination> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Popüler destinasyonları bulma (yorum sayısına göre)
     */
    Page<Destination> findByIsActiveTrueOrderByReviewCountDesc(Pageable pageable);
} 