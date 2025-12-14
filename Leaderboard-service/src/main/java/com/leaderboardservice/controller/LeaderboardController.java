package com.leaderboardservice.controller;

import com. leaderboardservice.dto.*;
import com.leaderboardservice.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework. http.ResponseEntity;
import org.springframework. web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/leaderboard")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    // ==================== USER LEADERBOARD ====================

    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard(
            @RequestParam(defaultValue = "100") int limit) {
        log.info("GET /leaderboard/global - limit: {}", limit);
        List<LeaderboardEntry> leaderboard = leaderboardService.getGlobalLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/global/{userId}")
    public ResponseEntity<UserStatsResponse> getUserStats(@PathVariable UUID userId) {
        log.info("GET /leaderboard/global/{}", userId);
        UserStatsResponse stats = leaderboardService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    // ==================== TEAM LEADERBOARD ====================

    @GetMapping("/teams")
    public ResponseEntity<List<TeamLeaderboardEntry>> getTeamLeaderboard(
            @RequestParam(defaultValue = "100") int limit) {
        log.info("GET /leaderboard/teams - limit: {}", limit);
        List<TeamLeaderboardEntry> leaderboard = leaderboardService.getTeamLeaderboard(limit);
        return ResponseEntity.ok(leaderboard);
    }

    // ==================== TRENDING ====================

    @GetMapping("/trending/posts")
    public ResponseEntity<List<TrendingPostEntry>> getTrendingPosts(
            @RequestParam(defaultValue = "50") int limit) {
        log.info("GET /leaderboard/trending/posts - limit: {}", limit);
        List<TrendingPostEntry> trending = leaderboardService.getTrendingPosts(limit);
        return ResponseEntity.ok(trending);
    }

    // ==================== STATS ====================

    @GetMapping("/stats/global")
    public ResponseEntity<GlobalStatsResponse> getGlobalStats() {
        log.info("GET /leaderboard/stats/global");
        GlobalStatsResponse stats = leaderboardService.getGlobalStats();
        return ResponseEntity.ok(stats);
    }

    // ==================== ADMIN ====================

    @PostMapping("/recalculate")
    public ResponseEntity<String> recalculateAllRankings() {
        log.info("POST /leaderboard/recalculate");
        leaderboardService.recalculateAllRankings();
        return ResponseEntity.ok("All rankings recalculated successfully");
    }

    @PostMapping("/update/fantasy")
    public ResponseEntity<String> updateFantasyPoints(
            @RequestParam UUID userId,
            @RequestParam(required = false) UUID teamId,
            @RequestParam int fantasyPoints) {
        log.info("POST /leaderboard/update/fantasy - user: {}, points: {}", userId, fantasyPoints);
        leaderboardService. updateFantasyPoints(userId, teamId, fantasyPoints);
        return ResponseEntity.ok("Fantasy points updated");
    }

    @PostMapping("/update/social")
    public ResponseEntity<String> updateSocialPoints(
            @RequestParam UUID userId,
            @RequestParam int pointsChange,
            @RequestParam String eventType) {
        log.info("POST /leaderboard/update/social - user:  {}, change: {}", userId, pointsChange);
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
        log.info("POST /leaderboard/update/post - post: {}, likes: {}, comments: {}", postId, likes, comments);
        leaderboardService.updateTrendingPost(postId, userId, content, likes, comments);
        return ResponseEntity.ok("Trending post updated");
    }

    // ==================== HEALTH ====================

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Leaderboard Service is UP and running!  ✅");
    }
}