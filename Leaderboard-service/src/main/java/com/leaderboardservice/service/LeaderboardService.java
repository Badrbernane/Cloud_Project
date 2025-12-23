package com.leaderboardservice.service;

import com.leaderboardservice. dto.*;
import com.leaderboardservice.model.*;
import com.leaderboardservice.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework. beans.factory.annotation.Value;
import org.springframework.data. domain.Page;
import org. springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaderboardService {

    private final UserScoreRepository userScoreRepository;
    private final TeamRankingRepository teamRankingRepository;
    private final TrendingPostRepository trendingPostRepository;
    private final LeaderboardEventRepository eventRepository;
    private final RankingCalculator rankingCalculator;
    // private final RedisService redisService;  // ← COMMENTÉ

    @Value("${cache.leaderboard-ttl:3600}")
    private long leaderboardTtl;

    @Value("${cache.user-stats-ttl:1800}")
    private long userStatsTtl;

    // ==================== USER LEADERBOARD ====================

    public List<LeaderboardEntry> getGlobalLeaderboard(int limit) {
        String cacheKey = "leaderboard:global:" + limit;

        // Try cache first - DISABLED
        // List<LeaderboardEntry> cached = (List<LeaderboardEntry>) redisService.get(cacheKey, List.class);
        // if (cached != null) {
        //     return cached;
        // }

        log.info("Fetching global leaderboard from DB (limit:  {})", limit);

        Pageable pageable = PageRequest. of(0, limit);
        Page<UserScore> page = userScoreRepository.findAllByOrderByTotalScoreDesc(pageable);

        List<LeaderboardEntry> leaderboard = page.getContent().stream()
                .map(this::mapToLeaderboardEntry)
                .collect(Collectors.toList());

        // Cache result - DISABLED
        // redisService.set(cacheKey, leaderboard, leaderboardTtl);

        return leaderboard;
    }

    @Transactional
    public void initializeUser(UUID userId, String username, Integer score) {
        // Vérifier si l'utilisateur existe déjà
        if (userScoreRepository.existsByUserId(userId)) {
            log.warn("⚠️ User {} already exists in leaderboard", userId);
            return;
        }

        // Créer l'entrée UserScore avec tous les scores à 0
        UserScore userScore = UserScore. builder()
                .userId(userId)
                .username(username)
                .fantasyPoints(0)
                .socialPoints(0)
                .totalScore(0)
                .rank(0)
                .build();

        userScoreRepository. save(userScore);
        log.info("✅ User {} initialized in leaderboard with totalScore 0", username);
    }

    public UserStatsResponse getUserStats(UUID userId) {
        String cacheKey = "leaderboard:user:" + userId;

        // Cache check - DISABLED
        // UserStatsResponse cached = redisService. get(cacheKey, UserStatsResponse.class);
        // if (cached != null) {
        //     return cached;
        // }

        log.info("Fetching user stats from DB:  {}", userId);

        UserScore userScore = userScoreRepository. findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found in leaderboard"));

        long totalUsers = userScoreRepository. count();
        long usersAbove = userScoreRepository.countUsersAbove(userId);
        double percentile = totalUsers > 0 ? ((double) (totalUsers - usersAbove) / totalUsers) * 100 : 0;

        UserStatsResponse stats = UserStatsResponse.builder()
                .userId(userId)
                .username(userScore.getUsername())
                .currentRank(userScore.getRank())
                .fantasyPoints(userScore.getFantasyPoints())
                .socialPoints(userScore.getSocialPoints())
                .totalScore(userScore.getTotalScore())
                .totalUsers(totalUsers)
                .percentile(percentile)
                .build();

        // Cache set - DISABLED
        // redisService.set(cacheKey, stats, userStatsTtl);

        return stats;
    }

    // ==================== TEAM LEADERBOARD ====================

    public List<TeamLeaderboardEntry> getTeamLeaderboard(int limit) {
        String cacheKey = "leaderboard: teams:" + limit;

        // Cache check - DISABLED
        // List<TeamLeaderboardEntry> cached = (List<TeamLeaderboardEntry>) redisService.get(cacheKey, List.class);
        // if (cached != null) {
        //     return cached;
        // }

        log.info("Fetching team leaderboard from DB (limit: {})", limit);

        Pageable pageable = PageRequest.of(0, limit);
        Page<TeamRanking> page = teamRankingRepository.findAllByOrderByTotalPointsDesc(pageable);

        List<TeamLeaderboardEntry> leaderboard = page.getContent().stream()
                .map(this::mapToTeamEntry)
                .collect(Collectors.toList());

        // Cache set - DISABLED
        // redisService.set(cacheKey, leaderboard, leaderboardTtl);

        return leaderboard;
    }

    // ==================== TRENDING POSTS ====================

    public List<TrendingPostEntry> getTrendingPosts(int limit) {
        String cacheKey = "leaderboard:trending:" + limit;

        // Cache check - DISABLED
        // List<TrendingPostEntry> cached = (List<TrendingPostEntry>) redisService.get(cacheKey, List.class);
        // if (cached != null) {
        //     return cached;
        // }

        log.info("Fetching trending posts from DB (limit: {})", limit);

        List<TrendingPost> posts = trendingPostRepository.findTop50ByOrderByEngagementScoreDesc()
                .stream()
                .limit(limit)
                .toList();

        List<TrendingPostEntry> trending = posts. stream()
                .map(this:: mapToTrendingEntry)
                .collect(Collectors.toList());

        // Cache set - DISABLED
        // redisService.set(cacheKey, trending, leaderboardTtl);

        return trending;
    }

    // ==================== UPDATE METHODS ====================

    @Transactional
    public void updateFantasyPoints(UUID userId, UUID teamId, int fantasyPoints) {
        log.info("Updating fantasy points for user {}: {} points", userId, fantasyPoints);

        UserScore userScore = userScoreRepository.findByUserId(userId)
                .orElse(UserScore.builder()
                        .userId(userId)
                        .username("User-" + userId.toString().substring(0, 8))
                        .build());

        userScore.setFantasyPoints(fantasyPoints);
        userScore.setTotalScore(rankingCalculator.calculateTotalScore(
                userScore. getFantasyPoints(),
                userScore.getSocialPoints()));

        userScoreRepository.save(userScore);

        // Update team ranking
        if (teamId != null) {
            TeamRanking teamRanking = teamRankingRepository. findByTeamId(teamId)
                    .orElse(TeamRanking.builder()
                            .teamId(teamId)
                            .userId(userId)
                            .teamName("Team-" + teamId. toString().substring(0, 8))
                            .build());

            teamRanking.setTotalPoints(fantasyPoints);
            teamRankingRepository.save(teamRanking);
        }

        // Log event
        logEvent(userId, "FANTASY_POINTS_UPDATE", fantasyPoints, "fantasy-service");

        // Invalidate caches - DISABLED
        // invalidateUserCache(userId);
        // invalidateLeaderboardCache();
    }

    @Transactional
    public void updateSocialPoints(UUID userId, int pointsChange, String eventType) {
        log.info("Updating social points for user {}: {} points ({})", userId, pointsChange, eventType);

        UserScore userScore = userScoreRepository.findByUserId(userId)
                .orElse(UserScore.builder()
                        .userId(userId)
                        .username("User-" + userId.toString().substring(0, 8))
                        .build());

        userScore.setSocialPoints(userScore. getSocialPoints() + pointsChange);
        userScore.setTotalScore(rankingCalculator. calculateTotalScore(
                userScore.getFantasyPoints(),
                userScore.getSocialPoints()));

        userScoreRepository.save(userScore);

        // Log event
        logEvent(userId, eventType, pointsChange, "social-service");

        // Invalidate caches - DISABLED
        // invalidateUserCache(userId);
        // invalidateLeaderboardCache();
    }

    @Transactional
    public void updateTrendingPost(UUID postId, UUID userId, String content, int likes, int comments) {
        log.info("Updating trending post {}: likes={}, comments={}", postId, likes, comments);

        int engagementScore = rankingCalculator.calculateEngagementScore(likes, comments);

        TrendingPost trendingPost = trendingPostRepository.findByPostId(postId)
                .orElse(TrendingPost.builder()
                        .postId(postId)
                        .userId(userId)
                        .content(content)
                        .build());

        trendingPost.setLikesCount(likes);
        trendingPost.setCommentsCount(comments);
        trendingPost.setEngagementScore(engagementScore);

        trendingPostRepository.save(trendingPost);

        // Invalidate cache - DISABLED
        // redisService.deletePattern("leaderboard:trending: *");
    }

    // ==================== RECALCULATE ====================

    @Transactional
    public void recalculateAllRankings() {
        log.info("Recalculating all rankings...");

        rankingCalculator.recalculateUserRankings();
        rankingCalculator.recalculateTeamRankings();
        rankingCalculator.recalculateTrendingPosts();

        // Clear all caches - DISABLED
        // redisService.deletePattern("leaderboard:*");

        log.info("All rankings recalculated");
    }

    // ==================== GLOBAL STATS ====================

    public GlobalStatsResponse getGlobalStats() {
        String cacheKey = "leaderboard: stats: global";

        // Cache check - DISABLED
        // GlobalStatsResponse cached = redisService.get(cacheKey, GlobalStatsResponse.class);
        // if (cached != null) {
        //     return cached;
        // }

        log.info("Calculating global stats...");

        long totalUsers = userScoreRepository. count();
        long totalTeams = teamRankingRepository.count();
        long totalPosts = trendingPostRepository.count();

        List<UserScore> topUsers = userScoreRepository.findTop100ByOrderByTotalScoreDesc();
        int averageScore = topUsers.isEmpty() ? 0 :
                (int) topUsers.stream().mapToInt(UserScore::getTotalScore).average().orElse(0);
        int highestScore = topUsers.isEmpty() ? 0 :
                topUsers. get(0).getTotalScore();

        GlobalStatsResponse stats = GlobalStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalTeams(totalTeams)
                .totalPosts(totalPosts)
                .averageScore((double)averageScore)
                .highestScore(highestScore)
                .build();

        // Cache set - DISABLED
        // redisService.set(cacheKey, stats, leaderboardTtl);

        return stats;
    }

    // ==================== HELPER METHODS ====================

    private void logEvent(UUID userId, String eventType, int pointsChange, String source) {
        LeaderboardEvent event = LeaderboardEvent.builder()
                .userId(userId)
                .eventType(eventType)
                .pointsChange(pointsChange)
                .source(source)
                .build();
        eventRepository.save(event);
    }

    // Cache invalidation methods - DISABLED
    // private void invalidateUserCache(UUID userId) {
    //     redisService.delete("leaderboard:user:" + userId);
    // }

    // private void invalidateLeaderboardCache() {
    //     redisService.deletePattern("leaderboard:global:*");
    //     redisService.deletePattern("leaderboard:teams: *");
    // }

    private LeaderboardEntry mapToLeaderboardEntry(UserScore userScore) {
        return LeaderboardEntry. builder()
                .rank(userScore.getRank())
                .userId(userScore.getUserId())
                .username(userScore. getUsername())
                .fantasyPoints(userScore.getFantasyPoints())
                .socialPoints(userScore.getSocialPoints())
                .totalScore(userScore. getTotalScore())
                .lastUpdated(userScore.getLastUpdated())
                .build();
    }

    private TeamLeaderboardEntry mapToTeamEntry(TeamRanking team) {
        return TeamLeaderboardEntry.builder()
                .rank(team.getRank())
                .teamId(team.getTeamId())
                .userId(team.getUserId())
                .teamName(team.getTeamName())
                .totalPoints(team.getTotalPoints())
                .lastUpdated(team.getLastUpdated())
                .build();
    }

    private TrendingPostEntry mapToTrendingEntry(TrendingPost post) {
        return TrendingPostEntry.builder()
                .rank(post.getRank())
                .postId(post.getPostId())
                .userId(post.getUserId())
                .content(post.getContent())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .engagementScore(post.getEngagementScore())
                .createdAt(post.getCreatedAt())
                .build();
    }
}