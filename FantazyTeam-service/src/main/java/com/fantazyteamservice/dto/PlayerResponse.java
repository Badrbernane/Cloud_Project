package com.fantazyteamservice.dto;

import com.fantazyteamservice. model.enums.Position;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlayerResponse {
    private UUID id;
    private String name;
    private Position position;
    private String club;
    private String nationality;
    private Integer price;
    private Integer totalPoints;
    private Integer goals;
    private Integer assists;
    private Integer cleanSheets;
    private String imageUrl;
}