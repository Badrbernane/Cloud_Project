package com.marketplace.client.dto;

import lombok.Data;

@Data
public class UserSummary {
    private String id;
    private String username;
    private String email;
    private String countryCode;
    private String avatarUrl;
}
