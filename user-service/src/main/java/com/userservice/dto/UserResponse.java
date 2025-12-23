package com.userservice.dto;

import com.userservice.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String username;
    private String email;
    private String countryCode;
    private String avatarUrl;
    private String token;
    private LocalDateTime createdAt;

    // ✅ MÉTHODE STATIQUE fromUser()
    public static UserResponse fromUser(User user, String token) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .countryCode(user.getCountryCode())
                .avatarUrl(user.getAvatarUrl())
                .createdAt(user.getCreatedAt())
                .token(token)
                .build();
    }
}