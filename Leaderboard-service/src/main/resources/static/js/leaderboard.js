// Configuration
const API_BASE_URL = 'http://localhost:8084/api/leaderboard';
const REFRESH_INTERVAL = 30000; // 30 secondes

let refreshTimer = null;

// ==================== INITIALISATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🏆 Leaderboard chargé');

    // Charger les stats globales
    loadGlobalStats();

    // Charger le classement des joueurs par défaut
    loadUsers();

    // Auto-refresh
    startAutoRefresh();
});

// ==================== STATS GLOBALES ====================

async function loadGlobalStats() {
    try {
        console.log('📊 Chargement stats globales...');

        const response = await fetch(`${API_BASE_URL}/stats/global`);

        if (response.ok) {
            const stats = await response.json();
            console.log('✅ Stats globales:', stats);

            document.getElementById('totalUsers').textContent = stats.totalUsers || 0;
            document.getElementById('totalTeams').textContent = stats.totalTeams || 0;
            document.getElementById('avgScore').textContent =
                stats.averageScore ?  Math.round(stats.averageScore) : 0;
            document.getElementById('topScore').textContent = stats.highestScore || 0;
        } else {
            console.warn('⚠️ Stats globales non disponibles');
            showDefaultStats();
        }
    } catch (error) {
        console.error('❌ Erreur stats globales:', error);
        showDefaultStats();
    }
}

function showDefaultStats() {
    document.getElementById('totalUsers').textContent = '0';
    document.getElementById('totalTeams').textContent = '0';
    document.getElementById('avgScore').textContent = '0';
    document.getElementById('topScore').textContent = '0';
}

// ==================== CLASSEMENT JOUEURS ====================

async function loadUsers() {
    const limit = document.getElementById('userLimit').value || 50;
    const tbody = document.getElementById('usersTable');

    try {
        console.log(`👥 Chargement top ${limit} joueurs...`);

        tbody.innerHTML = '<tr><td colspan="6" class="loading">Chargement...</td></tr>';

        const response = await fetch(`${API_BASE_URL}/users?limit=${limit}`);

        if (response.ok) {
            const users = await response. json();
            console.log(`✅ ${users.length} joueurs chargés`);

            if (users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="loading">Aucun joueur trouvé</td></tr>';
                return;
            }

            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>
                        <span class="rank-badge ${getRankClass(user.rank)}">
                            ${getRankEmoji(user.rank)} ${user.rank}
                        </span>
                    </td>
                    <td>
                        <strong>${escapeHtml(user.username)}</strong>
                        <br>
                        <small style="color: #666;">${user.userId. substring(0, 8)}...</small>
                    </td>
                    <td>⚽ ${user.fantasyPoints. toLocaleString()}</td>
                    <td>💬 ${user.socialPoints.toLocaleString()}</td>
                    <td>
                        <strong style="color: #667eea; font-size: 1.1em;">
                            🏆 ${user.totalScore.toLocaleString()}
                        </strong>
                    </td>
                    <td>${formatDate(user.lastUpdated)}</td>
                </tr>
            `).join('');

        } else {
            console.warn('⚠️ Erreur chargement joueurs:', response.status);
            tbody.innerHTML = '<tr><td colspan="6" class="loading">Erreur de chargement</td></tr>';
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="loading">❌ Erreur de connexion au serveur</td></tr>';
    }
}

// ==================== CLASSEMENT ÉQUIPES ====================

async function loadTeams() {
    const tbody = document.getElementById('teamsTable');

    try {
        console.log('⚽ Chargement classement équipes...');

        tbody.innerHTML = '<tr><td colspan="5" class="loading">Chargement...</td></tr>';

        const response = await fetch(`${API_BASE_URL}/teams? limit=50`);

        if (response.ok) {
            const teams = await response.json();
            console.log(`✅ ${teams.length} équipes chargées`);

            if (teams.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="loading">Aucune équipe trouvée</td></tr>';
                return;
            }

            tbody.innerHTML = teams.map(team => `
                <tr>
                    <td>
                        <span class="rank-badge ${getRankClass(team.rank)}">
                            ${getRankEmoji(team.rank)} ${team.rank}
                        </span>
                    </td>
                    <td>
                        <strong>${escapeHtml(team. teamName)}</strong>
                        <br>
                        <small style="color: #666;">${team.teamId.substring(0, 8)}...</small>
                    </td>
                    <td>
                        <small style="color: #666;">${team.userId.substring(0, 8)}...</small>
                    </td>
                    <td>
                        <strong style="color:  #667eea; font-size: 1.1em;">
                            🏆 ${team.totalPoints.toLocaleString()}
                        </strong>
                    </td>
                    <td>${formatDate(team.lastUpdated)}</td>
                </tr>
            `).join('');

        } else {
            console.warn('⚠️ Erreur chargement équipes');
            tbody.innerHTML = '<tr><td colspan="5" class="loading">Erreur de chargement</td></tr>';
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="loading">❌ Erreur de connexion</td></tr>';
    }
}

// ==================== POSTS TENDANCES ====================

async function loadTrending() {
    const grid = document.getElementById('trendingGrid');

    try {
        console.log('🔥 Chargement posts tendances...');

        grid. innerHTML = '<p class="loading">Chargement...</p>';

        const response = await fetch(`${API_BASE_URL}/trending? limit=20`);

        if (response.ok) {
            const posts = await response.json();
            console.log(`✅ ${posts.length} posts chargés`);

            if (posts.length === 0) {
                grid.innerHTML = '<p class="loading">Aucun post tendance pour le moment</p>';
                return;
            }

            grid.innerHTML = posts.map(post => `
                <div class="trending-card">
                    <h3>📝 Post #${post.rank}</h3>
                    <p><strong>Auteur:</strong> ${post.userId. substring(0, 8)}...</p>
                    <p style="color: #666; font-style: italic; margin:  10px 0;">
                        "${escapeHtml(post.content. substring(0, 100))}${post.content.length > 100 ? '...' : ''}"
                    </p>
                    <div style="display: flex; gap: 15px; margin-top: 10px;">
                        <span>❤️ ${post.likesCount}</span>
                        <span>💬 ${post.commentsCount}</span>
                    </div>
                    <span class="engagement-score">
                        🔥 ${post.engagementScore} points
                    </span>
                    <p style="color: #999; font-size: 0.9em; margin-top: 10px;">
                        ${formatDate(post.createdAt)}
                    </p>
                </div>
            `).join('');

        } else {
            console. warn('⚠️ Erreur chargement trending');
            grid.innerHTML = '<p class="loading">Erreur de chargement</p>';
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
        grid.innerHTML = '<p class="loading">❌ Erreur de connexion</p>';
    }
}

// ==================== GESTION ONGLETS ====================

function showTab(tabName) {
    console.log(`📑 Affichage onglet:  ${tabName}`);

    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList. remove('active');
    });

    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activer l'onglet sélectionné
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');

    // Charger les données
    if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'teams') {
        loadTeams();
    } else if (tabName === 'trending') {
        loadTrending();
    }
}

// ==================== AUTO-REFRESH ====================

function startAutoRefresh() {
    console.log('🔄 Auto-refresh activé (30s)');

    refreshTimer = setInterval(() => {
        console.log('🔄 Rafraîchissement automatique.. .');

        loadGlobalStats();

        // Rafraîchir l'onglet actif
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab. id === 'users-tab') {
            loadUsers();
        } else if (activeTab.id === 'teams-tab') {
            loadTeams();
        } else if (activeTab.id === 'trending-tab') {
            loadTrending();
        }
    }, REFRESH_INTERVAL);
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        console.log('⏸️ Auto-refresh arrêté');
    }
}

// ==================== UTILITAIRES ====================

function getRankClass(rank) {
    if (rank === 1) return 'rank-1';
    if (rank === 2) return 'rank-2';
    if (rank === 3) return 'rank-3';
    return 'rank-other';
}

function getRankEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '🏅';
}

function formatDate(dateString) {
    if (!dateString) return '-';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math. floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Nettoyer au déchargement de la page
window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});