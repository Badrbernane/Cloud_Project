import { useState, useEffect } from 'react';
import { likePost, unlikePost, getPostDetails } from '../services/socialService';
import CommentSection from './comment-section';

export default function Post({ 
  postId, 
  user, 
  image, 
  content, 
  createdAt,
  likesCount = 0,
  commentsCount = 0,
  isLiked = false,
  userLikes = [],
  onUpdate
}) {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(likesCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsTotal, setCommentsTotal] = useState(commentsCount);

  // Vérifier si l'utilisateur a liké ce post
  useEffect(() => {
    const currentUserId = localStorage.getItem('userId');
    if (currentUserId && userLikes) {
      setLiked(userLikes.includes(currentUserId));
    }
  }, [userLikes]);

  // Calculer le temps écoulé
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const postDate = new Date(timestamp);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return `Il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  // Gérer le like/unlike
  const handleLike = async () => {
    if (!postId) return;

    try {
      if (liked) {
        await unlikePost(postId);
        setLikes(prev => prev - 1);
        setLiked(false);
      } else {
        await likePost(postId);
        setLikes(prev => prev + 1);
        setLiked(true);
      }
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  // Charger les commentaires
  const loadComments = async () => {
    if (!postId) return;

    try {
      const postDetails = await getPostDetails(postId);
      setComments(postDetails.comments || []);
      setCommentsTotal(postDetails.commentsCount || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  // Toggle affichage des commentaires
  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }
    setShowComments(!showComments);
  };

  // Callback après ajout d'un commentaire
  const handleCommentAdded = async () => {
    await loadComments();
    setCommentsTotal(prev => prev + 1);
    if (onUpdate) {
      onUpdate();
    }
  };

  // Initiales de l'utilisateur
  const initials = (user || 'U').substring(0, 2).toUpperCase();

  return (
    <div className="bg-red-800 rounded-md p-4 mb-4 text-white">
      {/* Header du post */}
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold mr-3">
          {initials}
        </div>
        <div>
          <div className="font-bold">{user || 'Utilisateur'}</div>
          <div className="text-xs text-red-200">{getTimeAgo(createdAt)}</div>
        </div>
      </div>

      {/* Contenu */}
      <p className="my-2">{content}</p>
      
      {/* Image si présente */}
      {image && <img src={image} alt="post" className="rounded-md mt-2" />}
      
      {/* Actions */}
      <div className="flex gap-4 mt-3 text-sm border-t border-red-700 pt-3">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1 hover:text-red-300 transition-colors ${liked ? 'text-pink-300' : ''}`}
        >
          {liked ? '❤️' : '🤍'} {likes}
        </button>
        <button 
          onClick={toggleComments}
          className={`flex items-center gap-1 hover:text-red-300 transition-colors ${showComments ? 'text-red-300' : ''}`}
        >
          💬 {commentsTotal}
        </button>
      </div>

      {/* Section commentaires */}
      {showComments && (
        <CommentSection 
          postId={postId}
          comments={comments}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </div>
  );
}
