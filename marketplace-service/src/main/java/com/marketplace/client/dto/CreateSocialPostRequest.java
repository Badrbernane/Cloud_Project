package com.marketplace.client.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateSocialPostRequest {
    private String userId;
    private String content;
    private String imageUrl;
}
