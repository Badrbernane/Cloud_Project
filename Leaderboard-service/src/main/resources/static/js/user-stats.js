// Configuration
const API_BASE_URL = 'http://localhost:8084/api/leaderboard';

// Récupérer l'userId depuis l'URL
const urlParams = new URLSearchParams(window. location.search);
const userId = urlParams.get('userId');

// ==================== INITIALISATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Stats utilisateur chargées pour:', userId);

    if (!userId) {
        alert('❌ ID utilisateur manquant');
        window.location.href = 'index.html';
        return;
    }

    loadUserStats();
});

// ==================== CHARGEMENT STATS ====================

async function loadUserStats() {
    try {
        console.log(`📡 Chargement stats pour ${userId}...`);

        const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`);

        if (response.ok) {
            const stats = await response.json();
            console.log('✅ Stats:', stats);

            displayStats(stats);
        } else {
            console.error('❌ Erreur:', response.status);
            showError('Utilisateur non trouvé dans le leaderboard');
        }

    } catch (error) {
        console.error('❌ Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
}

// ==================== AFFICHAGE ====================

function displayStats(stats) {
    // Nom du joueur
    document.getElementById('playerName').textContent =
        `👤 ${stats.username || 'Joueur inconnu'}`;

    // Informations principales
    document.getElementById('playerStats').innerHTML = `
        <p style="font-size: 1.1em; margin:  10px 0;">
            <strong>🔑 ID:</strong> ${stats.userId}
        </p>
        <p style="font-size: 1.1em; margin: 10px 0;">
            <strong>👥 Total joueurs:</strong> ${stats.totalUsers. toLocaleString()}
        </p>
    `;

    // Classement
    document.getElementById('userRank').textContent =
        `${getRankEmoji(stats.currentRank)} #${stats.currentRank}`;

    // Score total
    document.getElementById('totalScore').textContent =
        `${stats.totalScore.toLocaleString()} pts`;

    // Percentile
    document.getElementById('percentile').textContent =
        stats.percentile ?  `Top ${stats.percentile. toFixed(1)}%` : '-';

    // Détails
    document.getElementById('detailedStats').innerHTML = `
        <div style="display: grid; gap: 15px;">
            <div style="padding: 15px; background: #f7fafc; border-radius: 10px;">
                <p style="margin: 5px 0;">
                    <strong>⚽ Points Fantasy:</strong> 
                    <span style="color: #667eea; font-size: 1.2em; font-weight: bold;">
                        ${stats.fantasyPoints.toLocaleString()}
                    </span>
                </p>
            </div>
            
            <div style="padding: 15px; background: #f7fafc; border-radius: 10px;">
                <p style="margin: 5px 0;">
                    <strong>💬 Points Sociaux:</strong> 
                    <span style="color: #38b2ac; font-size: 1.2em; font-weight: bold;">
                        ${stats.socialPoints.toLocaleString()}
                    </span>
                </p>
            </div>
            
            <div style="padding: 15px; background: #f7fafc; border-radius: 10px;">
                <p style="margin: 5px 0;">
                    <strong>🏆 Score Total:</strong> 
                    <span style="color: #764ba2; font-size: 1.2em; font-weight: bold;">
                        ${stats.totalScore.toLocaleString()}
                    </span>
                </p>
            </div>
            
            <div style="padding:  15px; background: #f7fafc; border-radius:  10px;">
                <p style="margin: 5px 0;">
                    <strong>📊 Classement:</strong> 
                    <span style="font-size: 1.2em; font-weight: bold;">
                        ${getRankEmoji(stats.currentRank)} #${stats.currentRank} / ${stats.totalUsers}
                    </span>
                </p>
            </div>
            
            <div style="padding:  15px; background: #f7fafc; border-radius:  10px;">
                <p style="margin: 5px 0;">
                    <strong>📈 Percentile:</strong> 
                    <span style="color: #f59e0b; font-size: 1.2em; font-weight: bold;">
                        ${stats.percentile ? `Top ${stats.percentile.toFixed(1)}%` : 'N/A'}
                    </span>
                </p>
            </div>
        </div>
    `;
}

// ==================== GESTION ERREURS ====================

function showError(message) {
    document.getElementById('playerName').textContent = '❌ Erreur';
    document.getElementById('playerStats').innerHTML = `
        <p style="color: #f56565; font-weight: bold;">${message}</p>
        <p style="margin-top: 15px;">
            <a href="index.html" class="btn btn-primary">Retour au classement</a>
        </p>
    `;

    document.getElementById('userRank').textContent = '-';
    document.getElementById('totalScore').textContent = '-';
    document.getElementById('percentile').textContent = '-';
    document.getElementById('detailedStats').innerHTML = '';
}

// ==================== UTILITAIRES ====================

function getRankEmoji(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏅';
    return '📊';
}