import { useState } from 'react';
import Sidebar from "../components/sidebar"
import Navbar from "../components/navbar"
import Post from "../components/post"
import SuggestedUsers from "../components/suggested-users"
import LiveChat from "../components/live-chat"
import ProfilePage from "./profile"

export default function Home({ onLogout }) {
  const [showProfile, setShowProfile] = useState(false);

  if (showProfile) {
    return <ProfilePage onLogout={onLogout} onBack={() => setShowProfile(false)} />;
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
      <Sidebar onLogout={onLogout} />
      <div className="ml-20 p-4">
        <Navbar onProfileClick={() => setShowProfile(true)} />
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
