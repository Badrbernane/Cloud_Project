package com.marketplace.client;

import com.marketplace.client.dto.TeamSummary;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "fantasy-service", url = "${services.fantasy}")
public interface FantasyClient {

    @GetMapping("/api/fantasy/teams/user/{userId}")
    List<TeamSummary> getUserTeams(@PathVariable("userId") String userId);

    @GetMapping("/api/fantasy/health")
    String health();
}
