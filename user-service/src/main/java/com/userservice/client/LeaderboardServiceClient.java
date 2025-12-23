package com.userservice.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype. Component;
import org.springframework. web.client.RestTemplate;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class LeaderboardServiceClient {

    private final RestTemplate restTemplate;

    @Value("${microservices.leaderboard-service.url}")
    private String leaderboardServiceUrl;

    /**
     * Initialiser un utilisateur dans le leaderboard
     */
    public void initializeUser(UUID userId, String username) {
        try {
            String url = leaderboardServiceUrl + "/api/leaderboard/users/init";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Body de la requête
            String requestBody = String.format(
                    "{\"userId\":\"%s\",\"username\":\"%s\",\"score\": 0}",
                    userId. toString(),
                    username
            );

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            log.info("🔵 Calling Leaderboard Service:  POST {}", url);
            log.debug("Request body: {}", requestBody);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Leaderboard initialized for user:  {} ({})", username, userId);
            } else {
                log.warn("⚠️ Unexpected response from Leaderboard:  {}", response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("❌ Failed to initialize leaderboard for user:  {} - {}", userId, e.getMessage());
            // On ne bloque pas l'inscription si le Leaderboard est down
        }
    }

    /**
     * Vérifier si Leaderboard Service est disponible
     */
    public boolean isAvailable() {
        try {
            String url = leaderboardServiceUrl + "/api/leaderboard/health";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            boolean available = response.getStatusCode() == HttpStatus.OK;

            if (available) {
                log. info("✅ Leaderboard Service is available");
            } else {
                log.warn("⚠️ Leaderboard Service returned:  {}", response.getStatusCode());
            }

            return available;
        } catch (Exception e) {
            log.warn("⚠️ Leaderboard Service is not available: {}", e.getMessage());
            return false;
        }
    }
}