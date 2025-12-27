import { useState } from 'react';
import { createPost } from '../services/socialService';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const maxLength = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Le contenu ne peut pas être vide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createPost(content.trim());
      setContent('');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (err) {
      setError('Erreur lors de la publication du post');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-800 rounded-md p-4 mb-4">
      <h3 className="text-white font-bold mb-3">✍️ Créer un post</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Partagez vos stratégies, vos transferts, vos victoires... 💪"
          maxLength={maxLength}
          rows="4"
          className="w-full p-3 rounded-md bg-red-900 text-white placeholder-red-300 border-none focus:outline-none focus:ring-2 focus:ring-red-600"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-white text-sm">
            {content.length}/{maxLength}
          </span>
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '📤 Publication...' : '📤 Publier'}
          </button>
        </div>
        {error && (
          <div className="mt-2 text-red-200 text-sm">
            ⚠️ {error}
          </div>
        )}
      </form>
    </div>
  );
}
