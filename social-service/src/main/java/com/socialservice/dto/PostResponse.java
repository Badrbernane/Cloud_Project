package com.socialservice.dto;

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
public class PostResponse {
    private UUID id;
    private UUID userId;
    private String username;  // ← AJOUTE CE CHAMP
    private String content;
    private String imageUrl;

    private Integer likesCount;  // ← Backend utilise "likesCount"
    private Integer commentsCount;  // ← Backend utilise "commentsCount"

    private Boolean likedByCurrentUser;
    private List<String> userLikes;  // ← Pour savoir qui a liké

    private List<CommentResponse> comments;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}