import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/sidebar'

const FANTASY_BASE_URL = process.env.REACT_APP_FANTASY_BASE_URL || 'http://localhost:8082'
const LEADERBOARD_URL = process.env.REACT_APP_LEADERBOARD_URL || 'http://localhost:8084/index.html'

export default function FantazyPage({ onLogout, onBack, onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalPlayers: 0,
    playerCount: 0,
    remainingBudget: 100,
    totalPoints: 0,
    teamName: 'Mon équipe'
  })

  const userId = localStorage.getItem('userId') || ''
  const username = localStorage.getItem('username') || 'Utilisateur'
  const email = localStorage.getItem('email') || ''
  const countryCode = localStorage.getItem('countryCode') || ''

  const queryParams = useMemo(() => {
    if (!userId) return ''
    const search = new URLSearchParams({ userId, username, email, countryCode })
    return search.toString()
  }, [userId, username, email, countryCode])

  const withParams = (path) => {
    if (!path) return ''
    return queryParams ? `${FANTASY_BASE_URL}/${path}?${queryParams}` : `${FANTASY_BASE_URL}/${path}`
  }

  const fetchJson = async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      const body = await response.text()
      throw new Error(body || `HTTP ${response.status}`)
    }
    if (response.status === 204) return null
    return response.json()
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      if (!userId) {
        setError("Aucun utilisateur connecté. Connecte-toi pour accéder au mode Fantazy.")
        setLoading(false)
        return
      }

      try {
        const [players, teams] = await Promise.all([
          fetchJson(`${FANTASY_BASE_URL}/api/fantasy/players`),
          fetchJson(`${FANTASY_BASE_URL}/api/fantasy/teams/user/${userId}`)
        ])

        const team = Array.isArray(teams) && teams.length > 0 ? teams[0] : null

        setStats({
          totalPlayers: Array.isArray(players) ? players.length : 0,
          playerCount: team?.playerCount ?? 0,
          remainingBudget: team?.remainingBudget ?? 100,
          totalPoints: team?.totalPoints ?? 0,
          teamName: team?.name || 'Mon équipe'
        })
      } catch (err) {
        console.error('Erreur Fantazy:', err)
        setError("Impossible de charger les données Fantazy. Vérifie le service backend.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId])

  const openPage = (path) => {
    const url = withParams(path)
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const openLeaderboard = () => {
    const url = queryParams ? `${LEADERBOARD_URL}?${queryParams}` : LEADERBOARD_URL
    window.open(url, '_blank', 'noopener,noreferrer')
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
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />
      <div className="ml-20 p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-white/70 text-sm">Mode FantazyTeam</p>
            <h1 className="text-3xl font-bold">Construis ta dream team</h1>
            <p className="text-white/70 text-sm">Stats en direct depuis le service Spring et accès rapide aux pages Fantazy.</p>
          </div>
          <div className="flex gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
              >
                Retour
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-500/40 text-sm p-4 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard label="Joueurs disponibles" value={loading ? '...' : stats.totalPlayers} icon="👥" />
          <StatCard label="Mon équipe" value={loading ? '...' : `${stats.playerCount}/15`} icon="⭐" />
          <StatCard label="Budget restant" value={loading ? '...' : `${stats.remainingBudget}M`} icon="💰" />
          <StatCard label="Points totaux" value={loading ? '...' : stats.totalPoints} icon="🏆" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-black/40 border border-white/10 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Raccourcis Fantazy</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <QuickLink label="Voir les joueurs" description="Liste complète des joueurs" onClick={() => onNavigate?.('players')} />
              <QuickLink label="Gérer mon équipe" description="Ajoute ou retire des joueurs" onClick={() => onNavigate?.('myteam')} />
             
              <QuickLink label="Classement" description="Vue classement interne" onClick={() => onNavigate?.('leaderboard')} />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-600/30 flex items-center justify-center text-2xl">⚽</div>
              <div>
                <p className="text-sm text-white/70">Bienvenue, {username}</p>
                <p className="text-lg font-semibold">{stats.teamName}</p>
              </div>
            </div>
            <ul className="text-white/80 text-sm list-disc list-inside space-y-2">
              <li>Budget de départ à 100M</li>
              <li>Compose jusqu'à 15 joueurs</li>
              <li>Les points suivent les performances réelles</li>
              <li>Utilise les raccourcis pour gérer rapidement</li>
            </ul>
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate?.('players')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition"
              >
                Ajouter des joueurs
              </button>
              <button
                onClick={() => onNavigate?.('myteam')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition"
              >
                Voir mon équipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  )
}

function QuickLink({ label, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-black/30 border border-white/10 hover:border-white/30 rounded-lg p-4 transition"
    >
      <p className="font-semibold">{label}</p>
      <p className="text-white/70 text-sm">{description}</p>
    </button>
  )
}
