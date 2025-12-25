import { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/users';

export function RegisterForm({ className, onLogin, ...props }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const formData = { username, email, password, countryCode };

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        localStorage.setItem('token', data.token || '');
        localStorage.setItem('userId', data.id || '');
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('countryCode', data.countryCode || countryCode);
        localStorage.setItem('createdAt', data.createdAt || new Date().toISOString());
        setTimeout(() => onLogin?.(), 1500);
      } else {
        const message = data.message || "Email déjà utilisé ou données invalides";
        setError('❌ ' + message);
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('❌ Erreur lors de l\'inscription.');
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className || ''}`} {...props}>
      <div className="w-full p-10">
        <div className="mb-1 text-center">
          <img src="/images/logo.png" alt="Logo" className="h-23 w-23 mx-auto mb-1" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              id="username"
              type="text"
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
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
            <input
              id="countryCode"
              type="text"
              placeholder="Country code (ex: DZ, MA)"
              maxLength="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              value={countryCode.toUpperCase()}
              onChange={(e) => setCountryCode(e.target.value.toUpperCase().slice(0, 2))}
              required
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-400 text-center" role="alert">{error}</p>}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Création...' : 'S\'inscrire'}
            </button>

            <p className="text-center text-sm text-gray-300">
              Already have an account? <button type="button" onClick={onLogin} className="text-blue-300 hover:underline">Login</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
