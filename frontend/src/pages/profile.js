import { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';

export default function ProfilePage({ onLogout, onBack, onNavigate }) {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    countryCode: '',
    createdAt: '',
    userId: '',
    avatar: '/images/1758979867038.png'
  });

  const countryFlags = {
    'DZ': '🇩🇿 Algérie',
    'FR': '🇫🇷 France',
    'MA': '🇲🇦 Maroc',
    'TN': '🇹🇳 Tunisie',
    'US': '🇺🇸 USA',
    'GB': '🇬🇧 Royaume-Uni',
    'ES': '🇪🇸 Espagne'
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    try {
      const username = localStorage.getItem('username') || 'Utilisateur';
      const email = localStorage.getItem('email') || 'Non disponible';
      const countryCode = localStorage.getItem('countryCode') || 'DZ';
      const createdAt = localStorage.getItem('createdAt') || new Date().toISOString();
      const userId = localStorage.getItem('userId') || 'N/A';

      setProfileData({
        username,
        email,
        countryCode,
        createdAt,
        userId,
        avatar: '/images/1758979867038.png'
      });
    } catch (error) {
      console.error('Erreur chargement profil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout?.();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

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
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />
      <div className="ml-20 p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <div className="w-16"></div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg p-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="rounded-full w-32 h-32 object-cover border-4 border-blue-500 mb-4"
              />
              <h2 className="text-2xl font-bold"> {profileData.username}</h2>
            </div>

            {/* Profile Information */}
            <div className="space-y-6">
              <div className="bg-black/30 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-400 text-sm mb-1">📧 Email</p>
                <p className="text-lg font-semibold">{profileData.email}</p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-400 text-sm mb-1">🌍 Pays</p>
                <p className="text-lg font-semibold">
                  {countryFlags[profileData.countryCode] || profileData.countryCode}
                </p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border-l-4 border-purple-500">
                <p className="text-gray-400 text-sm mb-1">📅 Membre depuis</p>
                <p className="text-lg font-semibold">{formatDate(profileData.createdAt)}</p>
              </div>

              <div className="bg-black/30 p-4 rounded-lg border-l-4 border-orange-500">
                <p className="text-gray-400 text-sm mb-1">🔑 ID Utilisateur</p>
                <p className="text-sm font-mono text-gray-300">{profileData.userId}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button 
                onClick={onBack}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition"
              >
                Retour
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
