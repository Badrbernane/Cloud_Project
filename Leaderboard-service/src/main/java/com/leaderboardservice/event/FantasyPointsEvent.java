package com.leaderboardservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FantasyPointsEvent {

    private UUID userId;
    private UUID teamId;
    private String teamName;
    private Integer fantasyPoints;
    private String eventType;  // TEAM_CREATED, POINTS_UPDATED, PLAYER_ADDED
    private LocalDateTime timestamp;
}