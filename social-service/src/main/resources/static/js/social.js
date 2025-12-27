let currentUserId = null;
let currentUsername = null;
let allPosts = [];

// Charger au démarrage
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Social Service loaded');

    // Charger userId et username depuis URL ou localStorage
    loadUserFromURL();

    currentUserId = localStorage.getItem('userId');
    currentUsername = localStorage.getItem('username') || 'Utilisateur';

    console.log('👤 Current user:', currentUsername, currentUserId);

    if (! currentUserId) {
        showError('Vous devez être connecté pour accéder au feed social');
        setTimeout(() => {
            window.location.href = 'http://localhost:8081/login.html';
        }, 2000);
        return;
    }

    // Afficher username
    document.getElementById('username').textContent = currentUsername;

    // Setup
    setupCreatePostForm();
    setupLogout();
    loadPosts();

    // Auto-refresh toutes les 30 secondes
    setInterval(loadPosts, 30000);
});

// Charger user depuis URL
function loadUserFromURL() {
    const params = new URLSearchParams(window. location.search);

    const userId = params.get('userId');
    const username = params.get('username');

    if (userId) {
        localStorage.setItem('userId', userId);
    }
    if (username) {
        localStorage.setItem('username', username);
    }

    // Nettoyer l'URL
    if (userId) {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
    }
}

// Setup formulaire création post
function setupCreatePostForm() {
    const form = document. getElementById('createPostForm');
    const textarea = document.getElementById('postContent');
    const charCount = document.getElementById('charCount');

    // Compteur de caractères
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });

    // Soumission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createPost();
    });
}

// Créer un post
async function createPost() {
    const content = document.getElementById('postContent').value.trim();

    if (!content) {
        showError('Le contenu du post ne peut pas être vide');
        return;
    }

    try {
        const data = {
            userId: currentUserId,
            username: currentUsername,  // ← AJOUTÉ
            content: content
        };

        console.log('📤 Creating post:', data);

        const response = await fetch(`${API_CONFIG.SOCIAL_SERVICE}${ENDPOINTS. POSTS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (! response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const post = await response.json();
        console.log('✅ Post created:', post);

        // Réinitialiser le formulaire
        document.getElementById('postContent').value = '';
        document.getElementById('charCount').textContent = '0';

        showSuccess('✅ Post publié avec succès !   ');

        // Recharger le feed
        await loadPosts();

    } catch (error) {
        console.error('❌ Error creating post:', error);
        showError('Erreur lors de la publication du post');
    }
}

// Charger les posts
async function loadPosts() {
    console.log('🔍 Loading posts...');
    setLoading(true);

    try {
        const response = await fetch(`${API_CONFIG.SOCIAL_SERVICE}${ENDPOINTS. POSTS}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        allPosts = await response.json();
        console.log('✅ Posts loaded:', allPosts.length);

        // Log du premier post pour debug
        if (allPosts. length > 0) {
            console.log('📋 Premier post:', allPosts[0]);
        }

        displayPosts(allPosts);

    } catch (error) {
        console.error('❌ Error loading posts:', error);
        showError('Erreur lors du chargement des posts');
    } finally {
        setLoading(false);
    }
}

// Afficher les posts
function displayPosts(posts) {
    const container = document.getElementById('postsContainer');

    if (! posts || posts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <h3>📭 Aucun post pour le moment</h3>
                <p>Soyez le premier à partager quelque chose !</p>
            </div>
        `;
        return;
    }

    // Trier par date décroissante
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    container.innerHTML = posts.map(post => createPostHTML(post)).join('');
}

// Créer le HTML d'un post
function createPostHTML(post) {
    // ✅ CORRECTION:  Convertir currentUserId en string pour la comparaison
    const userIdString = currentUserId ? currentUserId. toString() : '';
    const isLiked = post.userLikes && post.userLikes.includes(userIdString);
    const showComments = post.showComments || false;

    const initials = (post.username || 'U').substring(0, 2).toUpperCase();
    const timeAgo = getTimeAgo(post.createdAt);

    return `
        <div class="post-card" data-post-id="${post. id}">
            <div class="post-header">
                <div class="post-avatar">${initials}</div>
                <div class="post-author-info">
                    <div class="post-author">${post.username || 'Utilisateur'}</div>
                    <div class="post-date">${timeAgo}</div>
                </div>
            </div>
            
            <div class="post-content">${escapeHtml(post.content)}</div>
            
            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? 'liked' : ''}" 
                        onclick="toggleLike('${post.id}', ${isLiked})">
                    ${isLiked ? '❤️' : '🤍'} ${post.likesCount || 0}
                </button>
                
                <button class="action-btn comment-btn ${showComments ? 'active' : ''}" 
                        onclick="toggleComments('${post.id}')">
                    💬 ${post.commentsCount || 0}
                </button>
            </div>
            
            <div class="comments-section" id="comments-${post.id}" style="display: ${showComments ? 'block' : 'none'};">
                <div class="comment-form">
                    <input type="text" 
                           class="comment-input" 
                           id="comment-input-${post.id}" 
                           placeholder="Ajouter un commentaire..."
                           onkeypress="handleCommentKeyPress(event, '${post.id}')">
                    <button class="btn btn-secondary" onclick="addComment('${post.id}')">
                        Envoyer
                    </button>
                </div>
                
                <div class="comments-list" id="comments-list-${post.id}">
                    ${post.comments && post.comments.length > 0 ?
        post.comments.map(comment => createCommentHTML(comment)).join('') :
        '<p class="empty-message" style="padding: 20px;">Aucun commentaire</p>'
    }
                </div>
            </div>
        </div>
    `;
}

// Créer le HTML d'un commentaire
function createCommentHTML(comment) {
    const initials = (comment.username || 'U').substring(0, 2).toUpperCase();
    const timeAgo = getTimeAgo(comment.createdAt);

    return `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-avatar">${initials}</div>
                <div>
                    <div class="comment-author">${comment.username || 'Utilisateur'}</div>
                    <div class="comment-date">${timeAgo}</div>
                </div>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
        </div>
    `;
}

// Toggle like
async function toggleLike(postId, isCurrentlyLiked) {
    console.log((isCurrentlyLiked ? '💔' : '❤️') + ' Toggle like for post:', postId);

    const endpoint = isCurrentlyLiked ?
        ENDPOINTS.UNLIKE_POST(postId) :
        ENDPOINTS.LIKE_POST(postId);

    try {
        const response = await fetch(
            `${API_CONFIG.SOCIAL_SERVICE}${endpoint}?userId=${currentUserId}`,
            { method: 'POST' }
        );

        if (!response. ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        console.log('✅ Like toggled');
        await loadPosts();

    } catch (error) {
        console.error('❌ Error toggling like:', error);
        showError('Erreur lors du like');
    }
}

// Toggle affichage commentaires ET charger les détails
async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    const isVisible = commentsSection.style.display === 'block';

    if (isVisible) {
        // Fermer les commentaires
        commentsSection.style.display = 'none';
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            post.showComments = false;
        }
    } else {
        // Ouvrir et CHARGER les commentaires depuis l'API
        console.log('🔍 Loading comments for post:', postId);

        try {
            const response = await fetch(
                `${API_CONFIG.SOCIAL_SERVICE}/api/posts/${postId}?currentUserId=${currentUserId}`
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const postWithComments = await response.json();
            console.log('✅ Comments loaded:', postWithComments.comments);

            // Mettre à jour le post dans allPosts avec les commentaires
            const postIndex = allPosts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                allPosts[postIndex].comments = postWithComments.comments;
                allPosts[postIndex].showComments = true;
            }

            // Réafficher ce post spécifique avec les commentaires
            const postCard = document.querySelector(`[data-post-id="${postId}"]`);
            if (postCard) {
                postCard.outerHTML = createPostHTML(allPosts[postIndex]);
            }

        } catch (error) {
            console.error('❌ Error loading comments:', error);
            showError('Erreur lors du chargement des commentaires');
        }
    }
}

// Ajouter un commentaire
async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const content = input.value.trim();

    if (!content) {
        showError('Le commentaire ne peut pas être vide');
        return;
    }

    try {
        const data = {
            userId: currentUserId,
            username: currentUsername,  // ← AJOUTÉ
            content: content
        };

        console.log('📤 Adding comment to post:', postId, data);

        const response = await fetch(
            `${API_CONFIG.SOCIAL_SERVICE}${ENDPOINTS.ADD_COMMENT(postId)}`,
            {
                method:  'POST',
                headers:  {
                    'Content-Type': 'application/json'
                },
                body: JSON. stringify(data)
            }
        );

        if (!response. ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        console.log('✅ Comment added');

        // Réinitialiser input
        input.value = '';

        // Recharger les posts
        await loadPosts();

        // Garder les commentaires affichés
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            post.showComments = true;
        }

    } catch (error) {
        console.error('❌ Error adding comment:', error);
        showError('Erreur lors de l\'ajout du commentaire');
    }
}

// Gérer Enter dans le champ commentaire
function handleCommentKeyPress(event, postId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addComment(postId);
    }
}

// Calculer "il y a X temps"
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;

    return date.toLocaleDateString('fr-FR');
}

// Échapper le HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Afficher/cacher loading
function setLoading(isLoading) {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.display = isLoading ? 'block' : 'none';
    }
}

// Afficher message de succès
function showSuccess(message) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.className = 'message success';
        messageEl.textContent = message;
        messageEl. style.display = 'block';

        setTimeout(() => {
            messageEl. style.display = 'none';
        }, 3000);
    }
}

// Afficher message d'erreur
function showError(message) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.className = 'message error';
        messageEl.textContent = message;
        messageEl.style.display = 'block';

        setTimeout(() => {
            messageEl. style.display = 'none';
        }, 5000);
    }
}

// Déconnexion
function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();

        localStorage.removeItem('userId');
        localStorage. removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('countryCode');

        alert('Vous êtes déconnecté');
        window.location. href = 'http://localhost:8081/login.html';
    });
}

console.log('✅ Social script loaded');