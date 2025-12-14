package com.leaderboardservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalStatsResponse {

    private Long totalUsers;
    private Long totalTeams;
    private Long totalPosts;
    private Integer averageScore;
    private Integer highestScore;
}