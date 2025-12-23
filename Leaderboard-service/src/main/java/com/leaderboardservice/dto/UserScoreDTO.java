package com.leaderboardservice. dto;

import lombok.AllArgsConstructor;
import lombok. Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserScoreDTO {
    private UUID userId;
    private String username;
    private Integer totalScore;
    private Integer fantasyPoints;
    private Integer socialPoints;
    private Integer rank;
    private LocalDateTime lastUpdated;
}