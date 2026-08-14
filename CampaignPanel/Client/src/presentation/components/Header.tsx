import { useState } from 'react';

interface HeaderProps {
  fullName: string;
  onLogout: () => void;
}

export default function Header({ fullName, onLogout }: HeaderProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <header className="fg-header">
        <div className="fg-header-inner">
          <div className="fg-logo-group">
            <span className="fg-badge">CP</span>
            <span className="fg-brand-title">CampaignPanel</span>
            <span className="fg-brand-subtitle">VakıfBank</span>
          </div>

          <div className="fg-header-right">
            <div className="fg-user-pill">
              <span>👤 {fullName || 'Admin'}</span>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="fg-btn-logout"
            >
              Çıkış
            </button>
          </div>
        </div>
      </header>

      {/* Çıkış Yap Onay Modalı */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>Oturumu Kapat</h3>
            </div>
            <p style={{ fontSize: '13px', color: '#718096', marginBottom: '20px' }}>
              Hesabınızdan çıkış yapmak istediğinize emin misiniz?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-outline"
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  onLogout();
                }}
                className="btn-black"
                style={{ background: '#DC2626', borderColor: '#DC2626', padding: '8px 16px', fontSize: '12px' }}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
