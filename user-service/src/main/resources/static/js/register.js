document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById('message');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Récupérer les données du formulaire
    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        countryCode: document.getElementById('countryCode').value
    };

    // Désactiver le bouton
    submitBtn.disabled = true;
    submitBtn.textContent = 'Inscription en cours...';

    try {
        const response = await fetch('http://localhost:8081/api/users/register', {
            method:  'POST',
            headers:  {
                'Content-Type':  'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Succès
            messageDiv.className = 'message success';
            messageDiv.textContent = '✅ Inscription réussie !  Redirection... ';
            messageDiv.style.display = 'block';

            // Sauvegarder le token
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data. id);
            localStorage.setItem('username', data. username);

            // Rediriger vers le dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } else {
            // Erreur
            messageDiv. className = 'message error';
            messageDiv.textContent = '❌ ' + (data.message || 'Erreur lors de l\'inscription');
            messageDiv.style.display = 'block';

            submitBtn.disabled = false;
            submitBtn.textContent = 'Créer mon compte';
        }

    } catch (error) {
        console.error('Erreur:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Erreur de connexion au serveur';
        messageDiv. style.display = 'block';

        submitBtn.disabled = false;
        submitBtn. textContent = 'Créer mon compte';
    }
});