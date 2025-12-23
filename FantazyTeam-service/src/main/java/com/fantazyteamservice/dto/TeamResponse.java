package com.fantazyteamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeamResponse {
    private UUID id;
    private UUID userId;
    private String teamName;
    private Integer budget;
    private Integer remainingBudget;
    private Integer totalPoints;
    private Integer playerCount;
    private List<PlayerResponse> players;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}