package com.leaderboardservice.repository;

import com.leaderboardservice.model.TeamRanking;
import org.springframework.data.domain. Page;
import org.springframework. data.domain.Pageable;
import org.springframework.data. jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamRankingRepository extends JpaRepository<TeamRanking, UUID> {

    Optional<TeamRanking> findByTeamId(UUID teamId);

    List<TeamRanking> findTop100ByOrderByTotalPointsDesc();

    Page<TeamRanking> findAllByOrderByTotalPointsDesc(Pageable pageable);

    List<TeamRanking> findByUserId(UUID userId);
}