import { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/users';

export function LoginForm({ className, onSignUp, onLogin, ...props }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const formData = { email, password };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('✅ Connexion réussie ! Redirection...');
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('userId', data.id || '');
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('countryCode', data.countryCode || 'DZ');
        localStorage.setItem('createdAt', data.createdAt || new Date().toISOString());

        setTimeout(() => {
          onLogin?.(data);
        }, 1500);
      } else {
        setError('❌ Email ou mot de passe incorrect');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('❌ Erreur de connexion au serveur');
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
      <div className="w-full p-6">
        <div className="mb-1 text-center">
          <img src="/images/logo.png" alt="Logo" className="h-23 w-23 mx-auto mb-1" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
              <button type="button" className="text-sm text-blue-300 hover:underline">Forgot your password?</button>
            </div>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center" role="alert">{error}</p>}
          {success && <p className="text-sm text-green-400 text-center" role="status">{success}</p>}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            <button type="button" className="w-full border border-gray-300 text-white font-medium py-2 rounded-md hover:border-gray-400">
              Login with Google
            </button>
            <p className="text-center text-sm text-gray-300">
              Don't have an account? <button type="button" onClick={onSignUp} className="text-blue-300 hover:underline">Sign up</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
