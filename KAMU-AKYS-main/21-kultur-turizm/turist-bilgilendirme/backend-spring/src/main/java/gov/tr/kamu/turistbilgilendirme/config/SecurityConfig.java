package gov.tr.kamu.turistbilgilendirme.config;

import gov.tr.kamu.turistbilgilendirme.security.JwtAuthenticationEntryPoint;
import gov.tr.kamu.turistbilgilendirme.security.JwtAuthenticationFilter;
import gov.tr.kamu.turistbilgilendirme.security.JwtTokenUtil;
import gov.tr.kamu.turistbilgilendirme.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security Configuration
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    /**
     * Password Encoder Bean
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * JWT Authentication Filter Bean
     */
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil, UserService userService) {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter();
        filter.setJwtTokenUtil(jwtTokenUtil);
        filter.setUserService(userService);
        return filter;
    }

    /**
     * Security Filter Chain Configuration
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) throws Exception {
        http
            // CSRF'yi devre dışı bırak (JWT kullanıyoruz)
            .csrf(AbstractHttpConfigurer::disable)
            
            // CORS konfigürasyonu
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Session management - stateless
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Exception handling
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            
            // URL authorization rules
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers(
                    "/auth/**",
                    "/actuator/health",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api-docs/**",
                    "/v3/api-docs/**",
                    "/destinations/public/**",
                    "/events/public/**",
                    "/restaurants/public/**",
                    "/accommodations/public/**",
                    "/reviews/public/**",
                    "/h2-console/**"
                ).permitAll()
                
                // Admin endpoints
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/users/admin/**").hasRole("ADMIN")
                
                // Moderator endpoints
                .requestMatchers("/destinations/manage/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("/events/manage/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("/restaurants/manage/**").hasAnyRole("ADMIN", "MODERATOR")
                .requestMatchers("/accommodations/manage/**").hasAnyRole("ADMIN", "MODERATOR")
                
                // Authenticated endpoints
                .requestMatchers("/users/profile/**").authenticated()
                .requestMatchers("/reviews/**").authenticated()
                
                // All other requests need authentication
                .anyRequest().authenticated()
            )
            
            // JWT Authentication Filter'ı ekle
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            
            // H2 console için frame options
            .headers(headers -> headers.frameOptions().sameOrigin());

        return http.build();
    }

    /**
     * CORS Configuration
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed origins
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173", 
            "http://localhost:8081",
            "https://*.vercel.app",
            "https://*.netlify.app"
        ));
        
        // Allowed methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Allowed headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Exposed headers
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type",
            "X-Total-Count"
        ));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Authentication Manager Bean
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
} 