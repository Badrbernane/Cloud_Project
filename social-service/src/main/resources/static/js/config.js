// Configuration des URLs des services
const API_CONFIG = {
    SOCIAL_SERVICE: 'http://localhost:8083',
    USER_SERVICE: 'http://localhost:8081',
    FANTASY_SERVICE: 'http://localhost:8082',
    LEADERBOARD_SERVICE: 'http://localhost:8084'
};

// Endpoints
const ENDPOINTS = {
    POSTS: '/api/posts',
    POST_BY_ID: (postId) => `/api/posts/${postId}`,
    LIKE_POST: (postId) => `/api/posts/${postId}/like`,
    UNLIKE_POST: (postId) => `/api/posts/${postId}/unlike`,
    COMMENTS: (postId) => `/api/posts/${postId}/comments`,
    ADD_COMMENT: (postId) => `/api/posts/${postId}/comments`
};

console.log('✅ Config loaded');