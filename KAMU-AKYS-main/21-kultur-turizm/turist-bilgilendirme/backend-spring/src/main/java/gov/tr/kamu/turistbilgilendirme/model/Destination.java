package gov.tr.kamu.turistbilgilendirme.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Turist Destinasyonu Entity Sınıfı
 * 
 * @author Kamu AKYS
 * @version 1.0.0
 */
@Entity
@Table(name = "destinations")
@EntityListeners(AuditingEntityListener.class)
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Destinasyon adı zorunludur")
    private String name;

    @NotBlank(message = "Açıklama zorunludur")
    private String description;

    @NotBlank(message = "Kısa açıklama zorunludur")
    private String shortDescription;

    @NotBlank(message = "Kategori zorunludur")
    private String category;

    @NotBlank(message = "Şehir zorunludur")
    private String city;

    @NotBlank(message = "İlçe zorunludur")
    private String district;

    private String region;

    @NotNull(message = "Konum bilgisi zorunludur")
    @Embedded
    private Location location;

    @ElementCollection
    private List<String> images;

    @Embedded
    private ContactInfo contact;

    @Embedded
    private VisitingInfo visitingInfo;

    @Embedded
    private AccessibilityInfo accessibility;

    @Min(value = 0, message = "Puan 0'dan küçük olamaz")
    @Max(value = 5, message = "Puan 5'den büyük olamaz")
    private Double rating = 0.0;

    private Integer reviewCount = 0;

    @ElementCollection
    @MapKeyColumn(name = "translation_key")
    @Column(name = "translation_value")
    private Map<String, String> translations;

    @ElementCollection
    private List<String> tags;

    private boolean isActive = true;

    private boolean isFeatured = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Constructors
    public Destination() {}

    public Destination(String name, String description, String category, String city, String district) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.city = city;
        this.district = district;
    }

    // Inner Classes
    @Embeddable
    public static class Location {
        @NotNull(message = "Enlem zorunludur")
        @Min(value = -90, message = "Enlem -90'dan küçük olamaz")
        @Max(value = 90, message = "Enlem 90'dan büyük olamaz")
        private Double latitude;

        @NotNull(message = "Boylam zorunludur")
        @Min(value = -180, message = "Boylam -180'den küçük olamaz")
        @Max(value = 180, message = "Boylam 180'den büyük olamaz")
        private Double longitude;

        private String address;
        
        @Column(name = "location_city")
        private String city;
        
        @Column(name = "location_district")
        private String district;
        
        @Column(name = "location_country")
        private String country;

        // Constructors
        public Location() {}

        public Location(Double latitude, Double longitude) {
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public Location(Double latitude, Double longitude, String address) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.address = address;
        }

        // Getters and Setters
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getDistrict() { return district; }
        public void setDistrict(String district) { this.district = district; }
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
    }

    @Embeddable
    public static class ContactInfo {
        @Column(name = "contact_phone")
        private String phone;
        
        @Column(name = "contact_email")
        private String email;
        
        @Column(name = "contact_website")
        private String website;
        
        @Column(name = "contact_social_media")
        private String socialMedia;

        // Getters and Setters
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
        public String getSocialMedia() { return socialMedia; }
        public void setSocialMedia(String socialMedia) { this.socialMedia = socialMedia; }
    }

    @Embeddable
    public static class VisitingInfo {
        @Column(name = "opening_hours")
        private String openingHours;
        
        @Column(name = "best_time_to_visit")
        private String bestTimeToVisit;
        
        @Column(name = "visit_duration")
        private String duration;
        
        @Column(name = "entry_fee")
        private Double entryFee;
        
        @Column(name = "ticket_info")
        private String ticketInfo;
        
        @Column(name = "ticket_price")
        private String ticketPrice;
        
        @Column(name = "average_visit_duration")
        private String averageVisitDuration;

        // Getters and Setters
        public String getOpeningHours() { return openingHours; }
        public void setOpeningHours(String openingHours) { this.openingHours = openingHours; }
        public String getBestTimeToVisit() { return bestTimeToVisit; }
        public void setBestTimeToVisit(String bestTimeToVisit) { this.bestTimeToVisit = bestTimeToVisit; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public Double getEntryFee() { return entryFee; }
        public void setEntryFee(Double entryFee) { this.entryFee = entryFee; }
        public String getTicketInfo() { return ticketInfo; }
        public void setTicketInfo(String ticketInfo) { this.ticketInfo = ticketInfo; }
        public String getTicketPrice() { return ticketPrice; }
        public void setTicketPrice(String ticketPrice) { this.ticketPrice = ticketPrice; }
        public String getAverageVisitDuration() { return averageVisitDuration; }
        public void setAverageVisitDuration(String averageVisitDuration) { this.averageVisitDuration = averageVisitDuration; }
    }

    @Embeddable
    public static class AccessibilityInfo {
        @Column(name = "wheelchair_accessible")
        private boolean wheelchairAccessible = false;
        
        @Column(name = "has_parking")
        private boolean hasParking = false;
        
        @Column(name = "has_public_transport")
        private boolean hasPublicTransport = false;
        
        @Column(name = "accessibility_notes")
        private String notes;

        // Getters and Setters
        public boolean isWheelchairAccessible() { return wheelchairAccessible; }
        public void setWheelchairAccessible(boolean wheelchairAccessible) { this.wheelchairAccessible = wheelchairAccessible; }
        public boolean isHasParking() { return hasParking; }
        public void setHasParking(boolean hasParking) { this.hasParking = hasParking; }
        public boolean isHasPublicTransport() { return hasPublicTransport; }
        public void setHasPublicTransport(boolean hasPublicTransport) { this.hasPublicTransport = hasPublicTransport; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class Image {
        private String url;
        private String caption;
        private String alt;
        private boolean isPrimary = false;

        // Constructors
        public Image() {}

        public Image(String url, String caption) {
            this.url = url;
            this.caption = caption;
        }

        public Image(String url, String caption, boolean isPrimary) {
            this.url = url;
            this.caption = caption;
            this.isPrimary = isPrimary;
        }

        // Getters and Setters
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public String getCaption() { return caption; }
        public void setCaption(String caption) { this.caption = caption; }
        public String getAlt() { return alt; }
        public void setAlt(String alt) { this.alt = alt; }
        public boolean isPrimary() { return isPrimary; }
        public void setPrimary(boolean primary) { isPrimary = primary; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Location getLocation() { return location; }
    public void setLocation(Location location) { this.location = location; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public ContactInfo getContact() { return contact; }
    public void setContact(ContactInfo contact) { this.contact = contact; }

    public VisitingInfo getVisitingInfo() { return visitingInfo; }
    public void setVisitingInfo(VisitingInfo visitingInfo) { this.visitingInfo = visitingInfo; }

    public AccessibilityInfo getAccessibility() { return accessibility; }
    public void setAccessibility(AccessibilityInfo accessibility) { this.accessibility = accessibility; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Map<String, String> getTranslations() { return translations; }
    public void setTranslations(Map<String, String> translations) { this.translations = translations; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public boolean isFeatured() { return isFeatured; }
    public void setFeatured(boolean featured) { isFeatured = featured; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 