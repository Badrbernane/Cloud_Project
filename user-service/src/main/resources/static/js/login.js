document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const messageDiv = document.getElementById('message');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    const formData = {
        email:  document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion... ';

    try {
        const response = await fetch('http://localhost:8081/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON. stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = '✅ Connexion réussie !  Redirection...';
            messageDiv.style.display = 'block';

            localStorage.setItem('token', data. token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('username', data.username);

            setTimeout(() => {
                window. location.href = 'dashboard.html';
            }, 1500);

        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = '❌ Email ou mot de passe incorrect';
            messageDiv.style.display = 'block';

            submitBtn.disabled = false;
            submitBtn.textContent = 'Se connecter';
        }

    } catch (error) {
        console.error('Erreur:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Erreur de connexion au serveur';
        messageDiv.style.display = 'block';

        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
    }
});