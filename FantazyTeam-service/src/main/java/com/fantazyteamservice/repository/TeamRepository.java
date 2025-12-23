package com.fantazyteamservice.repository;

import com.fantazyteamservice.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype. Repository;

import java.util. List;
import java.util. Optional;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    List<Team> findByUserId(UUID userId);
    Optional<Team> findByTeamName(String teamName);
    boolean existsByTeamName(String teamName);
}