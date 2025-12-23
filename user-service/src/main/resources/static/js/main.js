// Vérifier si l'utilisateur est connecté
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (token) {
        // Ajouter un lien vers le dashboard
        const header = document.querySelector('.header');
        const dashboardLink = document.createElement('a');
        dashboardLink.href = 'dashboard.html';
        dashboardLink.className = 'btn btn-success';
        dashboardLink.textContent = '👤 Mon Profil';
        dashboardLink.style.position = 'absolute';
        dashboardLink.style.top = '20px';
        dashboardLink. style.right = '20px';
        header.appendChild(dashboardLink);
    }
});