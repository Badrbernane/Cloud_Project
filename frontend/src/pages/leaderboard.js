import { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar'

const LEADERBOARD_API = process.env.REACT_APP_LEADERBOARD_API || 'http://localhost:8084/api/leaderboard'

export default function LeaderboardPage({ onLogout, onBack, onNavigate }) {
  const [tab, setTab] = useState('users') // users | teams | trending
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState('')
  const [stats, setStats] = useState({ totalUsers: 0, totalTeams: 0, averageScore: 0, highestScore: 0 })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [posts, setPosts] = useState([])
  const [userLimit, setUserLimit] = useState(50)

  const fetchJson = async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  // Load global stats
  useEffect(() => {
    const loadStats = async () => {
      setLoadingStats(true)
      setStatsError('')
      try {
        const data = await fetchJson(`${LEADERBOARD_API}/stats/global`)
        setStats({
          totalUsers: data.totalUsers || 0,
          totalTeams: data.totalTeams || 0,
          averageScore: data.averageScore ? Math.round(data.averageScore) : 0,
          highestScore: data.highestScore || 0,
        })
      } catch (err) {
        console.error('Leaderboard stats error:', err)
        setStatsError("Stats globales non disponibles")
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [])

  // Load current tab content
  const loadTab = async (activeTab = tab, limit = userLimit) => {
    setLoading(true)
    setError('')
    try {
      if (activeTab === 'users') {
        const data = await fetchJson(`${LEADERBOARD_API}/users?limit=${limit}`)
        setUsers(Array.isArray(data) ? data : [])
      } else if (activeTab === 'teams') {
        const data = await fetchJson(`${LEADERBOARD_API}/teams?limit=50`)
        setTeams(Array.isArray(data) ? data : [])
      } else if (activeTab === 'trending') {
        const data = await fetchJson(`${LEADERBOARD_API}/trending?limit=20`)
        setPosts(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('Leaderboard tab load error:', err)
      setError('Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTab(tab, userLimit) }, [tab])
  useEffect(() => { if (tab === 'users') loadTab('users', userLimit) }, [userLimit])

  return (
    <div className="min-h-screen text-white" style={{ backgroundImage: "url('/images/ar.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} />
      <div className="ml-20 p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-white/70 text-sm">Service Leaderboard</p>
            <h1 className="text-2xl md:text-3xl font-bold">Classement Global</h1>
            <p className="text-white/70 text-sm">Top joueurs, équipes et posts tendances</p>
          </div>
          <div className="flex gap-3">
            {onBack && (
              <button onClick={onBack} className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition">Retour</button>
            )}
            <button onClick={() => onNavigate?.('fantazy')} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">Aller au Fantazy</button>
          </div>
        </div>

        {/* Global stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Joueurs Actifs" value={loadingStats ? '...' : stats.totalUsers} />
          <StatCard label="Équipes" value={loadingStats ? '...' : stats.totalTeams} />
          <StatCard label="Score Moyen" value={loadingStats ? '...' : stats.averageScore} />
          <StatCard label="Meilleur Score" value={loadingStats ? '...' : stats.highestScore} />
        </div>
        {statsError && <div className="bg-red-900/40 border border-red-500/40 text-sm p-4 rounded-md">{statsError}</div>}

        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton active={tab === 'users'} onClick={() => setTab('users')}>👤 Classement Joueurs</TabButton>
          <TabButton active={tab === 'teams'} onClick={() => setTab('teams')}>⚽ Classement Équipes</TabButton>
          <TabButton active={tab === 'trending'} onClick={() => setTab('trending')}>🔥 Posts Tendances</TabButton>
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          {tab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">🏆 Top Joueurs</h2>
                <select value={userLimit} onChange={(e) => setUserLimit(Number(e.target.value))} className="px-3 py-2 bg-black/30 border border-white/10 rounded-md">
                  <option value={10}>Top 10</option>
                  <option value={25}>Top 25</option>
                  <option value={50}>Top 50</option>
                  <option value={100}>Top 100</option>
                </select>
              </div>
              {loading ? (
                <div className="text-white/70">Chargement...</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-white/70">
                      <tr>
                        <th className="text-left p-2">🏅 Rang</th>
                        <th className="text-left p-2">👤 Joueur</th>
                        <th className="text-left p-2">⚽ Points Fantasy</th>
                        <th className="text-left p-2">💬 Points Sociaux</th>
                        <th className="text-left p-2">🏆 Score Total</th>
                        <th className="text-left p-2">📅 Dernière MAJ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td className="p-2 text-white/70" colSpan={6}>Aucun joueur trouvé</td></tr>
                      ) : (
                        users.map((u) => (
                          <tr key={`${u.userId}-${u.rank}`} className="border-t border-white/10">
                            <td className="p-2"><RankBadge rank={u.rank} /></td>
                            <td className="p-2">
                              <div className="font-semibold">{u.username}</div>
                              <div className="text-white/60 text-xs">{(u.userId || '').slice(0, 8)}...</div>
                            </td>
                            <td className="p-2">⚽ {formatNumber(u.fantasyPoints)}</td>
                            <td className="p-2">💬 {formatNumber(u.socialPoints)}</td>
                            <td className="p-2 text-indigo-300 font-semibold">🏆 {formatNumber(u.totalScore)}</td>
                            <td className="p-2">{formatDate(u.lastUpdated)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'teams' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">⚽ Top Équipes</h2>
              {loading ? (
                <div className="text-white/70">Chargement...</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div className="overflow-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-white/70">
                      <tr>
                        <th className="text-left p-2">🏅 Rang</th>
                        <th className="text-left p-2">⚽ Équipe</th>
                        <th className="text-left p-2">👤 Propriétaire</th>
                        <th className="text-left p-2">🏆 Points Totaux</th>
                        <th className="text-left p-2">📅 Dernière MAJ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teams.length === 0 ? (
                        <tr><td className="p-2 text-white/70" colSpan={5}>Aucune équipe trouvée</td></tr>
                      ) : (
                        teams.map((t) => (
                          <tr key={`${t.teamId}-${t.rank}`} className="border-t border-white/10">
                            <td className="p-2"><RankBadge rank={t.rank} /></td>
                            <td className="p-2">
                              <div className="font-semibold">{t.teamName}</div>
                              <div className="text-white/60 text-xs">{(t.teamId || '').slice(0, 8)}...</div>
                            </td>
                            <td className="p-2 text-white/60 text-xs">{(t.userId || '').slice(0, 8)}...</td>
                            <td className="p-2 text-indigo-300 font-semibold">🏆 {formatNumber(t.totalPoints)}</td>
                            <td className="p-2">{formatDate(t.lastUpdated)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === 'trending' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">🔥 Posts les Plus Populaires</h2>
              {loading ? (
                <div className="text-white/70">Chargement...</div>
              ) : error ? (
                <div className="text-red-400">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {posts.length === 0 ? (
                    <div className="text-white/70">Aucun post tendance pour le moment</div>
                  ) : (
                    posts.map((p) => (
                      <div key={`${p.userId}-${p.rank}`} className="bg-black/30 border border-white/10 rounded-lg p-4">
                        <h3 className="font-semibold">📝 Post #{p.rank}</h3>
                        <p className="text-white/60 text-sm">Auteur: {(p.userId || '').slice(0, 8)}...</p>
                        <p className="italic text-white/70 my-2">"{(p.content || '').slice(0, 100)}{(p.content || '').length > 100 ? '...' : ''}"</p>
                        <div className="flex gap-4 text-sm mt-2">
                          <span>❤️ {p.likesCount}</span>
                          <span>💬 {p.commentsCount}</span>
                        </div>
                        <div className="mt-2 text-indigo-300 font-semibold">🔥 {p.engagementScore} points</div>
                        <p className="text-white/60 text-xs mt-2">{formatDate(p.createdAt)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
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

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-md border border-white/10 ${active ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}>{children}</button>
  )
}

function RankBadge({ rank }) {
  const cls = rank === 1 ? 'bg-yellow-600/60' : rank === 2 ? 'bg-gray-400/60' : rank === 3 ? 'bg-orange-600/60' : 'bg-white/10'
  const emoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '🏅'
  return <span className={`inline-block px-2 py-1 rounded ${cls}`}>{emoji} {rank}</span>
}

function formatNumber(n) { return (n ?? 0).toLocaleString() }

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return "À l'instant"
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}
