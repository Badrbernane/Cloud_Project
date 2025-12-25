import { useState } from 'react';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import Home from './pages/home';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  return currentPage === 'login' ? (
    <LoginPage onSignUp={() => setCurrentPage('register')} onLogin={() => setCurrentPage('home')} />
  ) : currentPage === 'register' ? (
    <RegisterPage onLogin={() => setCurrentPage('login')} />
  ) : (
    <Home onLogout={() => setCurrentPage('login')} />
  );
}

export default App;
