package com.leaderboardservice.repository;

import com.leaderboardservice.model.LeaderboardEvent;
import org.springframework.data. domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework. stereotype.Repository;

import java. util.List;
import java. util.UUID;

@Repository
public interface LeaderboardEventRepository extends JpaRepository<LeaderboardEvent, UUID> {

    List<LeaderboardEvent> findByUserIdOrderByTimestampDesc(UUID userId);

    Page<LeaderboardEvent> findByUserIdOrderByTimestampDesc(UUID userId, Pageable pageable);
}