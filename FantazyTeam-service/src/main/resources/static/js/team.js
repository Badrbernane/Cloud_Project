let myTeam = null;

// Charger l'équipe au chargement de la page
window.addEventListener('DOMContentLoaded', async () => {
    await loadMyTeam();
});

// Charger l'équipe de l'utilisateur
async function loadMyTeam() {
    const userId = getUserId();
    if (!userId) {
        showError('Vous devez être connecté');
        return;
    }

    setLoading(true);

    try {
        const teams = await fetchAPI(ENDPOINTS.USER_TEAMS(userId));

        if (teams && teams.length > 0) {
            myTeam = teams[0];
            displayTeam(myTeam);
        } else {
            showNoTeam();
        }
    } catch (error) {
        showError('Erreur lors du chargement de l\'équipe: ' + error.message);
    } finally {
        setLoading(false);
    }
}

// Afficher formulaire de création d'équipe
function showNoTeam() {
    document.getElementById('noTeam').style.display = 'block';
    document.getElementById('teamContainer').style.display = 'none';

    const form = document.getElementById('createTeamForm');
    form.addEventListener('submit', handleCreateTeam);
}

// Créer une équipe
async function handleCreateTeam(event) {
    event.preventDefault();

    const userId = getUserId();
    const teamName = document.getElementById('teamName').value;

    try {
        const data = {
            userId: userId,
            teamName: teamName
        };

        myTeam = await fetchAPI(ENDPOINTS. TEAMS, {
            method: 'POST',
            body: JSON. stringify(data)
        });

        showSuccess(`Équipe "${teamName}" créée avec succès !`);
        displayTeam(myTeam);

    } catch (error) {
        showError('Erreur lors de la création de l\'équipe:  ' + error.message);
    }
}

// Afficher l'équipe
function displayTeam(team) {
    document.getElementById('noTeam').style.display = 'none';
    document.getElementById('teamContainer').style.display = 'block';

    // Header
    document.getElementById('teamNameDisplay').textContent = team.teamName;
    document.getElementById('remainingBudget').textContent = team.remainingBudget + 'M';
    document.getElementById('totalPoints').textContent = team.totalPoints;
    document.getElementById('playerCount').textContent = `${team.playerCount}/15`;

    // Grouper les joueurs par position
    const positions = {
        GOALKEEPER: [],
        DEFENDER: [],
        MIDFIELDER: [],
        FORWARD: []
    };

    if (team.players && team.players.length > 0) {
        team.players. forEach(player => {
            if (positions[player.position]) {
                positions[player.position].push(player);
            }
        });
    }

    // Afficher chaque position
    displayPosition('goalkeepers', positions.GOALKEEPER);
    displayPosition('defenders', positions.DEFENDER);
    displayPosition('midfielders', positions. MIDFIELDER);
    displayPosition('forwards', positions.FORWARD);
}

// Afficher les joueurs d'une position
function displayPosition(containerId, players) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (players.length === 0) {
        container.innerHTML = '<p class="empty-position">Aucun joueur</p>';
        return;
    }

    container.innerHTML = players.map(player => `
        <div class="team-player-card">
            <div class="team-player-info">
                <h4>${player.name}</h4>
                <p>${player.club} | ${player.price}M</p>
                <p><strong>${player.totalPoints} points</strong> (⚽${player.goals} 🎯${player.assists})</p>
            </div>
            <button class="btn btn-danger btn-small" onclick="removePlayer('${player.id}')">
                Retirer
            </button>
        </div>
    `).join('');
}

// Retirer un joueur
async function removePlayer(playerId) {
    if (!myTeam) return;

    if (! confirm('Voulez-vous vraiment retirer ce joueur ?')) {
        return;
    }

    try {
        const updatedTeam = await fetchAPI(
            ENDPOINTS.REMOVE_PLAYER(myTeam.id, playerId),
            { method: 'DELETE' }
        );

        myTeam = updatedTeam;
        showSuccess('Joueur retiré de l\'équipe');
        displayTeam(myTeam);

    } catch (error) {
        showError('Erreur lors du retrait du joueur: ' + error.message);
    }
}

console.log('✅ Team script loaded');