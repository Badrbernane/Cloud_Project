// ✅ Récupérer et sauvegarder les paramètres URL au chargement
function loadUserFromURL() {
    const params = new URLSearchParams(window.location. search);

    const userId = params.get('userId');
    const username = params.get('username');
    const email = params.get('email');
    const countryCode = params.get('countryCode');

    // Si les paramètres existent, les sauvegarder dans localStorage
    if (userId) {
        localStorage.setItem('userId', userId);
        console.log('✅ UserId saved from URL:', userId);
    }
    if (username) {
        localStorage. setItem('username', username);
        console.log('✅ Username saved from URL:', username);
    }
    if (email) {
        localStorage.setItem('email', email);
    }
    if (countryCode) {
        localStorage.setItem('countryCode', countryCode);
    }

    // Nettoyer l'URL (enlever les paramètres)
    if (userId) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Charger les données au démarrage
loadUserFromURL();

// Récupérer userId depuis localStorage
function getUserId() {
    const userId = localStorage.getItem('userId');
    if (! userId) {
        console.warn('⚠️ User not logged in');
        // Optionnel : rediriger vers login
        // window.location.href = 'http://localhost:8081/login. html';
    }
    return userId;
}

// Récupérer username depuis localStorage
function getUsername() {
    return localStorage.getItem('username') || 'Utilisateur';
}

// Afficher username dans le header
function displayUsername() {
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
        usernameEl. textContent = getUsername();
    }
}

// Appel API générique
async function fetchAPI(endpoint, options = {}) {
    const url = API_CONFIG. FANTASY_SERVICE + endpoint;

    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Si pas de contenu (204)
        if (response.status === 204) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}

// Afficher message de succès
function showSuccess(message) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.className = 'message success';
        messageEl.textContent = message;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl. style.display = 'none';
        }, 5000);
    }
}

// Afficher message d'erreur
function showError(message) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.className = 'message error';
        messageEl.textContent = message;
        messageEl. style.display = 'block';

        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Afficher/cacher loading
function setLoading(isLoading) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.display = isLoading ? 'block' : 'none';
    }
}

// Formater position avec emoji
function getPositionEmoji(position) {
    const emojis = {
        'GOALKEEPER': '🧤',
        'DEFENDER': '🛡️',
        'MIDFIELDER': '⚙️',
        'FORWARD':  '⚡'
    };
    return emojis[position] || '⚽';
}

// Formater position en français
function getPositionLabel(position) {
    const labels = {
        'GOALKEEPER':  'Gardien',
        'DEFENDER': 'Défenseur',
        'MIDFIELDER': 'Milieu',
        'FORWARD': 'Attaquant'
    };
    return labels[position] || position;
}

// Met à jour le lien Marketplace avec les infos utilisateur
function updateMarketplaceLink() {
    const link = document.getElementById('marketplaceLink');
    if (!link || !API_CONFIG?.MARKETPLACE) return;
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const url = new URL(API_CONFIG.MARKETPLACE);
    if (userId) url.searchParams.set('userId', userId);
    if (username) url.searchParams.set('username', username);
    link.href = url.toString();
}

// Fonction de déconnexion
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('countryCode');

    alert('Vous êtes déconnecté');
    window.location.href = 'http://localhost:8081/login.html';
}

// Au chargement de chaque page
window.addEventListener('DOMContentLoaded', () => {
    displayUsername();

    // Ajouter événement déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e. preventDefault();
            logout();
        });
    }

    updateMarketplaceLink();
});

console.log('✅ Utils loaded');
