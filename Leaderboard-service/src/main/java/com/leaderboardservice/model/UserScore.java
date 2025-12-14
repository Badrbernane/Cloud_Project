package com.leaderboardservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_scores", indexes = {
        @Index(name = "idx_total_score", columnList = "totalScore DESC"),
        @Index(name = "idx_user_id", columnList = "userId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserScore {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    @Column(length = 100)
    private String username;

    @Column(nullable = false)
    @Builder.Default
    private Integer fantasyPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer socialPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalScore = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer rank = 0;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}