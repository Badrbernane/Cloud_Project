package com.fantazyteamservice.dto;

import jakarta.validation. constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddPlayerRequest {

    @NotNull(message = "Team ID is required")
    private UUID teamId;

    @NotNull(message = "Player ID is required")
    private UUID playerId;
}