package com.leaderboardservice. repository;

import com.leaderboardservice.model.UserScore;
import org.springframework.data. domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework. data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserScoreRepository extends JpaRepository<UserScore, UUID> {

    Optional<UserScore> findByUserId(UUID userId);

    List<UserScore> findTop100ByOrderByTotalScoreDesc();

    Page<UserScore> findAllByOrderByTotalScoreDesc(Pageable pageable);

    @Query("SELECT COUNT(u) FROM UserScore u WHERE u. totalScore > " +
            "(SELECT us.totalScore FROM UserScore us WHERE us.userId = : userId)")
    Long countUsersAbove(UUID userId);
}