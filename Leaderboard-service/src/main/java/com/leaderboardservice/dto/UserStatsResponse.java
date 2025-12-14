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
public class UserStatsResponse {

    private UUID userId;
    private String username;
    private Integer currentRank;
    private Integer fantasyPoints;
    private Integer socialPoints;
    private Integer totalScore;
    private Long totalUsers;
    private Double percentile;
}