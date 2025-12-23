package com.userservice.service;

import com.userservice.client.LeaderboardServiceClient;
import com.userservice.dto.LoginRequest;
import com.userservice.dto. RegisterRequest;
import com.userservice.dto.UserResponse;
import com.userservice.model. User;
import com.userservice.repository.UserRepository;
import com.userservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j. Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LeaderboardServiceClient leaderboardServiceClient;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        // Vérifications
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Créer l'utilisateur
        User user = User.builder()
                .id(UUID.randomUUID())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .countryCode(request.getCountryCode())
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        user = userRepository.save(user);
        log.info("✅ User registered:  {} (ID: {})", user.getEmail(), user.getId());

        // Générer le token
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        // 🔥 APPELER LEADERBOARD SERVICE
        if (leaderboardServiceClient.isAvailable()) {
            log.info("🔵 Leaderboard Service is available, initializing user.. .");
            leaderboardServiceClient.initializeUser(user.getId(), user.getUsername());
        } else {
            log.warn("⚠️ Leaderboard Service unavailable, skipping initialization");
        }

        return UserResponse.fromUser(user,token);
    }


    public UserResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        log.info("User logged in successfully: {}", user.getEmail());

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user. getEmail())
                .avatarUrl(user.getAvatarUrl())
                .countryCode(user.getCountryCode())
                .createdAt(user.getCreatedAt())
                .token(token)
                .build();
    }

    public UserResponse getUserById(UUID id) {
        log.info("Getting user by id: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user. getEmail())
                .avatarUrl(user.getAvatarUrl())
                .countryCode(user.getCountryCode())
                .createdAt(user.getCreatedAt())
                .build();
    }
}