package gov.tr.kamu.turistbilgilendirme;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Turist Bilgilendirme Sistemi - Spring Boot Backend API
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 * @since 2024
 */
@SpringBootApplication
@EnableJpaRepositories
@EntityScan("gov.tr.kamu.turistbilgilendirme.model")
public class TuristBilgilendirmeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TuristBilgilendirmeApplication.class, args);
        
        System.out.println("\n🚀 Turist Bilgilendirme API (Spring Boot) başlatıldı!");
        System.out.println("📡 Port: 8080");
        System.out.println("🏥 Health Check: http://localhost:8080/actuator/health");
        System.out.println("📚 API Dokümantasyonu: http://localhost:8080/swagger-ui.html");
        System.out.println("🌐 Base URL: http://localhost:8080/api");
        System.out.println("✨ Hazır! API isteklerini kabul ediyor...\n");
    }
} 