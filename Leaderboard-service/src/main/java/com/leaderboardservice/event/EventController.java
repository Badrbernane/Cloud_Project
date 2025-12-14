package com.leaderboardservice.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework. web.bind.annotation.*;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class EventController {

    private final EventListener eventListener;

    /**
     * Endpoint pour recevoir les événements du Fantasy Service
     */
    @PostMapping("/fantasy")
    public ResponseEntity<String> receiveFantasyEvent(@RequestBody FantasyPointsEvent event) {
        log.info("POST /events/fantasy - Received event: {}", event);
        eventListener.handleFantasyEvent(event);
        return ResponseEntity.ok("Fantasy event processed");
    }

    /**
     * Endpoint pour recevoir les événements du Social Service
     */
    @PostMapping("/social")
    public ResponseEntity<String> receiveSocialEvent(@RequestBody SocialEngagementEvent event) {
        log.info("POST /events/social - Received event: {}", event);
        eventListener. handleSocialEvent(event);
        return ResponseEntity.ok("Social event processed");
    }
}
