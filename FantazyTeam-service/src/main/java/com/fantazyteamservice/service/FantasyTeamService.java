package com.fantazyteamservice.service;

import com.fantazyteamservice.client.LeaderboardServiceClient;
import com.fantazyteamservice. client.UserServiceClient;
import com.fantazyteamservice.dto.*;
import com.fantazyteamservice.model. Player;
import com.fantazyteamservice.model.Team;
import com.fantazyteamservice.repository.PlayerRepository;
import com.fantazyteamservice.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j. Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream. Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FantasyTeamService {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final UserServiceClient userServiceClient;
    private final LeaderboardServiceClient leaderboardServiceClient;

    @Transactional
    public TeamResponse createTeam(CreateTeamRequest request) {
        log.info("🟢 Creating team: {} for user: {}", request.getTeamName(), request.getUserId());

        // ✅ 1. VÉRIFIER QUE L'UTILISATEUR EXISTE
        if (!userServiceClient.userExists(request.getUserId())) {
            log.error("❌ User not found: {}", request.getUserId());
            throw new RuntimeException("User not found:  " + request.getUserId());
        }

        // ✅ 2. VÉRIFIER QUE LE NOM EST UNIQUE
        if (teamRepository.existsByTeamName(request.getTeamName())) {
            throw new RuntimeException("Team name already exists");
        }

        // ✅ 3. CRÉER L'ÉQUIPE
        Team team = Team.builder()
                .userId(request.getUserId())
                .teamName(request.getTeamName())
                .budget(100)
                .remainingBudget(100)
                .totalPoints(0)
                .build();

        team = teamRepository.save(team);
        log.info("✅ Team created: {} (ID: {})", team.getTeamName(), team.getId());

        // ✅ 4. NOTIFIER LE LEADERBOARD
        leaderboardServiceClient.updateFantasyPoints(
                team.getUserId(),
                team.getId(),
                0  // Points initiaux
        );

        return mapToTeamResponse(team);
    }

    @Transactional
    public TeamResponse addPlayerToTeam(AddPlayerRequest request) {
        log.info("➕ Adding player {} to team {}", request.getPlayerId(), request.getTeamId());

        // ✅ 1. RÉCUPÉRER L'ÉQUIPE ET LE JOUEUR
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        // ✅ 2. VÉRIFICATIONS
        if (team.getPlayers().size() >= 15) {
            throw new RuntimeException("Team is full (max 15 players)");
        }

        if (team.getRemainingBudget() < player.getPrice()) {
            throw new RuntimeException("Insufficient budget.  Need: " + player.getPrice()
                    + "M, Have: " + team.getRemainingBudget() + "M");
        }

        if (team.getPlayers().contains(player)) {
            throw new RuntimeException("Player already in team");
        }

        // ✅ 3. AJOUTER LE JOUEUR
        team.getPlayers().add(player);
        team.setRemainingBudget(team.getRemainingBudget() - player.getPrice());

        // ✅ 4. RECALCULER LES POINTS TOTAUX
        int totalPoints = team.getPlayers().stream()
                .mapToInt(Player::getTotalPoints)
                .sum();
        team.setTotalPoints(totalPoints);

        team = teamRepository.save(team);
        log.info("✅ Player {} added to team {}. New total:  {} points",
                player.getName(), team.getTeamName(), totalPoints);

        // ✅ 5. METTRE À JOUR LE LEADERBOARD
        leaderboardServiceClient.updateFantasyPoints(
                team.getUserId(),
                team.getId(),
                team.getTotalPoints()
        );

        return mapToTeamResponse(team);
    }

    @Transactional
    public TeamResponse removePlayerFromTeam(UUID teamId, UUID playerId) {
        log.info("➖ Removing player {} from team {}", playerId, teamId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        if (! team.getPlayers().contains(player)) {
            throw new RuntimeException("Player not in team");
        }

        // Retirer le joueur
        team.getPlayers().remove(player);
        team.setRemainingBudget(team.getRemainingBudget() + player.getPrice());

        // Recalculer les points
        int totalPoints = team.getPlayers().stream()
                .mapToInt(Player::getTotalPoints)
                .sum();
        team.setTotalPoints(totalPoints);

        team = teamRepository.save(team);
        log.info("✅ Player removed.  New total: {} points", totalPoints);

        // Mettre à jour le leaderboard
        leaderboardServiceClient. updateFantasyPoints(
                team.getUserId(),
                team.getId(),
                team.getTotalPoints()
        );

        return mapToTeamResponse(team);
    }


    // java
// Insert into the existing FantasyTeamService class
    @Transactional
    public PlayerResponse updatePlayerStats(UUID playerId, UpdatePlayerStatsRequest request) {
        log.info("🔄 Updating stats for player {}", playerId);

        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        player.setTotalPoints(request.getTotalPoints());
        player.setGoals(request.getGoals());
        player.setAssists(request.getAssists());
        player.setCleanSheets(request.getCleanSheets());

        player = playerRepository.save(player);
        log.info("✅ Player {} stats updated: points={} goals={} assists={} cleanSheets={}",
                player.getName(),
                player.getTotalPoints(),
                player.getGoals(),
                player.getAssists(),
                player.getCleanSheets());

        return mapToPlayerResponse(player);
    }
    @Transactional
    public PlayerResponse createPlayer(CreatePlayerRequest request) {
        log.info("🟢 Creating player: {}", request.getName());

        Player player = Player.builder()
                .name(request.getName())
                .position(request.getPosition())
                .club(request.getClub())
                .nationality(request.getNationality())
                .price(request.getPrice())
                .totalPoints(0)
                .goals(0)
                .assists(0)
                .cleanSheets(0)
                .imageUrl(request.getImageUrl())
                .build();

        player = playerRepository.save(player);
        log.info("✅ Player created: {} (ID:  {})", player.getName(), player.getId());

        return mapToPlayerResponse(player);
    }

    public List<TeamResponse> getUserTeams(UUID userId) {
        log.info("📋 Getting teams for user: {}", userId);
        return teamRepository.findByUserId(userId).stream()
                .map(this::mapToTeamResponse)
                .collect(Collectors.toList());
    }

    public TeamResponse getTeamById(UUID teamId) {
        log.info("📋 Getting team: {}", teamId);
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return mapToTeamResponse(team);
    }

    public List<PlayerResponse> getAllPlayers() {
        log.info("📋 Getting all players");
        return playerRepository.findAll().stream()
                .map(this:: mapToPlayerResponse)
                .collect(Collectors.toList());
    }

    // Méthodes de mapping
    public TeamResponse mapToTeamResponse(Team team) {
        return TeamResponse.builder()
                .id(team.getId())
                .userId(team.getUserId())
                .teamName(team.getTeamName())
                .budget(team.getBudget())
                .remainingBudget(team.getRemainingBudget())
                .totalPoints(team. getTotalPoints())
                .playerCount(team.getPlayers().size())
                .players(team.getPlayers().stream()
                        .map(this::mapToPlayerResponse)
                        .collect(Collectors.toList()))
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }

    public PlayerResponse mapToPlayerResponse(Player player) {
        return PlayerResponse.builder()
                .id(player.getId())
                .name(player. getName())
                .position(player.getPosition())
                .club(player.getClub())
                .nationality(player.getNationality())
                .price(player.getPrice())
                .totalPoints(player.getTotalPoints())
                .goals(player.getGoals())
                .assists(player.getAssists())
                .cleanSheets(player.getCleanSheets())
                .imageUrl(player.getImageUrl())
                .build();
    }
}