package com.marketplace.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "leaderboard-service", url = "${services.leaderboard}")
public interface LeaderboardClient {

    @PostMapping("/api/leaderboard/update/social")
    void updateSocialPoints(@RequestParam("userId") String userId,
                            @RequestParam("pointsChange") int pointsChange,
                            @RequestParam("eventType") String eventType);
}
