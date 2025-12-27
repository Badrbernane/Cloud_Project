package com.socialservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta. validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    private String username;  // ← AJOUTE CE CHAMP

    @NotBlank(message = "Content cannot be empty")
    @Size(max = 500, message = "Content must be less than 500 characters")
    private String content;

    private String imageUrl;
}