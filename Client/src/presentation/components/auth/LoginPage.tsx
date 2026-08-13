import React, { useState } from 'react';

interface LoginPageProps {
  onLoginSuccess: (customerId: number, customerName: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [identityNumber, setIdentityNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identityNumber, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.customerId, data.customerName);
      } else {
        setError(data.message || 'T.C. Kimlik NumarasÄ± veya 6 haneli ÅŸifre hatalÄ±.');
      }
    } catch {
      setError('Sunucuya baÄŸlanÄ±lamadÄ±. LÃ¼tfen API servisinin Ã§alÄ±ÅŸtÄ±ÄŸÄ±ndan emin olun.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F4F5F7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontFamily: 'Inter, sans-serif' }}>
      {/* Ãœst Bar (Header) */}
      <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E7EB', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#FDBB30', color: '#111111', fontWeight: 900, fontStyle: 'italic', fontSize: '1.1rem', padding: '3px 10px', borderRadius: '6px' }}>FG</span>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111111' }}>CampaignGuard â€¢ BankacÄ±lÄ±k PortalÄ±</span>
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#718096' }}>
          ğŸ”’ 256-Bit SSL GÃ¼venli GiriÅŸ
        </div>
      </header>

      {/* Orta KÄ±sÄ±m (GiriÅŸ Formu) */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#4A5568', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            VakÄ±fBank MÃ¼ÅŸteri GiriÅŸi
          </h1>

          <div style={{ background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', border: '1px solid #E4E7EB', overflow: 'hidden' }}>
            {/* Sekme */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E4E7EB', background: '#FAFBFD' }}>
              <div style={{ flex: 1, padding: '16px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 900, borderBottom: '3px solid #FDBB30', color: '#111111', background: '#FFFFFF', letterSpacing: '0.05em' }}>
                MÃœÅTERÄ° GÄ°RÄ°ÅÄ° (T.C. Ä°LE)
              </div>
            </div>

            {/* Form GÃ¶vdesi */}
            <div style={{ padding: '32px' }}>
              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '0.8rem', fontWeight: 600, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
                  âš ï¸ {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    T.C. Kimlik NumarasÄ±
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={identityNumber}
                      onChange={(e) => setIdentityNumber(e.target.value)}
                      placeholder="11 haneli T.C. No (veya MÃ¼ÅŸteri ID)"
                      maxLength={11}
                      required
                      style={{ width: '100%', padding: '12px 40px 12px 16px', border: '1.5px solid #CBD5E1', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1A1D20', outline: 'none', background: '#FFFFFF' }}
                    />
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94A3B8' }}>ğŸ‘¤</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    6 Haneli Ä°nternet Åifreniz
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="6 haneli ÅŸifre (VarsayÄ±lan: 123456)"
                      maxLength={6}
                      required
                      style={{ width: '100%', padding: '12px 40px 12px 16px', border: '1.5px solid #CBD5E1', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1A1D20', outline: 'none', background: '#FFFFFF' }}
                    />
                    <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', color: '#94A3B8' }}>ğŸ”‘</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', background: '#111111', color: '#FFFFFF', fontWeight: 800, padding: '14px', borderRadius: '10px', border: 'none', fontSize: '0.88rem', letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s' }}
                >
                  {loading ? 'GÄ°RÄ°Å YAPILIYOR...' : 'GÄ°RÄ°Å YAP'}
                </button>
              </form>

              <div style={{ marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#64748B', lineHeight: 1.5 }}>
                ğŸ’¡ <strong>HÄ±zlÄ± Test Bilgisi:</strong> MÃ¼ÅŸteri 1 iÃ§in T.C.: <code>10000000001</code> (Åifre: <code>123456</code>). MÃ¼ÅŸteri 3 (Arda GÃ¼ler) iÃ§in T.C.: <code>10000000003</code>.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Alt KÄ±sÄ±m (GÃ¼venlik & Mentor Bilgilendirme FooterÄ±) */}
      <footer style={{ background: '#FFF9E6', borderTop: '1px solid #FEEEC3', padding: '24px 32px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '900px', background: 'rgba(255,255,255,0.85)', border: '1px solid #FEEEC3', padding: '20px', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div style={{ background: 'rgba(253,187,48,0.15)', border: '1px solid rgba(253,187,48,0.3)', padding: '12px', borderRadius: '50%', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ğŸ›¡ï¸
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#8F6A0F', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              GÃ¼venlik & Proje Bilgilendirmesi
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#7A6128', lineHeight: 1.55, fontWeight: 500 }}>
              Merhaba! Ben OÄŸuz Kaan Yorulmaz. Konya Teknik Ãœniversitesi YazÄ±lÄ±m MÃ¼hendisliÄŸi bÃ¶lÃ¼mÃ¼ Ã¶ÄŸrencisiyim.
              Åu an <strong>VakÄ±fBank</strong> bÃ¼nyesinde, deÄŸerli mentorum <strong>SÄ±la Åirin Ä°ÄDE'nin</strong> rehberliÄŸinde stajÄ±mÄ± yapmaktayÄ±m.
              Modern web technologies, temiz kod mimarisi (Clean Architecture) ve yazÄ±lÄ±m pratikleri Ã¼zerine yoÄŸunlaÅŸarak kendimi geliÅŸtiriyorum.
            </p>
            <p style={{ fontSize: '0.78rem', color: '#7A6128', lineHeight: 1.55, fontWeight: 500 }}>
              Ä°ncelemekte olduÄŸunuz <strong>CampaignGuard</strong> platformu; staj dÃ¶nemimde SÄ±la Åirin Ä°ÄDE'nin mentorluÄŸunda, <strong>.NET Web API (C#)</strong>,
              <strong> FraudGuard SQL Server (PBKDF2/SHA-256 Hashing)</strong> veritabanÄ± altyapÄ±larÄ± ile
              <strong> React (Vite + TypeScript)</strong> frontend kÃ¼tÃ¼phanesi kullanÄ±larak Clean Architecture ve Domain-Driven Design (DDD)
              prensiplerine uygun olarak geliÅŸtirdiÄŸim Kampanya Ã–neri ve BankacÄ±lÄ±k PortalÄ± projemdir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
