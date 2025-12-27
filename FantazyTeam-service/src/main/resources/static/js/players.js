let allPlayers = [];
let currentTeam = null;
let currentUserId = null;

// Charger les joueurs au chargement de la page
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Page players.html chargée');

    currentUserId = getUserId();
    console.log('🔍 currentUserId:', currentUserId);

    if (!currentUserId) {
        console.error('❌ Pas de userId');
        showError('Vous devez être connecté pour voir les joueurs');
        setTimeout(() => {
            window.location.href = 'http://localhost:8081/login.html';
        }, 2000);
        return;
    }

    // ✅ Charger joueurs et équipe EN PARALLÈLE
    setLoading(true);

    try {
        await loadPlayers();
        await loadUserTeam();

        // ✅ AFFICHER APRÈS que tout soit chargé
        displayPlayers(allPlayers);

    } catch (error) {
        console.error('❌ Erreur chargement:', error);
        showError('Erreur lors du chargement:  ' + error.message);
    } finally {
        setLoading(false);
    }

    setupFilters();
});

// Charger tous les joueurs
async function loadPlayers() {
    console.log('🔍 loadPlayers() - Start');

    try {
        allPlayers = await fetchAPI(ENDPOINTS.PLAYERS);
        console.log('✅ Joueurs chargés:', allPlayers.length);
        console.log('✅ Premier joueur:', allPlayers[0]);
    } catch (error) {
        console.error('❌ Erreur chargement joueurs:', error);
        throw error;
    }
}

// Charger l'équipe de l'utilisateur
async function loadUserTeam() {
    console.log('🔍 loadUserTeam() - Start');
    console.log('🔍 currentUserId:', currentUserId);

    if (!currentUserId) {
        console.error('❌ Pas de userId dans loadUserTeam');
        return;
    }

    try {
        const endpoint = ENDPOINTS.USER_TEAMS(currentUserId);
        console.log('🔍 Fetching:', endpoint);

        const teams = await fetchAPI(endpoint);

        console.log('🔍 Réponse teams:', teams);
        console.log('🔍 Type:', typeof teams);
        console.log('🔍 Is Array:', Array.isArray(teams));
        console.log('🔍 Length:', teams?. length);

        if (teams && teams.length > 0) {
            currentTeam = teams[0];
            console.log('✅ Équipe chargée: ');
            console.log('  - ID:', currentTeam.id);
            console.log('  - Nom:', currentTeam.teamName);
            console.log('  - Joueurs:', currentTeam.playerCount);
            console.log('  - Budget restant:', currentTeam.remainingBudget);
            console.log('  - Players array:', currentTeam.players);
            console.log('  - Objet complet:', currentTeam);
        } else {
            console.warn('⚠️ Pas d\'équipe trouvée (teams vide ou null)');
            currentTeam = null;
        }
    } catch (error) {
        console.error('❌ Erreur chargement équipe:', error);
        console.error('❌ Message:', error.message);
        currentTeam = null;
    }

    console.log('🔍 loadUserTeam() - End');
    console.log('🔍 currentTeam final:', currentTeam);
}

// Afficher les joueurs
function displayPlayers(players) {
    console.log('🔍 displayPlayers() - Start');
    console.log('🔍 Nombre de joueurs à afficher:', players.length);
    console.log('🔍 currentTeam dans displayPlayers:', currentTeam);

    const container = document.getElementById('playersList');
    if (!container) {
        console.error('❌ Container playersList introuvable');
        return;
    }

    if (players.length === 0) {
        container.innerHTML = '<p class="empty-message">Aucun joueur trouvé</p>';
        return;
    }

    container. innerHTML = players.map((player, index) => {
        const canAdd = canAddPlayer(player);
        const buttonText = getAddButtonText(player);
        const isNoTeam = !currentTeam;

        if (index === 0) {
            console.log(`🔍 Premier joueur (${player.name}):`);
            console.log('  - canAdd:', canAdd);
            console.log('  - buttonText:', buttonText);
            console.log('  - isNoTeam:', isNoTeam);
        }

        return `
            <div class="player-card">
                <h3>${player.name}</h3>
                <span class="player-position">
                    ${getPositionEmoji(player.position)} ${getPositionLabel(player.position)}
                </span>
                <p class="player-info">🏟️ ${player.club}</p>
                <p class="player-info">🌍 ${player.nationality || 'N/A'}</p>
                
                <div class="player-stats">
                    <div class="player-stat">
                        <span class="player-stat-label">Points</span>
                        <span class="player-stat-value">${player.totalPoints}</span>
                    </div>
                    <div class="player-stat">
                        <span class="player-stat-label">Buts</span>
                        <span class="player-stat-value">${player.goals}</span>
                    </div>
                    <div class="player-stat">
                        <span class="player-stat-label">Passes</span>
                        <span class="player-stat-value">${player.assists}</span>
                    </div>
                    <div class="player-stat">
                        <span class="player-stat-label">Clean Sheets</span>
                        <span class="player-stat-value">${player.cleanSheets}</span>
                    </div>
                </div>

                <div class="player-actions">
                    <span class="player-price">💰 ${player.price}M</span>
                    ${canAdd ?
            `<button class="btn btn-primary btn-small" onclick="addPlayerToTeam('${player.id}')">
                            Ajouter
                        </button>` :
            isNoTeam ?
                `<button class="btn btn-secondary btn-small" onclick="goToCreateTeam()">
                            Créer une équipe
                        </button>` :
                `<button class="btn btn-secondary btn-small" disabled>
                            ${buttonText}
                        </button>`
        }
                </div>
            </div>
        `;
    }).join('');

    console.log('✅ displayPlayers() - End');
}

// Rediriger vers la création d'équipe
function goToCreateTeam() {
    console.log('🔄 Redirection vers my-team.html');
    window.location.href = 'my-team.html';
}

// Vérifier si on peut ajouter le joueur
function canAddPlayer(player) {
    console.log(`🔍 canAddPlayer(${player.name})`);
    console.log('  - currentTeam existe:', !!currentTeam);

    if (!currentTeam) {
        console.log('  ❌ Pas d\'équipe');
        return false;
    }

    console.log('  - playerCount:', currentTeam.playerCount);
    console.log('  - remainingBudget:', currentTeam.remainingBudget);
    console.log('  - player. price:', player.price);

    if (currentTeam.playerCount >= 15) {
        console.log('  ❌ Équipe complète');
        return false;
    }

    if (currentTeam.remainingBudget < player.price) {
        console.log('  ❌ Budget insuffisant');
        return false;
    }

    if (currentTeam.players && currentTeam.players.some(p => p.id === player.id)) {
        console.log('  ❌ Joueur déjà dans équipe');
        return false;
    }

    console. log('  ✅ Peut ajouter');
    return true;
}

// Texte du bouton selon le contexte
function getAddButtonText(player) {
    if (! currentTeam) return 'Créer une équipe';
    if (currentTeam.playerCount >= 15) return 'Équipe complète';
    if (currentTeam.remainingBudget < player.price) return 'Budget insuffisant';
    if (currentTeam.players && currentTeam.players.some(p => p.id === player.id)) return 'Déjà dans l\'équipe';
    return 'Ajouter';
}

// Ajouter un joueur à l'équipe
async function addPlayerToTeam(playerId) {
    console.log('➕ addPlayerToTeam() - Start');
    console.log('  - playerId:', playerId);
    console.log('  - currentTeam:', currentTeam);

    if (!currentTeam) {
        console.error('❌ Pas d\'équipe');
        showError('Vous devez d\'abord créer une équipe');
        setTimeout(() => {
            window.location.href = 'my-team.html';
        }, 1500);
        return;
    }

    // Trouver le joueur
    const player = allPlayers.find(p => p.id === playerId);
    console.log('  - Joueur trouvé:', player);

    if (!player) {
        console.error('❌ Joueur introuvable');
        showError('Joueur introuvable');
        return;
    }

    // Vérifications
    if (currentTeam.playerCount >= 15) {
        console.error('❌ Équipe complète');
        showError('Votre équipe est complète (15 joueurs max)');
        return;
    }

    if (currentTeam.remainingBudget < player.price) {
        console.error('❌ Budget insuffisant');
        showError(`Budget insuffisant !  Il vous reste ${currentTeam.remainingBudget}M et ${player.name} coûte ${player.price}M`);
        return;
    }

    if (currentTeam.players && currentTeam.players.some(p => p.id === playerId)) {
        console.error('❌ Joueur déjà dans équipe');
        showError(`${player.name} est déjà dans votre équipe`);
        return;
    }

    try {
        const data = {
            teamId: currentTeam.id,
            playerId: playerId
        };

        console.log('📤 POST /add-player avec data:', data);

        const updatedTeam = await fetchAPI(ENDPOINTS.ADD_PLAYER, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        console.log('✅ Réponse API:', updatedTeam);

        currentTeam = updatedTeam;

        showSuccess(`✅ ${player.name} ajouté à votre équipe !  Budget restant:  ${updatedTeam.remainingBudget}M | Points: ${updatedTeam.totalPoints}`);

        // Recharger l'affichage
        console.log('🔄 Rafraîchissement affichage');
        displayPlayers(allPlayers);

    } catch (error) {
        console.error('❌ Erreur lors de l\'ajout:', error);
        showError('❌ Erreur lors de l\'ajout du joueur:  ' + error.message);
    }
}

// Configuration des filtres
function setupFilters() {
    const positionFilter = document.getElementById('positionFilter');
    const searchInput = document.getElementById('searchPlayer');

    if (positionFilter) {
        positionFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// javascript
// File: `FantazyTeam-service/src/main/resources/static/js/players.js`
function applyFilters() {
    const position = document.getElementById('positionFilter').value;
    const search = document.getElementById('searchPlayer').value.toLowerCase();

    let filtered = allPlayers;

    if (position) {
        filtered = filtered.filter(p => p.position === position);
    }

    if (search) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.club.toLowerCase().includes(search) ||
            (p.nationality && p.nationality.toLowerCase().includes(search))
        );
    }

    displayPlayers(filtered);
}

console.log('✅ Players script loaded');