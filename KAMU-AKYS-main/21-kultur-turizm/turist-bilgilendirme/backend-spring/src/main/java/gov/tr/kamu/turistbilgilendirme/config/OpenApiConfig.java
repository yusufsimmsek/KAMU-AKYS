package gov.tr.kamu.turistbilgilendirme.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI Configuration
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Configuration
public class OpenApiConfig {

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(serverList())
                .addSecurityItem(securityRequirement())
                .components(securityComponents());
    }

    /**
     * API Bilgileri
     */
    private Info apiInfo() {
        return new Info()
                .title("🏛️ Turist Bilgilendirme API")
                .description("""
                    **Kamu AKYS Turist Bilgilendirme Sistemi Backend API**
                    
                    Bu API, turist destinasyonları, etkinlikler, restoranlar ve konaklama tesisleri hakkında 
                    bilgi sağlar. Kullanıcılar kayıt olabilir, giriş yapabilir ve destinasyonları 
                    keşfedebilirler.
                    
                    ## 🔐 Authentication
                    API, JWT (JSON Web Token) tabanlı authentication kullanır.
                    
                    ## 📱 Kullanım
                    1. `/auth/register` ile kullanıcı kaydı yapın
                    2. `/auth/login` ile giriş yapın ve token alın
                    3. Token'ı Authorization header'ında `Bearer {token}` formatında gönderin
                    
                    ## 🏷️ Kategoriler
                    - **Auth**: Kimlik doğrulama işlemleri
                    - **Users**: Kullanıcı yönetimi
                    - **Destinations**: Turist destinasyonları
                    - **Events**: Etkinlikler (gelecekte)
                    - **Restaurants**: Restoranlar (gelecekte)
                    - **Accommodations**: Konaklama (gelecekte)
                    - **Reviews**: Yorumlar (gelecekte)
                    """)
                .version("1.0.0")
                .contact(apiContact())
                .license(apiLicense());
    }

    /**
     * İletişim Bilgileri
     */
    private Contact apiContact() {
        return new Contact()
                .name("Kamu AKYS Geliştirme Ekibi")
                .email("gelistirme@kamu.gov.tr")
                .url("https://kamu.gov.tr");
    }

    /**
     * Lisans Bilgileri
     */
    private License apiLicense() {
        return new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");
    }

    /**
     * Server Listesi
     */
    private List<Server> serverList() {
        Server localServer = new Server()
                .url("http://localhost:8080" + contextPath)
                .description("Local Development Server");

        Server productionServer = new Server()
                .url("https://api.turist-bilgilendirme.gov.tr" + contextPath)
                .description("Production Server");

        return List.of(localServer, productionServer);
    }

    /**
     * Security Requirement
     */
    private SecurityRequirement securityRequirement() {
        return new SecurityRequirement().addList("Bearer Authentication");
    }

    /**
     * Security Components
     */
    private Components securityComponents() {
        return new Components()
                .addSecuritySchemes("Bearer Authentication", 
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .in(SecurityScheme.In.HEADER)
                        .name("Authorization")
                        .description("JWT Bearer token formatında girin. Örnek: Bearer {token}")
                );
    }
} 