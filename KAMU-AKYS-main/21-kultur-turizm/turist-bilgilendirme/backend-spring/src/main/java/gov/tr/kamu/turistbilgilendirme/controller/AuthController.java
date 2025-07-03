package gov.tr.kamu.turistbilgilendirme.controller;

import gov.tr.kamu.turistbilgilendirme.model.User;
import gov.tr.kamu.turistbilgilendirme.security.JwtTokenUtil;
import gov.tr.kamu.turistbilgilendirme.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Authentication Controller
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Tag(name = "Authentication", description = "Kimlik doğrulama işlemleri")
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * Kullanıcı girişi
     */
    @Operation(summary = "Kullanıcı girişi", description = "Email ve şifre ile giriş yapma")
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Giriş denemesi: {}", loginRequest.getEmail());

            // Authentication
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            // Token oluşturma
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtTokenUtil.generateToken(userDetails);
            String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

            // Kullanıcı bilgilerini alma
            User user = userService.getUserByEmail(loginRequest.getEmail()).orElse(null);
            
            // Son giriş zamanını güncelleme
            userService.updateLastLogin(loginRequest.getEmail());

            // Response oluşturma
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("type", "Bearer");
            response.put("user", createUserResponse(user));

            logger.info("Başarılı giriş: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            logger.warn("Hatalı giriş denemesi: {}", loginRequest.getEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(createErrorResponse("Geçersiz email veya şifre"));
        } catch (Exception e) {
            logger.error("Giriş hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Sistem hatası"));
        }
    }

    /**
     * Kullanıcı kaydı
     */
    @Operation(summary = "Kullanıcı kaydı", description = "Yeni kullanıcı hesabı oluşturma")
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            logger.info("Kayıt denemesi: {}", registerRequest.getEmail());

            // User nesnesi oluşturma
            User user = new User();
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());

            // Kullanıcıyı kaydetme
            User savedUser = userService.registerUser(user);

            // Token oluşturma
            String token = jwtTokenUtil.generateToken(savedUser);
            String refreshToken = jwtTokenUtil.generateRefreshToken(savedUser);

            // Response oluşturma
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("refreshToken", refreshToken);
            response.put("type", "Bearer");
            response.put("user", createUserResponse(savedUser));

            logger.info("Başarılı kayıt: {}", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            logger.warn("Kayıt hatası: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Kayıt sistemi hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Sistem hatası"));
        }
    }

    /**
     * Token yenileme
     */
    @Operation(summary = "Token yenileme", description = "Refresh token ile yeni access token alma")
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();
            
            if (refreshToken == null || !jwtTokenUtil.isRefreshToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Geçersiz refresh token"));
            }

            String email = jwtTokenUtil.getUsernameFromToken(refreshToken);
            UserDetails userDetails = userService.loadUserByUsername(email);

            if (jwtTokenUtil.validateToken(refreshToken, userDetails)) {
                String newToken = jwtTokenUtil.generateToken(userDetails);
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", newToken);
                response.put("type", "Bearer");

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(createErrorResponse("Refresh token süresi dolmuş"));
            }

        } catch (Exception e) {
            logger.error("Token yenileme hatası: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Sistem hatası"));
        }
    }

    /**
     * Kullanıcı bilgilerini response için hazırlama
     */
    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("email", user.getEmail());
        userResponse.put("role", user.getRole());
        userResponse.put("avatar", user.getAvatar());
        userResponse.put("preferences", user.getPreferences());
        return userResponse;
    }

    /**
     * Hata response'u oluşturma
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }

    // Inner Classes for Request Bodies
    public static class LoginRequest {
        @jakarta.validation.constraints.Email(message = "Geçerli bir email adresi giriniz")
        @jakarta.validation.constraints.NotBlank(message = "Email alanı zorunludur")
        private String email;

        @jakarta.validation.constraints.NotBlank(message = "Şifre alanı zorunludur")
        private String password;

        // Getters and Setters
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        @jakarta.validation.constraints.NotBlank(message = "Ad alanı zorunludur")
        private String firstName;

        @jakarta.validation.constraints.NotBlank(message = "Soyad alanı zorunludur")
        private String lastName;

        @jakarta.validation.constraints.Email(message = "Geçerli bir email adresi giriniz")
        @jakarta.validation.constraints.NotBlank(message = "Email alanı zorunludur")
        private String email;

        @jakarta.validation.constraints.NotBlank(message = "Şifre alanı zorunludur")
        @jakarta.validation.constraints.Size(min = 6, message = "Şifre en az 6 karakter olmalıdır")
        private String password;

        // Getters and Setters
        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }
        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RefreshTokenRequest {
        private String refreshToken;

        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }
} 