package com.leaderboardservice.model;

import jakarta. persistence.*;
import lombok.AllArgsConstructor;
import lombok. Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate. annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "leaderboard_events", indexes = {
        @Index(name = "idx_user_timestamp", columnList = "userId, timestamp DESC")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 50)
    private String eventType;

    @Column(nullable = false)
    private Integer pointsChange;

    @Column(nullable = false, length = 50)
    private String source;

    @Column(length = 500)
    private String description;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}