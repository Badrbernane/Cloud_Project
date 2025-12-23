package com.fantazyteamservice.dto;

import com.fantazyteamservice. model.enums.Position;
import jakarta. validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlayerRequest {

    @NotBlank(message = "Player name is required")
    private String name;

    @NotNull(message = "Position is required")
    private Position position;

    @NotBlank(message = "Club is required")
    private String club;

    private String nationality;

    @NotNull(message = "Price is required")
    @Min(value = 1, message = "Price must be at least 1")
    private Integer price;

    private String imageUrl;
}