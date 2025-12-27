// Configuration des URLs des services
const API_CONFIG = {
    FANTASY_SERVICE: 'http://localhost:8082',
    USER_SERVICE: 'http://localhost:8081',
    LEADERBOARD_SERVICE: 'http://localhost:8084',
    MARKETPLACE: 'http://localhost:8085/index.html'
};

// Endpoints
const ENDPOINTS = {
    // Fantasy Team
    PLAYERS:  '/api/fantasy/players',
    TEAMS: '/api/fantasy/teams',
    ADD_PLAYER: '/api/fantasy/teams/add-player',
    REMOVE_PLAYER: (teamId, playerId) => `/api/fantasy/teams/${teamId}/players/${playerId}`,
    USER_TEAMS: (userId) => `/api/fantasy/teams/user/${userId}`,
    TEAM_BY_ID: (teamId) => `/api/fantasy/teams/${teamId}`,

    // User Service
    USER_BY_ID: (userId) => `/api/users/${userId}`,

    // Leaderboard
    LEADERBOARD: '/api/leaderboard/users'
};

console.log('✅ Config loaded');
