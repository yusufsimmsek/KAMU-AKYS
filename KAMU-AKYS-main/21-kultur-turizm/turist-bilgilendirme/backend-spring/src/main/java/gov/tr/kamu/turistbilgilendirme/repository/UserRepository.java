package gov.tr.kamu.turistbilgilendirme.repository;

import gov.tr.kamu.turistbilgilendirme.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Kullanıcı Repository Interface
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Email ile kullanıcı bulma
     */
    Optional<User> findByEmail(String email);

    /**
     * Email'in var olup olmadığını kontrol etme
     */
    boolean existsByEmail(String email);

    /**
     * Aktif kullanıcıları bulma
     */
    List<User> findByIsActiveTrue();

    /**
     * Role göre kullanıcıları bulma
     */
    List<User> findByRole(User.Role role);

    /**
     * Aktif duruma göre kullanıcıları sayfalama ile bulma
     */
    Page<User> findByIsActive(boolean isActive, Pageable pageable);

    /**
     * İsim veya email ile arama (case-insensitive)
     */
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Belirli tarihten sonra kayıt olan kullanıcıları bulma
     */
    List<User> findByCreatedAtAfter(LocalDateTime date);

    /**
     * Son giriş tarihi belirli tarihten sonra olan kullanıcıları bulma
     */
    List<User> findByLastLoginAfter(LocalDateTime date);

    /**
     * Email ile aktif kullanıcı bulma
     */
    Optional<User> findByEmailAndIsActiveTrue(String email);

    /**
     * ID'lere göre aktif kullanıcıları bulma
     */
    List<User> findByIdInAndIsActiveTrue(List<Long> ids);

    /**
     * Kullanıcı sayısını alma
     */
    long countByIsActiveTrue();

    /**
     * Role göre kullanıcı sayısını alma
     */
    long countByRole(User.Role role);

    /**
     * Belirli tarih aralığında kayıt olan kullanıcı sayısı
     */
    long countByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
} 