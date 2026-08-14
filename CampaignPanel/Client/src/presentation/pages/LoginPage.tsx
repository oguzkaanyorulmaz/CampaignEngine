import { useState } from 'react';
import type { FormEvent } from 'react';
import { api } from '../../core/services/api.service';

interface LoginPageProps {
  onLogin: (token: string, fullName: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login({ username, password });
      if (result.success && result.token) {
        onLogin(result.token, result.fullName || username);
      } else {
        setError(result.errorMessage || 'Giriş başarısız.');
      }
    } catch (err: any) {
      setError(err.message || 'Sunucuya bağlanılamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Üst Sarı Banner */}
      <div className="login-header-banner">
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="fg-badge">CP</span>
          <span className="fg-brand-title">CampaignPanel</span>
          <span className="fg-brand-subtitle">VakıfBank</span>
        </div>
      </div>

      {/* Giriş Formu */}
      <div className="login-body">
        <div className="login-card">
          <div className="login-card-header">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="fg-badge" style={{ fontSize: '18px', padding: '4px 10px' }}>CP</span>
            </div>
            <h2>Admin Girişi</h2>
            <p>Kampanya Yönetim Portalı'na erişmek için giriş yapın</p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Kullanıcı Adı</label>
              <input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-black"
              style={{ width: '100%', padding: '14px', marginTop: '8px', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
            </button>
          </form>
        </div>
      </div>

      {/* Alt Bilgilendirme Footer'ı (FraudGuard Tasarımı) */}
      <footer className="login-footer-info">
        <div className="login-footer-inner">
          <div className="login-footer-icon">
            🛡️
          </div>
          <div className="login-footer-text">
            <h4>Güvenlik & Kampanya Yönetim Bilgilendirmesi</h4>
            <p>
              Bu portal, <strong>FraudGuard</strong> veritabanı altyapısına bağlı çalışan ve <strong>Clean Architecture / Domain-Driven Design (DDD)</strong> prensiplerine uygun olarak geliştirilen VakıfBank Kampanya Yönetim & Admin Portalı'dır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
