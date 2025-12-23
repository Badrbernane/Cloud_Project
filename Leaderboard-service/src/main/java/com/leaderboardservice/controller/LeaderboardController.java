package com.leaderboardservice.controller;

import com. leaderboardservice.dto.*;
import com.leaderboardservice.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework. http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")  // ✅ CORS activé
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    // ==================== HEALTH CHECK ====================

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Leaderboard Service is UP and running!  ✅");
    }

    // ==================== USER ENDPOINTS ====================

    @GetMapping("/users")  // ✅ CHANGÉ de /global à /users
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "50") int limit) {
        log.info("📊 GET /api/leaderboard/users - limit: {}", limit);
        List<LeaderboardEntry> leaderboard = leaderboardService.getGlobalLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/users/{userId}/stats")  // ✅ CHANGÉ de /global/{userId} à /users/{userId}/stats
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable UUID userId) {
        log.info("📊 GET /api/leaderboard/users/{}/stats", userId);
        try {
            UserStatsResponse stats = leaderboardService.getUserStats(userId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            log.error("❌ User not found in leaderboard:  {}", userId);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/users/init")
    public ResponseEntity<String> initializeUser(@RequestBody InitUserRequest request) {
        log.info("🟢 Initializing user in leaderboard:  {} (ID: {})",
                request.getUsername(),
                request.getUserId()
        );

        leaderboardService.initializeUser(
                request.getUserId(),
                request.getUsername(),
                request.getScore()
        );

        return ResponseEntity. status(HttpStatus.CREATED)
                .body("User initialized in leaderboard");
    }

    // ==================== TEAM ENDPOINTS ====================

    @GetMapping("/teams")
    public ResponseEntity<List<TeamLeaderboardEntry>> getTeamLeaderboard(
            @RequestParam(defaultValue = "50") int limit) {
        log.info("⚽ GET /api/leaderboard/teams - limit: {}", limit);
        List<TeamLeaderboardEntry> leaderboard = leaderboardService.getTeamLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    // ==================== TRENDING ENDPOINTS ====================

    @GetMapping("/trending")  // ✅ CHANGÉ de /trending/posts à /trending
    public ResponseEntity<List<TrendingPostEntry>> getTrendingPosts(
            @RequestParam(defaultValue = "20") int limit) {
        log.info("🔥 GET /api/leaderboard/trending - limit: {}", limit);
        List<TrendingPostEntry> trending = leaderboardService.getTrendingPosts(limit);
        return ResponseEntity.ok(trending);
    }

    // ==================== STATS ENDPOINTS ====================

    @GetMapping("/stats/global")
    public ResponseEntity<GlobalStatsResponse> getGlobalStats() {
        log.info("📈 GET /api/leaderboard/stats/global");
        GlobalStatsResponse stats = leaderboardService.getGlobalStats();
        return ResponseEntity.ok(stats);
    }

    // ==================== UPDATE ENDPOINTS ====================

    @PostMapping("/update/fantasy")
    public ResponseEntity<String> updateFantasyPoints(
            @RequestParam UUID userId,
            @RequestParam(required = false) UUID teamId,
            @RequestParam int fantasyPoints) {
        log.info("⚽ POST /api/leaderboard/update/fantasy - user: {}, points: {}", userId, fantasyPoints);
        leaderboardService.updateFantasyPoints(userId, teamId, fantasyPoints);
        return ResponseEntity.ok("Fantasy points updated");
    }

    @PostMapping("/update/social")
    public ResponseEntity<String> updateSocialPoints(
            @RequestParam UUID userId,
            @RequestParam int pointsChange,
            @RequestParam String eventType) {
        log.info("💬 POST /api/leaderboard/update/social - user:  {}, change: {}", userId, pointsChange);
        leaderboardService.updateSocialPoints(userId, pointsChange, eventType);
        return ResponseEntity.ok("Social points updated");
    }

    @PostMapping("/update/post")
    public ResponseEntity<String> updateTrendingPost(
            @RequestParam UUID postId,
            @RequestParam UUID userId,
            @RequestParam String content,
            @RequestParam int likes,
            @RequestParam int comments) {
        log.info("📝 POST /api/leaderboard/update/post - post:  {}, likes: {}, comments:  {}", postId, likes, comments);
        leaderboardService. updateTrendingPost(postId, userId, content, likes, comments);
        return ResponseEntity.ok("Trending post updated");
    }

    // ==================== ADMIN ENDPOINTS ====================

    @PostMapping("/recalculate")
    public ResponseEntity<String> recalculateAllRankings() {
        log.info("🔄 POST /api/leaderboard/recalculate");
        leaderboardService.recalculateAllRankings();
        return ResponseEntity.ok("All rankings recalculated successfully");
    }
}