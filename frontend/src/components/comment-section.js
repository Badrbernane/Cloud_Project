import { useState } from 'react';
import { addComment } from '../services/socialService';

export default function CommentSection({ postId, comments = [], onCommentAdded }) {
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentContent.trim()) return;

    setIsSubmitting(true);

    try {
      await addComment(postId, commentContent.trim());
      setCommentContent('');
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Calculer le temps écoulé
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const commentDate = new Date(timestamp);
    const seconds = Math.floor((now - commentDate) / 1000);

    if (seconds < 60) return `Il y a ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  return (
    <div className="mt-3 pt-3 border-t border-red-700">
      {/* Formulaire d'ajout de commentaire */}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ajouter un commentaire..."
            className="flex-1 p-2 rounded-md bg-red-900 text-white placeholder-red-300 border-none focus:outline-none focus:ring-2 focus:ring-red-600 text-sm"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentContent.trim()}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Envoyer
          </button>
        </div>
      </form>

      {/* Liste des commentaires */}
      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-red-300 text-sm text-center py-3">
            Aucun commentaire pour le moment
          </p>
        ) : (
          comments.map((comment, index) => {
            const initials = (comment.username || 'U').substring(0, 2).toUpperCase();
            
            return (
              <div key={index} className="bg-red-900 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-sm">{comment.username || 'Utilisateur'}</span>
                      <span className="text-xs text-red-300">{getTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm mt-1 break-words">{comment.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
