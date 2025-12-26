document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document. getElementById('email').value;
    const password = document.getElementById('password').value;
    const countryCode = document.getElementById('countryCode').value;
    const messageDiv = document.getElementById('message');

    messageDiv. textContent = '';
    messageDiv.className = 'message';

    try {
        const response = await fetch('http://localhost:8081/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password:  password,
                countryCode:  countryCode
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Erreur lors de l\'inscription');
        }

        const data = await response. json();

        // ✅ Sauvegarder dans localStorage du User Service
        localStorage.setItem('userId', data.id);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('countryCode', data.countryCode || '');

        messageDiv.textContent = `✅ Inscription réussie ! Bienvenue ${data.username}`;
        messageDiv.className = 'message success';

        // ✅ Redirection avec les données dans l'URL
        const params = new URLSearchParams({
            userId: data.id,
            username: data.username,
            email: data.email,
            countryCode: data.countryCode || ''
        });

        setTimeout(() => {
            window.location.href = `http://localhost:8083/index.html?${params. toString()}`;
        }, 1000);

    } catch (error) {
        console.error('Erreur:', error);
        messageDiv.textContent = '❌ ' + error.message;
        messageDiv.className = 'message error';
    }
});

console.log('✅ Register script loaded');