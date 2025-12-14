package com.leaderboardservice.repository;

import com.leaderboardservice.model.TrendingPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype. Repository;

import java.util. List;
import java.util. Optional;
import java.util. UUID;

@Repository
public interface TrendingPostRepository extends JpaRepository<TrendingPost, UUID> {

    Optional<TrendingPost> findByPostId(UUID postId);

    List<TrendingPost> findTop50ByOrderByEngagementScoreDesc();
}