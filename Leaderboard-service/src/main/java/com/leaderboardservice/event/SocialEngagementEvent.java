package com.leaderboardservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok. NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialEngagementEvent {

    private UUID postId;
    private UUID userId;  // Author du post
    private String eventType;  // POST_CREATED, POST_LIKED, POST_COMMENTED
    private String content;
    private Integer likesCount;
    private Integer commentsCount;
    private LocalDateTime timestamp;
}