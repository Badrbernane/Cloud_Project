# Intégration du Social Service avec le Frontend React

## 📋 Vue d'ensemble

Le social-service a été intégré dans le frontend React avec le même style que l'application principale. Les posts sont maintenant dynamiques et connectés à l'API REST du social-service.

## 🎨 Style et Architecture

### Composants créés

1. **`socialService.js`** - Service API pour communiquer avec le backend
   - Gestion des posts (création, récupération)
   - Gestion des likes/unlikes
   - Gestion des commentaires
   - Localisation : `frontend/src/services/socialService.js`

2. **`create-post.js`** - Composant pour créer de nouveaux posts
   - Formulaire de création avec validation
   - Compteur de caractères (max 500)
   - Style rouge cohérent avec l'application
   - Localisation : `frontend/src/components/create-post.js`

3. **`post.js`** (amélioré) - Composant d'affichage des posts
   - Affichage de l'auteur avec initiales
   - Gestion des likes en temps réel
   - Affichage du nombre de commentaires
   - Toggle pour afficher/masquer les commentaires
   - Timestamp "Il y a X temps"
   - Localisation : `frontend/src/components/post.js`

4. **`comment-section.js`** - Composant pour les commentaires
   - Formulaire d'ajout de commentaire
   - Liste des commentaires avec avatar
   - Support de la touche Entrée pour envoyer
   - Localisation : `frontend/src/components/comment-section.js`

### Page Home mise à jour

La page [home.js](frontend/src/pages/home.js) a été modifiée pour :
- Charger dynamiquement les posts depuis le social-service
- Afficher le formulaire de création de post
- Auto-refresh des posts toutes les 30 secondes
- Gestion des états de chargement et d'erreur
- Conservation du style avec background image et couleurs rouges

## 🔗 Configuration API

L'URL du social-service est configurée dans `socialService.js` :
```javascript
const SOCIAL_API_URL = 'http://localhost:8083/api';
```

## 🚀 Fonctionnalités

### Création de posts
- Formulaire dans la page d'accueil
- Validation du contenu
- Limite de 500 caractères
- Feedback visuel lors de la publication

### Affichage des posts
- Posts triés par date (plus récent en haut)
- Affichage de l'auteur avec initiales
- Timestamp relatif ("Il y a X min/h/j")
- Boutons de like interactifs
- Compteurs de likes et commentaires

### Système de likes
- Like/Unlike avec un seul clic
- Mise à jour instantanée du compteur
- Indicateur visuel (❤️ pour liké, 🤍 pour non liké)

### Commentaires
- Section dépliable pour chaque post
- Formulaire d'ajout de commentaire
- Affichage de tous les commentaires
- Support de la touche Entrée pour envoyer

## 🎨 Style visuel

Tous les composants suivent le même design :
- **Couleur principale** : Rouge (#991b1b, #7f1d1d)
- **Background** : Image ar.png en fixed
- **Cards** : Fond rouge foncé avec coins arrondis
- **Hover effects** : Transitions douces
- **Responsive** : Adaptable à différentes tailles d'écran

## 📦 Données utilisateur

Les informations utilisateur sont stockées dans le localStorage :
- `userId` : ID de l'utilisateur connecté
- `username` : Nom d'utilisateur

Ces données sont automatiquement envoyées avec chaque requête au social-service.

## 🔄 Flux de données

```
Frontend (React)
    ↓
socialService.js (API calls)
    ↓
http://localhost:8083/api/posts
    ↓
Social Service (Spring Boot)
    ↓
PostgreSQL Database
```

## ⚡ Auto-refresh

Les posts sont automatiquement rechargés :
- Toutes les 30 secondes
- Après création d'un nouveau post
- Après ajout d'un like
- Après ajout d'un commentaire

## 🛠️ Pour lancer l'application

1. **Démarrer le social-service** (backend) :
   ```bash
   cd social-service
   mvn spring-boot:run
   ```
   Le service sera disponible sur http://localhost:8083

2. **Démarrer le frontend** :
   ```bash
   cd frontend
   npm start
   ```
   L'application sera disponible sur http://localhost:3000

3. **Se connecter** pour accéder aux fonctionnalités sociales

## 📝 Endpoints utilisés

- `GET /api/posts` - Récupérer tous les posts
- `POST /api/posts` - Créer un nouveau post
- `POST /api/posts/{id}/like` - Liker un post
- `POST /api/posts/{id}/unlike` - Unliker un post
- `GET /api/posts/{id}` - Récupérer un post avec ses commentaires
- `POST /api/posts/{id}/comments` - Ajouter un commentaire

## 🎯 Améliorations futures possibles

- Upload d'images pour les posts
- Mentions d'utilisateurs (@username)
- Hashtags
- Notifications en temps réel
- Fil d'actualité personnalisé
- Partage de posts
- Recherche de posts
