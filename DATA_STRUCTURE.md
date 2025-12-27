# Structure des Données - Social Service

## 📦 Modèles de données

### Post
```javascript
{
  id: "uuid",                    // ID unique du post
  userId: "uuid",                // ID de l'auteur
  username: "string",            // Nom d'utilisateur de l'auteur
  content: "string",             // Contenu du post (max 500 caractères)
  createdAt: "2025-12-27T10:30:00",  // Date de création (ISO 8601)
  updatedAt: "2025-12-27T10:30:00",  // Date de modification
  likesCount: 0,                 // Nombre de likes
  commentsCount: 0,              // Nombre de commentaires
  isLiked: false,                // Si l'utilisateur actuel a liké
  userLikes: ["uuid1", "uuid2"], // Liste des IDs des utilisateurs qui ont liké
  comments: [Comment]            // Liste des commentaires (optionnel)
}
```

### Comment
```javascript
{
  id: "uuid",                    // ID unique du commentaire
  postId: "uuid",                // ID du post parent
  userId: "uuid",                // ID de l'auteur du commentaire
  username: "string",            // Nom d'utilisateur de l'auteur
  content: "string",             // Contenu du commentaire
  createdAt: "2025-12-27T10:35:00",  // Date de création
  updatedAt: "2025-12-27T10:35:00"   // Date de modification
}
```

### Like
```javascript
{
  id: "uuid",                    // ID unique du like
  postId: "uuid",                // ID du post
  userId: "uuid",                // ID de l'utilisateur qui a liké
  createdAt: "2025-12-27T10:32:00"   // Date du like
}
```

## 📡 Requêtes API

### Créer un post
```javascript
POST /api/posts
Body: {
  userId: "uuid",
  username: "Badr",
  content: "Mon premier post!"
}
Response: Post
```

### Récupérer tous les posts
```javascript
GET /api/posts?currentUserId=uuid
Response: Post[]
```

### Récupérer un post avec détails
```javascript
GET /api/posts/{postId}?currentUserId=uuid
Response: Post (avec comments[])
```

### Liker un post
```javascript
POST /api/posts/{postId}/like?userId=uuid
Response: Post (mis à jour)
```

### Unliker un post
```javascript
POST /api/posts/{postId}/unlike?userId=uuid
Response: Post (mis à jour)
```

### Ajouter un commentaire
```javascript
POST /api/posts/{postId}/comments
Body: {
  userId: "uuid",
  username: "Badr",
  content: "Super post!"
}
Response: Comment
```

## 🔄 Flux de données dans le Frontend

### Création de post
```
CreatePost Component
  → createPost(content)
    → POST /api/posts
      → onPostCreated()
        → loadPosts()
          → GET /api/posts
            → setPosts(newPosts)
```

### Like d'un post
```
Post Component
  → handleLike()
    → likePost(postId) ou unlikePost(postId)
      → POST /api/posts/{id}/like ou /unlike
        → onUpdate()
          → loadPosts()
```

### Ajout de commentaire
```
CommentSection Component
  → handleSubmit()
    → addComment(postId, content)
      → POST /api/posts/{postId}/comments
        → onCommentAdded()
          → loadComments()
            → GET /api/posts/{postId}
```

## 💾 LocalStorage

Les données suivantes sont stockées dans le localStorage :

```javascript
{
  userId: "uuid",           // ID de l'utilisateur connecté
  username: "Badr",         // Nom d'utilisateur
  token: "jwt-token"        // Token d'authentification (futur)
}
```

## 🎯 États des composants

### Home Page
```javascript
{
  view: 'feed',             // Vue active
  posts: Post[],            // Liste des posts
  isLoading: boolean,       // État de chargement
  error: string            // Message d'erreur
}
```

### Post Component
```javascript
{
  liked: boolean,           // Si l'utilisateur a liké
  likes: number,            // Nombre de likes
  showComments: boolean,    // Afficher les commentaires
  comments: Comment[],      // Liste des commentaires
  commentsTotal: number     // Nombre total de commentaires
}
```

### CreatePost Component
```javascript
{
  content: string,          // Contenu du post
  isLoading: boolean,       // Envoi en cours
  error: string            // Message d'erreur
}
```

### CommentSection Component
```javascript
{
  commentContent: string,   // Contenu du commentaire
  isSubmitting: boolean    // Envoi en cours
}
```

## 📊 Base de données PostgreSQL

### Table: posts
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    username VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Table: likes
```sql
CREATE TABLE likes (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    user_id UUID NOT NULL,
    created_at TIMESTAMP,
    UNIQUE(post_id, user_id)  -- Un utilisateur ne peut liker qu'une fois
);
```

### Table: comments
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    post_id UUID REFERENCES posts(id),
    user_id UUID NOT NULL,
    username VARCHAR(255),
    content TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔐 Sécurité et Validation

### Validation côté frontend
- Contenu post : 1-500 caractères
- Contenu commentaire : 1-200 caractères
- UserId requis pour toutes les actions

### Validation côté backend
- `@Valid` sur les DTOs
- Vérification de l'existence des posts
- Contraintes de base de données (UNIQUE sur likes)

## ⚡ Optimisations

### Chargement des données
- Posts chargés avec likes et compteurs pré-calculés
- Commentaires chargés à la demande (lazy loading)
- Auto-refresh intelligent (seulement si la vue est active)

### Performance
- Tri côté client pour éviter les requêtes répétées
- Mise en cache des avatars (initiales)
- Debouncing possible pour les auto-refresh futurs
