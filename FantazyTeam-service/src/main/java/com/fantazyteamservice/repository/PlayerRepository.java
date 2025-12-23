package com.fantazyteamservice.repository;

import com.fantazyteamservice. model.Player;
import com.fantazyteamservice. model.enums.Position;
import org. springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlayerRepository extends JpaRepository<Player, UUID> {
    List<Player> findByPosition(Position position);
    List<Player> findByClub(String club);
}