import React from 'react';
import type { BankAccountDto } from '../../core/types/api.types';

interface AccountListProps {
  customerName: string;
  accounts: BankAccountDto[];
  selectedAccountId: number | null;
  onSelectAccount: (id: number) => void;
}

const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatIban = (iban: string) => {
  if (!iban) return 'TR11 0006 2000 0000 0001 0000 01';
  return iban.replace(/(.{4})/g, '$1 ').trim();
};

export const AccountList: React.FC<AccountListProps> = ({
  customerName, accounts, selectedAccountId, onSelectAccount,
}) => {
  const selectedAccount = accounts.find(a => a.accountId === selectedAccountId) || accounts[0];

  return (
    <div>
      {/* Header with Title and + Yeni Hesap button */}
      <div className="col-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Hesap Bilgileri</span>
        <button className="btn-new-card">+ Yeni Hesap</button>
      </div>

      {/* Modern Combobox (Dropdown Select) for Bank Account Selection */}
      <div style={{ margin: '14px 0 20px 0' }}>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
          Aktif Banka HesabÄ±nÄ± SeÃ§iniz ({accounts.length} Hesap TanÄ±mlÄ±)
        </label>
        <div style={{ position: 'relative' }}>
          <select
            value={selectedAccount?.accountId}
            onChange={(e) => onSelectAccount(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '14px 44px 14px 16px',
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#1E293B',
              background: '#FFFFFF',
              border: '2px solid #FDBB30',
              borderRadius: '12px',
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease'
            }}
          >
            {accounts.map((acc) => (
              <option key={acc.accountId} value={acc.accountId} style={{ padding: '10px', fontSize: '0.9rem', fontWeight: 700 }}>
                ğŸ¦ {acc.accountName} â€¢ {formatIban(acc.iban)} ({fmt(acc.balance)} TL Bakiye)
              </option>
            ))}
          </select>

          {/* Custom Dropdown Arrow Icon */}
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.85rem', color: '#111111', fontWeight: 900 }}>
            â–¼
          </div>
        </div>
      </div>

      {/* Selected Account Details Box */}
      {selectedAccount && (
        <div className="card-detail-box">
          <div className="card-detail-header">Hesap DetaylarÄ±</div>

          <div className="card-detail-grid">
            <div className="card-detail-field" style={{ gridColumn: 'span 2' }}>
              <span className="card-detail-field-label">Hesap Sahibi / IBAN</span>
              <span className="card-detail-field-val" style={{ fontSize: '0.88rem', fontFamily: 'monospace' }}>
                {customerName} â€¢ {formatIban(selectedAccount.iban)}
              </span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">Toplam Bakiye</span>
              <span className="card-detail-field-val">{fmt(selectedAccount.balance)} TL</span>
            </div>
          </div>

          <span className="btn-show-number" onClick={() => navigator.clipboard.writeText(selectedAccount.iban)}>
            ğŸ“‹ IBAN Kopyala
          </span>
        </div>
      )}
    </div>
  );
};
