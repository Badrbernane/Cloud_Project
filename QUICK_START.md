# Guide de Démarrage Rapide - Social Integration

## 🚀 Lancement de l'application complète

### 1️⃣ Démarrer le Social Service (Backend)

```powershell
# Aller dans le dossier social-service
cd social-service

# Lancer le service Spring Boot
mvn spring-boot:run
```

✅ Le service sera disponible sur **http://localhost:8083**

### 2️⃣ Démarrer le Frontend React

```powershell
# Ouvrir un nouveau terminal
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances (si pas déjà fait)
npm install

# Lancer l'application React
npm start
```

✅ L'application sera disponible sur **http://localhost:3000**

### 3️⃣ Tester l'intégration

1. **Se connecter** avec un compte utilisateur
2. **Aller sur la page d'accueil** - vous verrez le formulaire de création de post
3. **Créer un post** - tapez du contenu et cliquez sur "Publier"
4. **Interagir** - likez, commentez les posts
5. **Profiter** - les posts se rafraîchissent automatiquement !

## 📁 Nouveaux fichiers créés

```
frontend/
├── src/
│   ├── services/
│   │   └── socialService.js       ← Service API pour le social
│   ├── components/
│   │   ├── create-post.js        ← Formulaire de création
│   │   ├── comment-section.js    ← Section commentaires
│   │   └── post.js               ← Post amélioré (modifié)
│   └── pages/
│       └── home.js               ← Page d'accueil (modifiée)
```

## 🎨 Style appliqué

- ✅ Background image identique (ar.png)
- ✅ Couleurs rouges cohérentes
- ✅ Composants avec coins arrondis
- ✅ Hover effects et transitions
- ✅ Design responsive

## 🔧 Configuration

L'URL de l'API est définie dans `socialService.js` :
```javascript
const SOCIAL_API_URL = 'http://localhost:8083/api';
```

Si votre social-service tourne sur un autre port, modifiez cette valeur.

## ✨ Fonctionnalités disponibles

- ✅ Création de posts
- ✅ Like/Unlike
- ✅ Commentaires
- ✅ Auto-refresh (30s)
- ✅ Timestamps relatifs
- ✅ Avatars avec initiales
- ✅ Compteurs en temps réel

## 🐛 Dépannage

### Le social-service ne démarre pas
```powershell
# Vérifier si PostgreSQL est accessible
# Vérifier les credentials dans application.yml
```

### Les posts ne s'affichent pas
```powershell
# Ouvrir la console du navigateur (F12)
# Vérifier les erreurs réseau
# Vérifier que le social-service tourne bien sur le port 8083
```

### Erreur CORS
Le controller PostController a déjà `@CrossOrigin(origins = "*")`, donc pas de problème CORS.

## 📊 Base de données

Le social-service utilise PostgreSQL :
- **Host** : zlayji-social-db.cxgaw6uoyb83.us-east-2.rds.amazonaws.com
- **Database** : postgres
- **User** : social_admin

Les tables sont créées automatiquement avec JPA (ddl-auto: update).

## 💡 Conseils

1. **Gardez les deux terminaux ouverts** (un pour le backend, un pour le frontend)
2. **Rafraîchissez la page** si vous ne voyez pas vos posts immédiatement
3. **Connectez-vous d'abord** pour créer des posts
4. **Utilisez plusieurs navigateurs** pour tester les interactions multi-utilisateurs

Bon développement ! 🎉
