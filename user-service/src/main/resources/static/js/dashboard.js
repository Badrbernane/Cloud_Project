// Vérifier si l'utilisateur est connecté
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const username = localStorage.getItem('username');

if (!token || !userId) {
    alert('⚠️ Vous devez être connecté pour accéder à cette page');
    window.location. href = 'login.html';
}

// Charger les informations utilisateur depuis localStorage
async function loadUserProfile() {
    try {
        const email = localStorage.getItem('email') || 'Non disponible';
        const countryCode = localStorage.getItem('countryCode') || 'DZ';
        const createdAt = localStorage.getItem('createdAt') || new Date().toISOString();

        const countryFlags = {
            'DZ': '🇩🇿 Algérie',
            'FR': '🇫🇷 France',
            'MA': '🇲🇦 Maroc',
            'TN': '🇹🇳 Tunisie',
            'US': '🇺🇸 USA',
            'GB': '🇬🇧 Royaume-Uni',
            'ES': '🇪🇸 Espagne'
        };

        document.getElementById('profileData').innerHTML = `
            <p style="font-size: 1.1em; margin:  10px 0;">
                <strong>👤 Nom d'utilisateur:</strong> ${username}
            </p>
            <p style="font-size:  1.1em; margin: 10px 0;">
                <strong>📧 Email:</strong> ${email}
            </p>
            <p style="font-size: 1.1em; margin: 10px 0;">
                <strong>🌍 Pays:</strong> ${countryFlags[countryCode] || countryCode}
            </p>
            <p style="font-size: 1.1em; margin: 10px 0;">
                <strong>📅 Membre depuis:</strong> ${new Date(createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
            </p>
            <p style="font-size:  0.9em; color: #666; margin: 10px 0;">
                <strong>🔑 ID: </strong> ${userId}
            </p>
        `;

    } catch (error) {
        console.error('Erreur chargement profil:', error);
        document.getElementById('profileData').innerHTML = `
            <p style="color: #f56565;">❌ Erreur de chargement du profil</p>
            <p><strong>👤 Nom: </strong> ${username}</p>
            <p><strong>🔑 ID:</strong> ${userId}</p>
        `;
    }
}

// Charger les statistiques du leaderboard
async function loadLeaderboardStats() {
    try {
        console.log(`Chargement des stats pour userId: ${userId}`);

        const response = await fetch(`http://localhost:8084/api/leaderboard/users/${userId}/stats`);

        if (response.ok) {
            const stats = await response. json();

            console.log('Stats reçues:', stats);

            // Afficher les scores
            document.querySelector('#userScore . score-value').textContent = stats.totalScore || 0;
            document.querySelector('#userRank .rank-value').textContent = stats.currentRank || '-';

            if (stats.percentile) {
                document.querySelector('#userPercentile .rank-value').textContent =
                    `${stats.percentile. toFixed(1)}%`;
            }

            // Détails des points
            document.getElementById('fantasyPoints').textContent = stats. fantasyPoints || 0;
            document.getElementById('socialPoints').textContent = stats.socialPoints || 0;
            document.getElementById('totalPoints').textContent = stats.totalScore || 0;

        } else {
            console.warn('Pas de stats disponibles (HTTP ' + response.status + ')');
            showNoStatsMessage();
        }
    } catch (error) {
        console.error('Erreur chargement stats:', error);
        showNoStatsMessage();
    }
}

function showNoStatsMessage() {
    document.querySelector('#userScore .score-value').textContent = '0';
    document. querySelector('#userRank .rank-value').textContent = '-';
    document.querySelector('#userPercentile .rank-value').textContent = '-';

    document.getElementById('fantasyPoints').textContent = '0';
    document.getElementById('socialPoints').textContent = '0';
    document.getElementById('totalPoints').textContent = '0';

    const detailsDiv = document.getElementById('pointsDetails');
    detailsDiv.innerHTML += `
        <p style="color: #f59e0b; margin-top: 15px;">
            ⚠️ Aucune statistique disponible pour le moment
        </p>
    `;
}

// Déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard chargé pour:', username);
    loadUserProfile();
    loadLeaderboardStats();
});