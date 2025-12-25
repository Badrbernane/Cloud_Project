import { useState } from 'react';
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"
import Post from "../components/post"
import SuggestedUsers from "../components/suggested-users"
import LiveChat from "../components/live-chat"
import ProfilePage from "./profile"
import FantazyPage from "./fantazy"
import PlayersPage from "./players"
import MyTeamPage from "./my-team"
import LeaderboardPage from "./leaderboard"

export default function Home({ onLogout }) {
  const [view, setView] = useState('feed');

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
            <Post
              user="Badr"
              content="Merhba Bikom! Voici un post de test."
              image="/images/DSC.jpg"
            />
          </div>
          <div className="w-80 flex flex-col">
            <SuggestedUsers />
            <LiveChat />
          </div>
        </div>
      </div>
    </div>
  )
}
