import { API_CONFIG } from '../config/config';

// URL de l'API User Service
const USER_API_URL = `${API_CONFIG.USER_SERVICE}/api/users`;

// GET - Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  try {
    const response = await fetch(USER_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
};

// GET - Récupérer les utilisateurs suggérés (limité à 5)
export const getSuggestedUsers = async () => {
  try {
    const currentUserId = localStorage.getItem('userId');
    const allUsers = await getAllUsers();
    
    // Filtrer l'utilisateur actuel et limiter à 5 suggestions
    const suggestedUsers = allUsers
      .filter(user => user.id !== parseInt(currentUserId))
      .slice(0, 5);
    
    return suggestedUsers;
  } catch (error) {
    console.error('❌ Error fetching suggested users:', error);
    throw error;
  }
};

// GET - Récupérer un utilisateur par ID
export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${USER_API_URL}/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  getSuggestedUsers,
  getUserById,
};
