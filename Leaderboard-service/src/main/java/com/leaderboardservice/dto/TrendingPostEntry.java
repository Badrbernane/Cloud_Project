package com.leaderboardservice. dto;

import lombok.AllArgsConstructor;
import lombok. Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time. LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendingPostEntry {

    private Integer rank;
    private UUID postId;
    private UUID userId;
    private String content;
    private Integer likesCount;
    private Integer commentsCount;
    private Integer engagementScore;
    private LocalDateTime createdAt;
}