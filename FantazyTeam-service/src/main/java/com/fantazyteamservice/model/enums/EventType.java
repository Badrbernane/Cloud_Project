package com.fantazyteamservice.model.enums;

public enum EventType {
    GOAL(5),
    ASSIST(3),
    CLEAN_SHEET(4),
    YELLOW_CARD(-1),
    RED_CARD(-3),
    PENALTY_SAVED(5),
    PENALTY_MISSED(-2),
    OWN_GOAL(-2);

    private final int points;

    EventType(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }
}