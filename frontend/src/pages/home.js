import { useState, useEffect } from 'react';
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"
import Post from "../components/post"
import CreatePost from "../components/create-post"
import SuggestedUsers from "../components/suggested-users"
import ProfilePage from "./profile"
import FantazyPage from "./fantazy"
import PlayersPage from "./players"
import MyTeamPage from "./my-team"
import LeaderboardPage from "./leaderboard"
import { getAllPosts } from '../services/socialService'
import MarketplacePage from "./marketplace"
import CreateProductPage from "./create-product"

export default function Home({ onLogout }) {
  const [view, setView] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les posts depuis le social-service
  const loadPosts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedPosts = await getAllPosts();
      // Trier par date décroissante
      const sortedPosts = fetchedPosts.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);
    } catch (err) {
      console.error('Erreur lors du chargement des posts:', err);
      setError('Impossible de charger les posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les posts au montage du composant
  useEffect(() => {
    if (view === 'feed') {
      loadPosts();
      
      // Auto-refresh toutes les 30 secondes
      const interval = setInterval(loadPosts, 30000);
      return () => clearInterval(interval);
    }
  }, [view]);

  const handleNavigate = (destination) => {
    if (destination === 'profile') {
      setView('profile');
    } else if (destination === 'fantazy') {
      setView('fantazy');
    } else if (destination === 'players') {
      setView('players');
    } else if (destination === 'myteam') {
      setView('myteam');
    } else if (destination === 'leaderboard') {
      setView('leaderboard');
    } else if (destination === 'shop') {
      setView('shop');
    } else if (destination === 'createProduct') {
      setView('createProduct');
    } else {
      setView('feed');
    }
  };

  if (view === 'profile') {
    return <ProfilePage onLogout={onLogout} onBack={() => setView('feed')} onNavigate={handleNavigate} />;
  }

  if (view === 'fantazy') {
    return <FantazyPage onLogout={onLogout} onBack={() => setView('feed')} onNavigate={handleNavigate} />;
  }

  if (view === 'players') {
    return <PlayersPage onLogout={onLogout} onBack={() => setView('fantazy')} onNavigate={handleNavigate} />;
  }

  if (view === 'myteam') {
    return <MyTeamPage onLogout={onLogout} onBack={() => setView('fantazy')} onNavigate={handleNavigate} />;
  }

  if (view === 'leaderboard') {
    return <LeaderboardPage onLogout={onLogout} onBack={() => setView('fantazy')} onNavigate={handleNavigate} />;
  }
  if (view === 'shop') {
    return <MarketplacePage onLogout={onLogout} onBack={() => setView('feed')} onNavigate={handleNavigate} />;
  }
  
  if (view === 'createProduct') {
    return <CreateProductPage onLogout={onLogout} onBack={() => setView('shop')} onNavigate={handleNavigate} />;
  }
  
  return (
    <div 
      className="min-h-screen text-white"
      style={{ 
        backgroundImage: "url('/images/ar.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <Sidebar onLogout={onLogout} onNavigate={handleNavigate} />
      <div className="ml-20 p-4">
        <Navbar onProfileClick={() => setView('profile')} />
        <div className="flex space-x-4">
          <div className="flex-1">
            {/* Formulaire de création de post */}
            <CreatePost onPostCreated={loadPosts} />

            {/* Message de chargement */}
            {isLoading && (
              <div className="bg-red-800 rounded-md p-4 mb-4 text-white text-center">
                🔄 Chargement des posts...
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-900 rounded-md p-4 mb-4 text-white">
                ⚠️ {error}
              </div>
            )}

            {/* Liste des posts */}
            {!isLoading && !error && posts.length === 0 && (
              <div className="bg-red-800 rounded-md p-8 mb-4 text-white text-center">
                <h3 className="text-xl font-bold mb-2">📭 Aucun post pour le moment</h3>
                <p className="text-red-200">Soyez le premier à partager quelque chose !</p>
              </div>
            )}

            {!isLoading && !error && posts.map((post) => (
              <Post
                key={post.id}
                postId={post.id}
                user={post.username}
                content={post.content}
                image={post.image}
                createdAt={post.createdAt}
                likesCount={post.likesCount}
                commentsCount={post.commentsCount}
                isLiked={post.isLiked}
                userLikes={post.userLikes}
                onUpdate={loadPosts}
              />
            ))}
          </div>
          <div className="w-80 flex flex-col">
            <SuggestedUsers />
          </div>
        </div>
      </div>
    </div>
  )
}
