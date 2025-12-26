import { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'

const FANTASY_BASE_URL = process.env.REACT_APP_FANTASY_BASE_URL || 'http://localhost:8082'

const ENDPOINTS = {
  USER_TEAMS: (userId) => `/api/fantasy/teams/user/${userId}`,
  CREATE_TEAM: '/api/fantasy/teams',
  REMOVE_PLAYER: (teamId, playerId) => `/api/fantasy/teams/${teamId}/players/${playerId}`,
}

export default function MyTeamPage({ onLogout, onBack, onNavigate }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [team, setTeam] = useState(null)
  const [teamName, setTeamName] = useState('')

  const userId = localStorage.getItem('userId') || ''

  const fetchJson = async (path, init) => {
    const url = `${FANTASY_BASE_URL}${path}`
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...init })
    if (!res.ok) throw new Error(await res.text())
    if (res.status === 204) return null
    return res.json()
  }

  const loadTeam = async () => {
    setLoading(true)
    setError('')
    try {
      const teams = userId ? await fetchJson(ENDPOINTS.USER_TEAMS(userId)) : []
      const t = Array.isArray(teams) && teams.length > 0 ? teams[0] : null
      setTeam(t)
    } catch (err) {
      console.error('Load team error:', err)
      setError("Erreur lors du chargement de l'équipe")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTeam() }, [userId])

  const createTeam = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setMessage('')
      const body = JSON.stringify({ userId, teamName })
      const newTeam = await fetchJson(ENDPOINTS.CREATE_TEAM, { method: 'POST', body })
      setTeam(newTeam)
      setTeamName('')
      setMessage(`Équipe "${newTeam.teamName}" créée avec succès !`)
    } catch (err) {
      console.error('Create team error:', err)
      setError("Erreur lors de la création de l'équipe")
    } finally {
      setLoading(false)
    }
  }

  const removePlayer = async (playerId) => {
    if (!team) return
    if (!window.confirm('Voulez-vous vraiment retirer ce joueur ?')) return
    try {
      setLoading(true)
      setMessage('')
      const updated = await fetchJson(ENDPOINTS.REMOVE_PLAYER(team.id, playerId), { method: 'DELETE' })
      setTeam(updated)
      setMessage('Joueur retiré de l\'équipe')
    } catch (err) {
      console.error('Remove player error:', err)
      setError('Erreur lors du retrait du joueur')
    } finally {
      setLoading(false)
    }
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div>
        <p className="text-white/70 text-sm">Mode FantazyTeam</p>
        <h1 className="text-2xl md:text-3xl font-bold">Mon Équipe</h1>
      </div>
      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition">Retour</button>
        )}
        <button onClick={() => onNavigate?.('players')} className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition">Ajouter des joueurs</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: "url('/images/ar.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />
      <div className="ml-20 p-6 space-y-6">
        {header}

        {error && <div className="bg-red-900/40 border border-red-500/40 text-sm p-4 rounded-md">{error}</div>}
        {message && <div className="bg-green-900/30 border border-green-500/40 text-sm p-4 rounded-md">{message}</div>}

        {loading ? (
          <div className="text-white/80">Chargement...</div>
        ) : team ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Budget restant" value={`${team.remainingBudget}M`} />
              <StatCard label="Points totaux" value={team.totalPoints} />
              <StatCard label="Joueurs" value={`${team.playerCount}/15`} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{team.teamName}</h2>

              <Position title="🧤 Gardiens" players={filterPos(team.players, 'GOALKEEPER')} onRemove={removePlayer} />
              <Position title="🛡️ Défenseurs" players={filterPos(team.players, 'DEFENDER')} onRemove={removePlayer} />
              <Position title="⚙️ Milieux" players={filterPos(team.players, 'MIDFIELDER')} onRemove={removePlayer} />
              <Position title="⚡ Attaquants" players={filterPos(team.players, 'FORWARD')} onRemove={removePlayer} />
            </div>
          </div>
        ) : (
          <div className="bg-black/40 border border-white/10 rounded-lg p-6 max-w-xl">
            <h2 className="text-xl font-semibold mb-2">🎯 Créez votre équipe !</h2>
            <p className="text-white/70 mb-4">Vous n'avez pas encore d'équipe. Créez-en une pour commencer !</p>
            <form className="space-y-3" onSubmit={createTeam}>
              <div>
                <label className="block text-sm text-white/70 mb-1">Nom de votre équipe</label>
                <input value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="Ex: Dream Team" required minLength={3} className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-md" />
              </div>
              <button type="submit" className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">Créer mon équipe</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <p className="text-white/70 text-sm">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}

function Position({ title, players, onRemove }) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      {(!players || players.length === 0) ? (
        <p className="text-white/60">Aucun joueur</p>
      ) : (
        <div className="space-y-3">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between bg-black/30 border border-white/10 rounded-md p-3 gap-3">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              )}
              <div className="flex-1">
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-white/70 text-sm">{p.club} • {p.price}M</p>
                <p className="text-white/60 text-xs"><strong>{p.totalPoints}</strong> points (⚽{p.goals} 🎯{p.assists})</p>
              </div>
              <button onClick={() => onRemove(p.id)} className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md flex-shrink-0">Retirer</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function filterPos(players, pos) {
  if (!Array.isArray(players)) return []
  return players.filter(p => p.position === pos)
}
