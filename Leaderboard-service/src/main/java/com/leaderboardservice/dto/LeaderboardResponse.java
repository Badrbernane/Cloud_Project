package com.leaderboardservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardResponse {
    private List<UserScoreDTO> rankings;
    private Integer totalUsers;
    private LocalDateTime lastUpdated;
    private String period; // daily, weekly, monthly, all-time
}