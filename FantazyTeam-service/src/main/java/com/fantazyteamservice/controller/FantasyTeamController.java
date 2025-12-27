package com.fantazyteamservice.controller;

import com.fantazyteamservice.dto.*;
import com.fantazyteamservice.service.FantasyTeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework. http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/fantasy")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class FantasyTeamController {

    private final FantasyTeamService fantasyTeamService;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("FantazyTeam Service is UP!  ⚽");
    }

    @PostMapping("/players")
    public ResponseEntity<PlayerResponse> createPlayer(@Valid @RequestBody CreatePlayerRequest request) {
        log.info("POST /players - Creating player: {}", request.getName());
        PlayerResponse response = fantasyTeamService.createPlayer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/teams")
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        log.info("POST /teams - Creating team");
        TeamResponse response = fantasyTeamService.createTeam(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // java
// Insert inside the existing controller class (adjust imports if needed)
    @PutMapping("/players/{playerId}/stats")
    public ResponseEntity<PlayerResponse> updatePlayerStats(
            @PathVariable UUID playerId,
            @RequestBody UpdatePlayerStatsRequest request) {
        PlayerResponse updated = fantasyTeamService.updatePlayerStats(playerId, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/teams/user/{userId}")
    public ResponseEntity<List<TeamResponse>> getUserTeams(@PathVariable UUID userId) {
        log.info("GET /teams/user/{}", userId);
        List<TeamResponse> teams = fantasyTeamService.getUserTeams(userId);
        return ResponseEntity.ok(teams);
    }

    @GetMapping("/teams/{teamId}")
    public ResponseEntity<TeamResponse> getTeamById(@PathVariable UUID teamId) {
        log.info("GET /teams/{}", teamId);
        TeamResponse team = fantasyTeamService.getTeamById(teamId);
        return ResponseEntity.ok(team);
    }

    @PostMapping("/teams/add-player")
    public ResponseEntity<TeamResponse> addPlayerToTeam(@Valid @RequestBody AddPlayerRequest request) {
        log.info("POST /teams/add-player");
        TeamResponse team = fantasyTeamService.addPlayerToTeam(request);
        return ResponseEntity.ok(team);
    }

    @GetMapping("/players")
    public ResponseEntity<List<PlayerResponse>> getAllPlayers() {
        log.info("GET /players");
        List<PlayerResponse> players = fantasyTeamService.getAllPlayers();
        return ResponseEntity.ok(players);
    }

    @DeleteMapping("/teams/{teamId}/players/{playerId}")
    public ResponseEntity<TeamResponse> removePlayerFromTeam(
            @PathVariable UUID teamId,
            @PathVariable UUID playerId) {
        log.info("DELETE /teams/{}/players/{}", teamId, playerId);
        TeamResponse team = fantasyTeamService.removePlayerFromTeam(teamId, playerId);
        return ResponseEntity.ok(team);
    }
}