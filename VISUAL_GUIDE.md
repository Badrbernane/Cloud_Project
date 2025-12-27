# 🎨 Guide Visuel de l'Intégration Social Service

## 📱 Interface Utilisateur

### Page d'accueil (Feed Social)

```
╔════════════════════════════════════════════════════════════════╗
║  [≡] Sidebar         🏠 FantazyTeam            👤 Profile      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │ ✍️ Créer un post                                        │  ║
║  │ ┌─────────────────────────────────────────────────────┐ │  ║
║  │ │ Partagez vos stratégies, vos transferts...         │ │  ║
║  │ │                                                      │ │  ║
║  │ │                                                      │ │  ║
║  │ └─────────────────────────────────────────────────────┘ │  ║
║  │                                         0/500  [Publier] │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │ [BA] Badr                              Il y a 5min      │  ║
║  │                                                          │  ║
║  │ Super victoire aujourd'hui ! Mon équipe a marqué 150pts│  ║
║  │                                                          │  ║
║  │ ───────────────────────────────────────────────────────  │  ║
║  │ ❤️ 12        💬 3                                       │  ║
║  │                                                          │  ║
║  │ ┌────────────────────────────────────────────────────┐ │  ║
║  │ │ Ajouter un commentaire...            [Envoyer]     │ │  ║
║  │ ├────────────────────────────────────────────────────┤ │  ║
║  │ │ [KA] Karim              Il y a 2min                │ │  ║
║  │ │ Bravo ! Quelle composition ?                       │ │  ║
║  │ └────────────────────────────────────────────────────┘ │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
║  ┌─────────────────────────────────────────────────────────┐  ║
║  │ [YO] Youssef                          Il y a 1h        │  ║
║  │                                                          │  ║
║  │ Quelqu'un a des conseils pour le prochain match ?      │  ║
║  │                                                          │  ║
║  │ ───────────────────────────────────────────────────────  │  ║
║  │ 🤍 5         💬 8                                       │  ║
║  └─────────────────────────────────────────────────────────┘  ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
```

## 🎨 Palette de Couleurs

### Couleurs Principales
- **Background Principal** : Image `ar.png` en fixed
- **Cards Posts** : `bg-red-800` (#991b1b)
- **Hover/Active** : `bg-red-700` (#b91c1c)
- **Fond Inputs** : `bg-red-900` (#7f1d1d)
- **Text** : Blanc (#ffffff)
- **Text Secondaire** : `text-red-200` (#fecaca)

### Composants

#### Bouton Primaire
```
┌──────────────┐
│ 📤 Publier   │  ← bg-red-600, hover:bg-red-700
└──────────────┘
```

#### Avatar Utilisateur
```
┌──────┐
│  BA  │  ← bg-red-600, text-white, rounded-full
└──────┘
```

#### Bouton Like
```
Actif:   ❤️ 12   ← text-pink-300
Inactif: 🤍 0    ← text-white
```

## 📐 Structure des Composants

### CreatePost Component
```
CreatePost.js
├── Form
│   ├── Textarea (max 500 chars)
│   ├── Character Counter
│   └── Submit Button
└── Error Display (if any)
```

### Post Component
```
Post.js
├── Header
│   ├── Avatar (initiales)
│   ├── Username
│   └── Timestamp
├── Content (text)
├── Image (optional)
├── Actions
│   ├── Like Button (with count)
│   └── Comment Button (with count)
└── CommentSection (togglable)
```

### CommentSection Component
```
CommentSection.js
├── Comment Form
│   ├── Input Field
│   └── Send Button
└── Comments List
    └── Comment Items
        ├── Avatar
        ├── Username + Timestamp
        └── Content
```

## 🔄 Flux d'Interaction

### 1. Créer un Post
```
User Input → CreatePost
            ↓
    Validate (1-500 chars)
            ↓
    POST /api/posts
            ↓
    ✅ Success → Reload Posts
    ❌ Error → Show Error Message
```

### 2. Liker un Post
```
Click ❤️ → Post Component
           ↓
    Check if already liked
           ↓
    POST /like or /unlike
           ↓
    Update UI (instant)
           ↓
    Reload Posts (background)
```

### 3. Ajouter un Commentaire
```
User Input → CommentSection
            ↓
    Validate (not empty)
            ↓
    POST /posts/{id}/comments
            ↓
    ✅ Success → Reload Comments
                 Update Counter
```

## 🎯 États Visuels

### État de Chargement
```
┌─────────────────────────────────┐
│  🔄 Chargement des posts...    │
└─────────────────────────────────┘
```

### État Vide
```
┌─────────────────────────────────┐
│  📭 Aucun post pour le moment   │
│                                  │
│  Soyez le premier à partager !  │
└─────────────────────────────────┘
```

### État d'Erreur
```
┌─────────────────────────────────┐
│  ⚠️ Impossible de charger       │
│     les posts                    │
└─────────────────────────────────┘
```

## 📱 Responsive Design

### Desktop (>768px)
```
┌──────────────────────────────────────┐
│ [Sidebar] [Feed]    [Suggested Users]│
│           [Posts]   [Live Chat]      │
└──────────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────┐
│ [Hamburger] │
├──────────────┤
│   [Feed]     │
│   [Posts]    │
└──────────────┘
```

## ⚡ Animations

### Fade In (Posts)
```
Opacity: 0 → 1
Transform: translateY(-10px) → 0
Duration: 0.3s
```

### Slide In (Comments)
```
Opacity: 0 → 1
Transform: translateX(-20px) → 0
Duration: 0.3s
```

### Hover Effect (Buttons)
```
Scale: 1 → 1.05
Transition: 0.2s ease
```

## 🎨 Exemples de Style CSS

### Card Post
```css
.post-card {
  background: #991b1b;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1rem;
  color: white;
}
```

### Button Like
```css
.like-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s;
}

.like-btn:hover {
  color: #fecaca;
}

.like-btn.liked {
  color: #fbcfe8;
}
```

### Input Field
```css
.comment-input {
  background: #7f1d1d;
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
}

.comment-input:focus {
  outline: none;
  ring: 2px solid #b91c1c;
}
```

## 📊 Hiérarchie Visuelle

```
1. Create Post Form (top, prominent)
   ↓
2. Feed Posts (main content area)
   ├── Post Header (bold username)
   ├── Post Content (medium text)
   └── Actions (small, subtle)
   ↓
3. Comments (nested, smaller)
   └── Individual Comments (compact)
```

## 🎭 Icônes Utilisées

- ✍️ Créer un post
- ❤️ Like actif
- 🤍 Like inactif
- 💬 Commentaires
- 📤 Publier
- 👤 Avatar/User
- ⚠️ Erreur
- ✅ Succès
- 🔄 Chargement
- 📭 Vide

## 🎨 Cohérence Visuelle

✅ Tous les composants utilisent la même palette rouge
✅ Coins arrondis cohérents (rounded-md)
✅ Espacement uniforme (padding: 1rem)
✅ Transitions douces (0.2-0.3s)
✅ Typographie cohérente (Tailwind defaults)
✅ Background image identique partout
