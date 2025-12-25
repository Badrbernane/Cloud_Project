package com.fantazyteamservice.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory. annotation.Value;
import org. springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Component
@Slf4j
public class LeaderboardServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${services.leaderboard-service.url}")
    private String leaderboardServiceUrl;

    /**
     * Met à jour les points fantasy dans le leaderboard
     */
    public void updateFantasyPoints(UUID userId, UUID teamId, int points) {
        try {
            String url = leaderboardServiceUrl + "/api/leaderboard/update/fantasy? userId=" + userId
                    + "&teamId=" + teamId + "&fantasyPoints=" + points;

            log.info("📤 Calling leaderboard:   {} points for user {}", points, userId);
            log.info("📤 URL:  {}", url);

            restTemplate.postForEntity(url, null, String.class);

            log.info("✅ Fantasy points updated in leaderboard:  {} points for user {}", points, userId);
        } catch (Exception e) {
            log.error("❌ Failed to update fantasy points: {}", e.getMessage(), e);
        }
    }
}