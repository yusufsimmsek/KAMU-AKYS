package gov.tr.kamu.turistbilgilendirme.service;

import gov.tr.kamu.turistbilgilendirme.model.User;
import gov.tr.kamu.turistbilgilendirme.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Kullanıcı Service Sınıfı
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    /**
     * Spring Security UserDetailsService implementation
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.debug("Kullanıcı yükleniyor: {}", email);
        
        User user = userRepository.findByEmailAndIsActiveTrue(email)
                .orElseThrow(() -> new UsernameNotFoundException("Kullanıcı bulunamadı: " + email));
        
        logger.debug("Kullanıcı başarıyla yüklendi: {}", email);
        return user;
    }

    /**
     * Yeni kullanıcı kaydetme
     */
    public User registerUser(User user) {
        logger.info("Yeni kullanıcı kaydı: {}", user.getEmail());

        // Email kontrolü
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Bu email adresi zaten kullanılıyor: " + user.getEmail());
        }

        // Şifreyi encode etme
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Default değerler
        user.setActive(true);
        user.setRole(User.Role.USER);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        logger.info("Kullanıcı başarıyla kaydedildi: {}", savedUser.getEmail());
        
        return savedUser;
    }

    /**
     * Kullanıcı güncelleme
     */
    public User updateUser(Long userId, User userDetails) {
        logger.info("Kullanıcı güncelleniyor: {}", userId);

        User user = getUserById(userId);

        // Güncellenebilir alanlar
        if (userDetails.getFirstName() != null) {
            user.setFirstName(userDetails.getFirstName());
        }
        if (userDetails.getLastName() != null) {
            user.setLastName(userDetails.getLastName());
        }
        if (userDetails.getAvatar() != null) {
            user.setAvatar(userDetails.getAvatar());
        }
        if (userDetails.getPreferences() != null) {
            user.setPreferences(userDetails.getPreferences());
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        logger.info("Kullanıcı başarıyla güncellendi: {}", updatedUser.getEmail());
        
        return updatedUser;
    }

    /**
     * Şifre değiştirme
     */
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        logger.info("Şifre değiştiriliyor: {}", userId);

        User user = getUserById(userId);

        // Mevcut şifre kontrolü
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Mevcut şifre yanlış");
        }

        // Yeni şifreyi encode etme
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        logger.info("Şifre başarıyla değiştirildi: {}", userId);
    }

    /**
     * ID ile kullanıcı bulma
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + userId));
    }

    /**
     * Email ile kullanıcı bulma
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmailAndIsActiveTrue(email);
    }

    /**
     * Tüm aktif kullanıcıları getirme
     */
    public List<User> getAllActiveUsers() {
        return userRepository.findByIsActiveTrue();
    }

    /**
     * Sayfalama ile kullanıcıları getirme
     */
    public Page<User> getUsers(Pageable pageable) {
        return userRepository.findByIsActive(true, pageable);
    }

    /**
     * Kullanıcı arama
     */
    public Page<User> searchUsers(String searchTerm, Pageable pageable) {
        return userRepository.findBySearchTerm(searchTerm, pageable);
    }

    /**
     * Role göre kullanıcıları getirme
     */
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    /**
     * Kullanıcı aktif/pasif yapma
     */
    public User toggleUserStatus(Long userId) {
        logger.info("Kullanıcı durumu değiştiriliyor: {}", userId);

        User user = getUserById(userId);
        user.setActive(!user.isActive());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        logger.info("Kullanıcı durumu değiştirildi: {} - Aktif: {}", userId, updatedUser.isActive());
        
        return updatedUser;
    }

    /**
     * Kullanıcı rolü değiştirme
     */
    public User changeUserRole(Long userId, User.Role newRole) {
        logger.info("Kullanıcı rolü değiştiriliyor: {} -> {}", userId, newRole);

        User user = getUserById(userId);
        user.setRole(newRole);
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        logger.info("Kullanıcı rolü değiştirildi: {} -> {}", userId, newRole);
        
        return updatedUser;
    }

    /**
     * Son giriş zamanını güncelleme
     */
    public void updateLastLogin(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            logger.debug("Son giriş zamanı güncellendi: {}", email);
        }
    }

    /**
     * Kullanıcı istatistikleri
     */
    public UserStats getUserStats() {
        long totalUsers = userRepository.countByIsActiveTrue();
        long adminCount = userRepository.countByRole(User.Role.ADMIN);
        long moderatorCount = userRepository.countByRole(User.Role.MODERATOR);
        long userCount = userRepository.countByRole(User.Role.USER);

        return new UserStats(totalUsers, adminCount, moderatorCount, userCount);
    }

    /**
     * Kullanıcı istatistikleri için inner class
     */
    public static class UserStats {
        private final long totalUsers;
        private final long adminCount;
        private final long moderatorCount;
        private final long userCount;

        public UserStats(long totalUsers, long adminCount, long moderatorCount, long userCount) {
            this.totalUsers = totalUsers;
            this.adminCount = adminCount;
            this.moderatorCount = moderatorCount;
            this.userCount = userCount;
        }

        // Getters
        public long getTotalUsers() { return totalUsers; }
        public long getAdminCount() { return adminCount; }
        public long getModeratorCount() { return moderatorCount; }
        public long getUserCount() { return userCount; }
    }
} 