import { useState, useEffect } from 'react';
import { getSuggestedUsers } from '../services/userService';

export default function SuggestedUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedUsers = await getSuggestedUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError('Impossible de charger les utilisateurs');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-red-800 rounded-md p-4 text-white mb-4">
      <h3 className="font-bold mb-2">Utilisateurs suggérés</h3>
      
      {isLoading && (
        <div className="text-center text-red-200">
          Chargement...
        </div>
      )}

      {error && (
        <div className="text-center text-red-300 text-sm">
          {error}
        </div>
      )}

      {!isLoading && !error && users.length === 0 && (
        <div className="text-center text-red-200 text-sm">
          Aucun utilisateur trouvé
        </div>
      )}

      {!isLoading && !error && users.map(user => (
        <div key={user.id} className="flex justify-between items-center mb-2 p-2 hover:bg-red-700 rounded transition">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-sm font-bold">{user.username?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-sm">{user.username}</span>
          </div>
          <button className="bg-purple-600 px-3 py-1 rounded text-xs hover:bg-purple-700 transition">
            Suivre
          </button>
        </div>
      ))}
    </div>
  )
}
