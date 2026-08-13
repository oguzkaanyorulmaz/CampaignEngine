import React from 'react';

interface SidebarProps {
  totalBalance: number;
  totalCreditLimit: number;
  accountCount: number;
  cardCount: number;
  activeView: 'cards' | 'accounts';
  onSelectView: (view: 'cards' | 'accounts') => void;
}

const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const SidebarSummary: React.FC<SidebarProps> = ({
  totalBalance, totalCreditLimit, accountCount, cardCount, activeView, onSelectView,
}) => (
  <div className="sidebar-stack">
    {/* Hesaplarım Box */}
    <div
      className={`summary-card ${activeView === 'accounts' ? 'active-card' : ''}`}
      onClick={() => onSelectView('accounts')}
      style={{ cursor: 'pointer' }}
    >
      <div className="summary-card-title">Hesaplarım ({accountCount || 2})</div>
      <div className="summary-card-row">
        <span className="summary-card-label">Toplam Bakiye</span>
        <span className="summary-card-val">{fmt(totalBalance)} TL</span>
      </div>
    </div>

    {/* Kredi Kartlarım Box */}
    <div
      className={`summary-card ${activeView === 'cards' ? 'active-card' : ''}`}
      onClick={() => onSelectView('cards')}
      style={{ cursor: 'pointer' }}
    >
      <div className="summary-card-title">Kredi Kartlarım ({cardCount})</div>
      <div className="summary-card-row">
        <span className="summary-card-label">Kullanılabilir Limit</span>
        <span className="summary-card-val">{fmt(totalCreditLimit)} TL</span>
      </div>
    </div>
  </div>
);
