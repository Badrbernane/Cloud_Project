package com.marketplace.client.dto;

import lombok.Data;

@Data
public class TeamSummary {
    private String id;
    private String userId;
    private String teamName;
    private Integer totalPoints;
    private Integer playerCount;
}
