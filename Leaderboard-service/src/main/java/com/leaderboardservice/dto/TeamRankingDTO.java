package com.leaderboardservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamRankingDTO {
    private UUID teamId;
    private String teamName;
    private UUID userId;
    private Integer totalPoints;
    private Integer rank;
    private LocalDateTime lastUpdated;
}