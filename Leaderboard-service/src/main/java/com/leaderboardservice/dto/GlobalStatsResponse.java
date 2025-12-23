package com.leaderboardservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalStatsResponse {

    // Statistiques générales
    private Long totalUsers;
    private Long activeUsersToday;
    private Long totalGamesPlayed;
    private Long totalPostsCreated;
    private Double averageScore;
    private Integer highestScore;
    private Integer lowestScore;
    private LocalDateTime lastUpdated;

    // Statistiques Fantasy
    private Long totalFantasyTeams;
    private Long totalTeams;  // ⭐ AJOUTÉ
    private Double averageFantasyScore;

    // Statistiques Social
    private Long totalLikes;
    private Long totalComments;
    private Long totalPosts;

    // Top performers
    private String topFantasyUser;
    private String topSocialUser;
    private String topOverallUser;

    // Statistiques additionnelles
    private Long totalEvents;
    private Long totalTrendingPosts;
}