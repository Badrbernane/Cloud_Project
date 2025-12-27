import { API_CONFIG } from '../config/config';

// URL de l'API Social Service
const SOCIAL_API_URL = `${API_CONFIG.SOCIAL_SERVICE}/api`;

// Récupérer l'userId depuis le localStorage
const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

// Récupérer le username depuis le localStorage
const getCurrentUsername = () => {
  return localStorage.getItem('username') || 'Utilisateur';
};

// GET - Récupérer tous les posts
export const getAllPosts = async () => {
  try {
    const userId = getCurrentUserId();
    const url = userId 
      ? `${SOCIAL_API_URL}/posts?currentUserId=${userId}`
      : `${SOCIAL_API_URL}/posts`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    throw error;
  }
};

// POST - Créer un nouveau post
export const createPost = async (content) => {
  try {
    const userId = getCurrentUserId();
    const username = getCurrentUsername();

    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${SOCIAL_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        username: username,
        content: content
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error('❌ Error creating post:', error);
    throw error;
  }
};

// POST - Liker un post
export const likePost = async (postId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(
      `${SOCIAL_API_URL}/posts/${postId}/like?userId=${userId}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error('❌ Error liking post:', error);
    throw error;
  }
};

// POST - Unliker un post
export const unlikePost = async (postId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(
      `${SOCIAL_API_URL}/posts/${postId}/unlike?userId=${userId}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const updatedPost = await response.json();
    return updatedPost;
  } catch (error) {
    console.error('❌ Error unliking post:', error);
    throw error;
  }
};

// GET - Récupérer un post avec ses commentaires
export const getPostDetails = async (postId) => {
  try {
    const userId = getCurrentUserId();
    const url = userId
      ? `${SOCIAL_API_URL}/posts/${postId}?currentUserId=${userId}`
      : `${SOCIAL_API_URL}/posts/${postId}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error('❌ Error fetching post details:', error);
    throw error;
  }
};

// POST - Ajouter un commentaire
export const addComment = async (postId, content) => {
  try {
    const userId = getCurrentUserId();
    const username = getCurrentUsername();

    if (!userId) {
      throw new Error('User not logged in');
    }

    const response = await fetch(`${SOCIAL_API_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        username: username,
        content: content
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const newComment = await response.json();
    return newComment;
  } catch (error) {
    console.error('❌ Error adding comment:', error);
    throw error;
  }
};

export default {
  getAllPosts,
  createPost,
  likePost,
  unlikePost,
  getPostDetails,
  addComment
};
