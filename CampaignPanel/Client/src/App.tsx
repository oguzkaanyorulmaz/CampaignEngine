import { useState } from 'react';
import LoginPage from './presentation/pages/LoginPage';
import DashboardPage from './presentation/pages/DashboardPage';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('cp_token'));
  const [fullName, setFullName] = useState(localStorage.getItem('cp_fullname') || '');

  const handleLogin = (newToken: string, name: string) => {
    localStorage.setItem('cp_token', newToken);
    localStorage.setItem('cp_fullname', name);
    setToken(newToken);
    setFullName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('cp_token');
    localStorage.removeItem('cp_fullname');
    setToken(null);
    setFullName('');
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardPage fullName={fullName} onLogout={handleLogout} />;
}
