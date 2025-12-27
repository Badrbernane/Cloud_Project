// java
package com.fantazyteamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePlayerStatsRequest {
    private int totalPoints;
    private int goals;
    private int assists;
    private int cleanSheets;
}