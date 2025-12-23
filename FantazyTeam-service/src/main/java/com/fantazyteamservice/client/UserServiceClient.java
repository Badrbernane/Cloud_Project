package com.fantazyteamservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework. beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
@Slf4j
public class UserServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${services.user-service.url}")
    private String userServiceUrl;

    /**
     * Vérifie si un utilisateur existe
     */
    public boolean userExists(UUID userId) {
        try {
            String url = userServiceUrl + "/api/users/" + userId;
            restTemplate.getForEntity(url, Object.class);
            log.info("✅ User exists: {}", userId);
            return true;
        } catch (Exception e) {
            log.warn("⚠️ User not found: {} - {}", userId, e.getMessage());
            return false;
        }
    }

    /**
     * Vérifie si le User Service est disponible
     */
    public boolean isAvailable() {
        try {
            String url = userServiceUrl + "/api/users/health";
            restTemplate.getForEntity(url, String.class);
            log.info("✅ User Service is available");
            return true;
        } catch (Exception e) {
            log.warn("⚠️ User Service unavailable: {}", e.getMessage());
            return false;
        }
    }
}