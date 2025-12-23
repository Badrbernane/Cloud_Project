package com.leaderboardservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreUpdateRequest {
    private UUID userId;
    private String username;
    private Integer fantasyPoints;
    private Integer socialPoints;
    private String source; // "fantasy-service" ou "social-service"
    private String eventType; // "GAME_COMPLETED", "POST_CREATED", etc.
    private String description;
}