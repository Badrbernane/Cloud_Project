# Script de test pour vérifier l'intégration Social Service

Write-Host "🧪 Test de l'intégration Social Service" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Vérifier si le social-service est accessible
Write-Host "1️⃣ Test de connexion au Social Service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083/api/posts/health" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Social Service est accessible!" -ForegroundColor Green
        Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Social Service n'est pas accessible sur le port 8083" -ForegroundColor Red
    Write-Host "   Assurez-vous que le service est démarré avec: mvn spring-boot:run" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Récupérer les posts
Write-Host "2️⃣ Test de récupération des posts..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8083/api/posts" -Method GET -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        $posts = $response.Content | ConvertFrom-Json
        Write-Host "   ✅ Posts récupérés avec succès!" -ForegroundColor Green
        Write-Host "   Nombre de posts: $($posts.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Impossible de récupérer les posts" -ForegroundColor Red
    Write-Host "   Erreur: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Vérifier la structure des fichiers frontend
Write-Host "3️⃣ Vérification des fichiers frontend..." -ForegroundColor Yellow

$files = @(
    "frontend\src\services\socialService.js",
    "frontend\src\components\create-post.js",
    "frontend\src\components\comment-section.js",
    "frontend\src\components\post.js",
    "frontend\src\pages\home.js",
    "frontend\src\config\config.js"
)

$allFilesExist = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file manquant!" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if ($allFilesExist) {
    Write-Host "   ✅ Tous les fichiers sont présents!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ Certains fichiers sont manquants" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Vérifier package.json
Write-Host "4️⃣ Vérification du package.json..." -ForegroundColor Yellow
if (Test-Path "frontend\package.json") {
    $packageJson = Get-Content "frontend\package.json" | ConvertFrom-Json
    
    $requiredDeps = @("react", "react-dom", "react-scripts")
    $missingDeps = @()
    
    foreach ($dep in $requiredDeps) {
        if (-not $packageJson.dependencies.$dep) {
            $missingDeps += $dep
        }
    }
    
    if ($missingDeps.Count -eq 0) {
        Write-Host "   ✅ Toutes les dépendances nécessaires sont présentes" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ Dépendances manquantes: $($missingDeps -join ', ')" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ package.json non trouvé" -ForegroundColor Red
}
Write-Host ""

# Test 5: Vérifier le port du frontend
Write-Host "5️⃣ Test de connexion au Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend est accessible sur http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️ Frontend n'est pas encore démarré" -ForegroundColor Yellow
    Write-Host "   Lancez-le avec: cd frontend && npm start" -ForegroundColor Gray
}
Write-Host ""

# Résumé
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "📊 Résumé des tests" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour démarrer l'application complète:" -ForegroundColor White
Write-Host "1. Terminal 1: cd social-service && mvn spring-boot:run" -ForegroundColor Gray
Write-Host "2. Terminal 2: cd frontend && npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "Ensuite, ouvrez http://localhost:3000 dans votre navigateur" -ForegroundColor White
Write-Host ""
