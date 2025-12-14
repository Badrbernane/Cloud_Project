package com.leaderboardservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java. util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamLeaderboardEntry {

    private Integer rank;
    private UUID teamId;
    private UUID userId;
    private String teamName;
    private Integer totalPoints;
    private LocalDateTime lastUpdated;
}