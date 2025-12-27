// Configuration centralisée de l'application
export const API_CONFIG = {
  // Services backend
  USER_SERVICE: 'http://localhost:8081',
  FANTAZY_SERVICE: 'http://localhost:8082',
  SOCIAL_SERVICE: 'http://localhost:8083',
  LEADERBOARD_SERVICE: 'http://localhost:8084',
  MARKETPLACE_SERVICE: 'http://localhost:8085',
};

// Configuration des endpoints
export const ENDPOINTS = {
  // User Service
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  USER_PROFILE: '/api/users/profile',
  
  // Social Service
  POSTS: '/api/posts',
  POST_BY_ID: (id) => `/api/posts/${id}`,
  LIKE_POST: (id) => `/api/posts/${id}/like`,
  UNLIKE_POST: (id) => `/api/posts/${id}/unlike`,
  ADD_COMMENT: (id) => `/api/posts/${id}/comments`,
  
  // Fantasy Service
  TEAMS: '/api/teams',
  PLAYERS: '/api/players',
  
  // Leaderboard Service
  RANKINGS: '/api/leaderboard',
};

// Configuration de l'application
export const APP_CONFIG = {
  AUTO_REFRESH_INTERVAL: 30000, // 30 secondes
  MAX_POST_LENGTH: 500,
  MAX_COMMENT_LENGTH: 200,
  POSTS_PER_PAGE: 20,
};

// Services externes
export const AZURE_FUNCTIONS = {
  WELCOME_EMAIL: 'https://func-email-welcome-a7dggyhrh7cug2bn.francecentral-01.azurewebsites.net/api/httpTrigger1',
};

export default {
  API_CONFIG,
  ENDPOINTS,
  APP_CONFIG,
  AZURE_FUNCTIONS,
};
