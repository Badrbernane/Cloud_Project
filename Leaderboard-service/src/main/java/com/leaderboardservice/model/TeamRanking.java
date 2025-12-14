package com.leaderboardservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok. NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time. LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_rankings", indexes = {
        @Index(name = "idx_total_points", columnList = "totalPoints DESC"),
        @Index(name = "idx_team_id", columnList = "teamId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamRanking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID teamId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 100)
    private String teamName;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer rank = 0;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}