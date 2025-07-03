package gov.tr.kamu.turistbilgilendirme.controller;

import gov.tr.kamu.turistbilgilendirme.model.User;
import gov.tr.kamu.turistbilgilendirme.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Kullanıcı Controller
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Tag(name = "Users", description = "Kullanıcı yönetimi işlemleri")
@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    /**
     * Kullanıcı profili getirme
     */
    @Operation(summary = "Profil bilgileri", description = "Giriş yapmış kullanıcının profil bilgilerini getir")
    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUserProfile() {
        try {
            String email = getCurrentUserEmail();
            return userService.getUserByEmail(email)
                .map(user -> ResponseEntity.ok(createUserResponse(user)))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Profil getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Profil bilgileri getirilirken hata oluştu"));
        }
    }

    /**
     * Kullanıcı profili güncelleme
     */
    @Operation(summary = "Profil güncelle", description = "Giriş yapmış kullanıcının profil bilgilerini güncelle")
    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateUserProfile(@Valid @RequestBody UserUpdateRequest updateRequest) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            User userDetails = new User();
            userDetails.setFirstName(updateRequest.getFirstName());
            userDetails.setLastName(updateRequest.getLastName());
            userDetails.setAvatar(updateRequest.getAvatar());
            userDetails.setPreferences(updateRequest.getPreferences());

            User updatedUser = userService.updateUser(currentUser.getId(), userDetails);
            return ResponseEntity.ok(createUserResponse(updatedUser));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Profil güncelleme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Profil güncellenirken hata oluştu"));
        }
    }

    /**
     * Şifre değiştirme
     */
    @Operation(summary = "Şifre değiştir", description = "Giriş yapmış kullanıcının şifresini değiştir")
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            String email = getCurrentUserEmail();
            User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            userService.changePassword(currentUser.getId(), request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(createSuccessResponse("Şifre başarıyla değiştirildi"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Şifre değiştirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Şifre değiştirilirken hata oluştu"));
        }
    }

    // ADMIN ENDPOINTS

    /**
     * Tüm kullanıcıları getirme (Admin)
     */
    @Operation(summary = "Kullanıcı listesi", description = "Tüm kullanıcıları sayfalama ile getir (Admin)")
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users = userService.getUsers(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("users", users.getContent().stream()
                .map(this::createUserResponse).toList());
            response.put("currentPage", users.getNumber());
            response.put("totalItems", users.getTotalElements());
            response.put("totalPages", users.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Kullanıcıları getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kullanıcıları getirirken hata oluştu"));
        }
    }

    /**
     * Kullanıcı arama (Admin)
     */
    @Operation(summary = "Kullanıcı arama", description = "İsim veya email ile kullanıcı arama (Admin)")
    @GetMapping("/admin/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> searchUsers(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<User> users = userService.searchUsers(query, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("users", users.getContent().stream()
                .map(this::createUserResponse).toList());
            response.put("currentPage", users.getNumber());
            response.put("totalItems", users.getTotalElements());
            response.put("totalPages", users.getTotalPages());
            response.put("query", query);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Kullanıcı arama hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kullanıcı arama sırasında hata oluştu"));
        }
    }

    /**
     * Kullanıcı detayı getirme (Admin)
     */
    @Operation(summary = "Kullanıcı detayı", description = "ID ile kullanıcı detayını getir (Admin)")
    @GetMapping("/admin/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(Long.parseLong(userId));
            return ResponseEntity.ok(createUserResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Kullanıcı getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kullanıcı getirilirken hata oluştu"));
        }
    }

    /**
     * Kullanıcı durumu değiştirme (Admin)
     */
    @Operation(summary = "Kullanıcı durumu değiştir", description = "Kullanıcıyı aktif/pasif yap (Admin)")
    @PatchMapping("/admin/{userId}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String userId) {
        try {
            User user = userService.toggleUserStatus(Long.parseLong(userId));
            return ResponseEntity.ok(createUserResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Kullanıcı durum değiştirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kullanıcı durumu değiştirilirken hata oluştu"));
        }
    }

    /**
     * Kullanıcı rolü değiştirme (Admin)
     */
    @Operation(summary = "Kullanıcı rolü değiştir", description = "Kullanıcının rolünü değiştir (Admin)")
    @PatchMapping("/admin/{userId}/change-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> changeUserRole(@PathVariable String userId, @RequestBody ChangeRoleRequest request) {
        try {
            User user = userService.changeUserRole(Long.parseLong(userId), request.getRole());
            return ResponseEntity.ok(createUserResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Kullanıcı rol değiştirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kullanıcı rolü değiştirilirken hata oluştu"));
        }
    }

    /**
     * Kullanıcı istatistikleri (Admin)
     */
    @Operation(summary = "Kullanıcı istatistikleri", description = "Kullanıcı sayıları ve istatistikleri (Admin)")
    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserStats() {
        try {
            UserService.UserStats stats = userService.getUserStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Kullanıcı istatistikleri getirme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Kullanıcı istatistikleri getirilirken hata oluştu"));
        }
    }

    /**
     * Mevcut kullanıcının email adresini alma
     */
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }

    /**
     * Kullanıcı bilgilerini response için hazırlama
     */
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("fullName", user.getFullName());
        userResponse.put("email", user.getEmail());
        userResponse.put("role", user.getRole());
        userResponse.put("avatar", user.getAvatar());
        userResponse.put("isActive", user.isActive());
        userResponse.put("preferences", user.getPreferences());
        userResponse.put("lastLogin", user.getLastLogin());
        userResponse.put("createdAt", user.getCreatedAt());
        return userResponse;
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

    // Inner Classes for Request Bodies
    public static class UserUpdateRequest {
        private String firstName;
        private String lastName;
        private String avatar;
        private User.UserPreferences preferences;

        // Getters and Setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }
        public User.UserPreferences getPreferences() { return preferences; }
        public void setPreferences(User.UserPreferences preferences) { this.preferences = preferences; }
    }

    public static class ChangePasswordRequest {
        @jakarta.validation.constraints.NotBlank(message = "Mevcut şifre zorunludur")
        private String currentPassword;

        @jakarta.validation.constraints.NotBlank(message = "Yeni şifre zorunludur")
        @jakarta.validation.constraints.Size(min = 6, message = "Yeni şifre en az 6 karakter olmalıdır")
        private String newPassword;

        // Getters and Setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class ChangeRoleRequest {
        @jakarta.validation.constraints.NotNull(message = "Rol zorunludur")
        private User.Role role;

        // Getters and Setters
        public User.Role getRole() { return role; }
        public void setRole(User.Role role) { this.role = role; }
    }
} 