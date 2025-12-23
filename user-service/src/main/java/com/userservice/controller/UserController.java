package com.userservice.controller;

import com.userservice.dto.LoginRequest;
import com.userservice. dto.RegisterRequest;
import com.userservice.dto.UserResponse;
import com.userservice.model.User;
import com.userservice.repository.UserRepository;
import com.userservice. service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework. http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("POST /users/register - email: {}", request.getEmail());
        UserResponse response = userService.register(request);
        return ResponseEntity. status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("POST /users/login - email: {}", request.getEmail());
        UserResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
        log.info("GET /users/{}", id);
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is UP and running!  ✅");
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        log.info("📋 Getting all users");

        List<User> users = userRepository.findAll();  // ✅ minuscule

        List<UserResponse> response = users.stream()
                .map(user -> UserResponse.builder()
                        .id(user. getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .countryCode(user.getCountryCode())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

}
