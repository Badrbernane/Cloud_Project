package com.fantazyteamservice.client;

import lombok.extern.slf4j. Slf4j;
import org. springframework.beans.factory.annotation. Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework. stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@Slf4j
public class LeaderboardServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${services.leaderboard-service.url}")
    private String leaderboardServiceUrl;

    /**
     * Vérifie si le Leaderboard Service est disponible
     */
    public boolean isAvailable() {
        try {
            String url = leaderboardServiceUrl + "/api/leaderboard/health";
            restTemplate.getForEntity(url, String.class);
            log.info("✅ Leaderboard Service is available");
            return true;
        } catch (Exception e) {
            log.warn("⚠️ Leaderboard Service unavailable: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Met à jour les points fantasy dans le leaderboard
     */
    public void updateFantasyPoints(UUID userId, UUID teamId, int points) {
        if (!isAvailable()) {
            log.warn("⚠️ Skipping fantasy points update - Leaderboard Service unavailable");
            return;
        }

        try {
            String url = leaderboardServiceUrl + "/api/leaderboard/update/fantasy? userId=" + userId
                    + "&teamId=" + teamId + "&fantasyPoints=" + points;

            restTemplate.postForEntity(url, null, String.class);

            log.info("✅ Fantasy points updated in leaderboard: {} points for user {}", points, userId);
        } catch (Exception e) {
            log.error("❌ Failed to update fantasy points: {}", e.getMessage());
        }
    }
}