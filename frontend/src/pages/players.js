import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/sidebar'

const FANTASY_BASE_URL = process.env.REACT_APP_FANTASY_BASE_URL || 'http://localhost:8082'

const ENDPOINTS = {
  PLAYERS: '/api/fantasy/players',
  USER_TEAMS: (userId) => `/api/fantasy/teams/user/${userId}`,
  ADD_PLAYER: '/api/fantasy/teams/add-player',
}

export default function PlayersPage({ onLogout, onBack, onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [players, setPlayers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [team, setTeam] = useState(null)
  const [position, setPosition] = useState('')
  const [search, setSearch] = useState('')

  const userId = localStorage.getItem('userId') || ''

  const fetchJson = async (path, init) => {
    const url = `${FANTASY_BASE_URL}${path}`
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
    if (!res.ok) throw new Error(await res.text())
    if (res.status === 204) return null
    return res.json()
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [playersData, teamsData] = await Promise.all([
          fetchJson(ENDPOINTS.PLAYERS),
          userId ? fetchJson(ENDPOINTS.USER_TEAMS(userId)) : Promise.resolve([])
        ])

        const teamData = Array.isArray(teamsData) && teamsData.length > 0 ? teamsData[0] : null
        setTeam(teamData)
        setPlayers(Array.isArray(playersData) ? playersData : [])
        setFiltered(Array.isArray(playersData) ? playersData : [])
      } catch (err) {
        console.error('Players load error:', err)
        setError("Erreur lors du chargement des joueurs")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  useEffect(() => {
    // apply filters
    let list = players
    if (position) list = list.filter(p => p.position === position)
    if (search) {
      const s = search.toLowerCase()
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(s) ||
        (p.club || '').toLowerCase().includes(s) ||
        (p.nationality || '').toLowerCase().includes(s)
      )
    }
    setFiltered(list)
  }, [players, position, search])

  const canAddPlayer = (player) => {
    if (!team) return false
    if ((team.playerCount ?? 0) >= 15) return false
    if ((team.remainingBudget ?? 0) < (player.price ?? 0)) return false
    if (Array.isArray(team.players) && team.players.some(p => p.id === player.id)) return false
    return true
  }

  const addButtonText = (player) => {
    if (!team) return 'Créer une équipe'
    if ((team.playerCount ?? 0) >= 15) return 'Équipe complète'
    if ((team.remainingBudget ?? 0) < (player.price ?? 0)) return 'Budget insuffisant'
    if (Array.isArray(team.players) && team.players.some(p => p.id === player.id)) return 'Déjà dans l\'équipe'
    return 'Ajouter'
  }

  const addPlayer = async (player) => {
    if (!team) {
      setMessage('Veuillez créer une équipe d\'abord.')
      onNavigate?.('myteam')
      return
    }
    try {
      setLoading(true)
      setMessage('')
      const body = JSON.stringify({ teamId: team.id, playerId: player.id })
      const updatedTeam = await fetchJson(ENDPOINTS.ADD_PLAYER, { method: 'POST', body })
      setTeam(updatedTeam)
      setMessage(`✅ ${player.name} ajouté ! Budget: ${updatedTeam.remainingBudget}M | Points: ${updatedTeam.totalPoints}`)
    } catch (err) {
      console.error('Add player error:', err)
      setError('Erreur lors de l\'ajout du joueur')
    } finally {
      setLoading(false)
    }
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-white/70 text-sm">Mode FantazyTeam</p>
        <h1 className="text-2xl md:text-3xl font-bold">Joueurs disponibles</h1>
      </div>
      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition">Retour</button>
        )}
        <button onClick={() => onNavigate?.('myteam')} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">Voir mon équipe</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: "url('/images/ar.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />
      <div className="ml-20 p-6 space-y-6">
        {header}

        <div className="bg-black/40 border border-white/10 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select value={position} onChange={(e) => setPosition(e.target.value)} className="px-3 py-2 bg-black/30 border border-white/10 rounded-md">
              <option value="">Toutes positions</option>
              <option value="GOALKEEPER">🧤 Gardiens</option>
              <option value="DEFENDER">🛡️ Défenseurs</option>
              <option value="MIDFIELDER">⚙️ Milieux</option>
              <option value="FORWARD">⚡ Attaquants</option>
            </select>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher un joueur..." className="px-3 py-2 bg-black/30 border border-white/10 rounded-md col-span-2" />
          </div>
        </div>

        {error && <div className="bg-red-900/40 border border-red-500/40 text-sm p-4 rounded-md">{error}</div>}
        {message && <div className="bg-green-900/30 border border-green-500/40 text-sm p-4 rounded-md">{message}</div>}

        {loading ? (
          <div className="text-white/80">Chargement des joueurs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="text-white/70">Aucun joueur trouvé</div>
            ) : (
              filtered.map((player) => (
                <div key={player.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    {player.imageUrl && (
                      <img src={player.imageUrl} alt={player.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{player.name}</h3>
                      <p className="text-white/70 text-sm">{emojiFor(player.position)} {labelFor(player.position)} • {player.club}</p>
                      <p className="text-white/60 text-xs">{player.nationality || 'N/A'}</p>
                    </div>
                    <span className="text-sm">💰 {player.price}M</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center mt-4 text-sm">
                    <Stat label="Points" value={player.totalPoints} />
                    <Stat label="Buts" value={player.goals} />
                    <Stat label="Passes" value={player.assists} />
                    <Stat label="Clean" value={player.cleanSheets} />
                  </div>

                  <div className="mt-4">
                    {canAddPlayer(player) ? (
                      <button onClick={() => addPlayer(player)} className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md">Ajouter</button>
                    ) : (
                      <button
                        onClick={!team ? () => onNavigate?.('myteam') : undefined}
                        disabled={!!team}
                        className="w-full px-3 py-2 bg-white/10 rounded-md"
                      >
                        {addButtonText(player)}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-md p-2">
      <p className="text-white/70 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

function emojiFor(position) {
  const emojis = { GOALKEEPER: '🧤', DEFENDER: '🛡️', MIDFIELDER: '⚙️', FORWARD: '⚡' }
  return emojis[position] || '⚽'
}

function labelFor(position) {
  const labels = { GOALKEEPER: 'Gardien', DEFENDER: 'Défenseur', MIDFIELDER: 'Milieu', FORWARD: 'Attaquant' }
  return labels[position] || position
}
