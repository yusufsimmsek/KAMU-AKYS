package gov.tr.kamu.turistbilgilendirme.security;

import gov.tr.kamu.turistbilgilendirme.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private JwtTokenUtil jwtTokenUtil;
    private UserService userService;

    // Setter methods for dependency injection
    public void setJwtTokenUtil(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                   FilterChain chain) throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // JWT Token Bearer şeklinde gelir "Bearer token"
        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            try {
                username = jwtTokenUtil.getUsernameFromToken(jwtToken);
            } catch (IllegalArgumentException e) {
                logger.warn("JWT Token alınamadı: {}", e.getMessage());
            } catch (ExpiredJwtException e) {
                logger.warn("JWT Token süresi dolmuş: {}", e.getMessage());
            } catch (MalformedJwtException e) {
                logger.warn("JWT Token formatı geçersiz: {}", e.getMessage());
            } catch (SignatureException e) {
                logger.warn("JWT Token signature hatası: {}", e.getMessage());
            } catch (RuntimeException e) {
                // Tüm diğer JWT hatalarını yakala (signature mismatch dahil)
                logger.warn("JWT Token doğrulama hatası: {}", e.getMessage());
            } catch (Exception e) {
                logger.warn("JWT Token genel hatası: {}", e.getMessage());
            }
        } else {
            logger.debug("JWT Token Bearer ile başlamıyor");
        }

        // Token geçerli ise ve SecurityContext'te authentication yok ise
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userService.loadUserByUsername(username);

                // Token geçerli ise authentication oluştur
                if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {

                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // SecurityContext'e authentication set et
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                logger.warn("Token doğrulama sırasında hata: {}", e.getMessage());
            }
        }
        
        chain.doFilter(request, response);
    }
} 