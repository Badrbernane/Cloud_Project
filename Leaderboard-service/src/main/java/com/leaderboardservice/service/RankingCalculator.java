package com.leaderboardservice.service;

import com.leaderboardservice.model.TeamRanking;
import com. leaderboardservice.model.TrendingPost;
import com. leaderboardservice.model.UserScore;
import com.leaderboardservice.repository.TeamRankingRepository;
import com.leaderboardservice.repository.TrendingPostRepository;
import com. leaderboardservice.repository.UserScoreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RankingCalculator {

    private final UserScoreRepository userScoreRepository;
    private final TeamRankingRepository teamRankingRepository;
    private final TrendingPostRepository trendingPostRepository;

    @Transactional
    public void recalculateUserRankings() {
        log.info("Recalculating user rankings...");

        List<UserScore> users = userScoreRepository.findAllByOrderByTotalScoreDesc(null).getContent();

        int rank = 1;
        for (UserScore user : users) {
            user.setRank(rank++);
        }

        userScoreRepository.saveAll(users);
        log.info("User rankings updated: {} users", users.size());
    }

    @Transactional
    public void recalculateTeamRankings() {
        log.info("Recalculating team rankings...");

        List<TeamRanking> teams = teamRankingRepository.findAllByOrderByTotalPointsDesc(null).getContent();

        int rank = 1;
        for (TeamRanking team : teams) {
            team.setRank(rank++);
        }

        teamRankingRepository.saveAll(teams);
        log.info("Team rankings updated: {} teams", teams.size());
    }

    @Transactional
    public void recalculateTrendingPosts() {
        log.info("Recalculating trending posts...");

        List<TrendingPost> posts = trendingPostRepository.findTop50ByOrderByEngagementScoreDesc();

        int rank = 1;
        for (TrendingPost post : posts) {
            post.setRank(rank++);
        }

        trendingPostRepository.saveAll(posts);
        log.info("Trending posts updated: {} posts", posts.size());
    }

    public int calculateEngagementScore(int likes, int comments) {
        return (likes * 2) + (comments * 3);
    }

    public int calculateTotalScore(int fantasyPoints, int socialPoints) {
        return (fantasyPoints * 2) + (socialPoints * 1);
    }
}