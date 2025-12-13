package com.socialservice. dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation. constraints.Size;
import lombok. Data;

import java.util. UUID;

@Data
public class CreatePostRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Content is required")
    @Size(max = 2000, message = "Content must not exceed 2000 characters")
    private String content;

    private String imageUrl;
}