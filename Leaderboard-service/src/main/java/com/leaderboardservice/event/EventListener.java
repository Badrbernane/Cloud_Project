package com.leaderboardservice.event;

import com.leaderboardservice. service.LeaderboardService;
import lombok. RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class EventListener {

    private final LeaderboardService leaderboardService;

    @Value("${scoring.post-created-points}")
    private int postCreatedPoints;

    @Value("${scoring.like-received-points}")
    private int likeReceivedPoints;

    @Value("${scoring.comment-received-points}")
    private int commentReceivedPoints;

    /**
     * Traite les événements de Fantasy Team Service
     */
    public void handleFantasyEvent(FantasyPointsEvent event) {
        log.info("Received fantasy event: {} for user {}", event.getEventType(), event.getUserId());

        try {
            switch (event.getEventType()) {
                case "TEAM_CREATED":
                    log.info("Team created: {} by user {}", event.getTeamName(), event.getUserId());
                    leaderboardService.updateFantasyPoints(
                            event.getUserId(),
                            event.getTeamId(),
                            0  // Nouveau équipe = 0 points initialement
                    );
                    break;

                case "POINTS_UPDATED":
                case "MATCH_COMPLETED":
                    log.info("Fantasy points updated for user {}: {} points",
                            event.getUserId(), event.getFantasyPoints());
                    leaderboardService.updateFantasyPoints(
                            event.getUserId(),
                            event.getTeamId(),
                            event.getFantasyPoints()
                    );
                    break;

                case "PLAYER_ADDED":
                    log.info("Player added to team {} by user {}",
                            event.getTeamId(), event.getUserId());
                    // Optionnel : donner des points bonus pour l'ajout de joueur
                    break;

                default:
                    log.warn("Unknown fantasy event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing fantasy event:  {}", e.getMessage(), e);
        }
    }

    /**
     * Traite les événements de Social Service
     */
    public void handleSocialEvent(SocialEngagementEvent event) {
        log.info("Received social event: {} for user {}", event.getEventType(), event.getUserId());

        try {
            switch (event.getEventType()) {
                case "POST_CREATED":
                    log.info("Post created by user {}", event.getUserId());
                    leaderboardService.updateSocialPoints(
                            event.getUserId(),
                            postCreatedPoints,
                            "POST_CREATED"
                    );

                    // Ajouter au trending
                    leaderboardService.updateTrendingPost(
                            event.getPostId(),
                            event.getUserId(),
                            event.getContent(),
                            0, 0  // Nouveau post = 0 likes/comments
                    );
                    break;

                case "POST_LIKED":
                    log.info("Post {} liked (author: {})", event.getPostId(), event.getUserId());
                    leaderboardService.updateSocialPoints(
                            event.getUserId(),
                            likeReceivedPoints,
                            "POST_LIKED"
                    );

                    // Mettre à jour trending
                    if (event.getLikesCount() != null && event.getCommentsCount() != null) {
                        leaderboardService. updateTrendingPost(
                                event.getPostId(),
                                event.getUserId(),
                                event.getContent(),
                                event.getLikesCount(),
                                event.getCommentsCount()
                        );
                    }
                    break;

                case "POST_COMMENTED":
                    log.info("Post {} commented (author: {})", event.getPostId(), event.getUserId());
                    leaderboardService.updateSocialPoints(
                            event.getUserId(),
                            commentReceivedPoints,
                            "POST_COMMENTED"
                    );

                    // Mettre à jour trending
                    if (event.getLikesCount() != null && event.getCommentsCount() != null) {
                        leaderboardService.updateTrendingPost(
                                event.getPostId(),
                                event.getUserId(),
                                event.getContent(),
                                event.getLikesCount(),
                                event. getCommentsCount()
                        );
                    }
                    break;

                default:
                    log.warn("Unknown social event type: {}", event.getEventType());
            }
        } catch (Exception e) {
            log.error("Error processing social event: {}", e.getMessage(), e);
        }
    }
}