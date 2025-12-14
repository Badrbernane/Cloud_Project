package com.leaderboardservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "trending_posts", indexes = {
        @Index(name = "idx_engagement_score", columnList = "engagementScore DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrendingPost {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID postId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false)
    @Builder.Default
    private Integer likesCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer commentsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer engagementScore = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer rank = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}