import React, { useState } from 'react';
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

const formatCardNumber = (num: string, showFull: boolean) => {
  if (!num) return showFull ? '4543 2819 9012 9100' : '4543 **** **** 9100';
  const clean = num.replace(/\s+/g, '');
  const last4 = clean.slice(-4) || '9100';
  const first4 = clean.length >= 4 && !clean.startsWith('*') ? clean.slice(0, 4) : '4543';

  if (!showFull) {
    return `${first4} **** **** ${last4}`;
  }

  if (clean.includes('*')) {
    return `${first4} 2819 9012 ${last4}`;
  }

  return clean.match(/.{1,4}/g)?.join(' ') || num;
};

export const AccountList: React.FC<AccountListProps> = ({
  customerName, accounts, selectedAccountId, onSelectAccount,
}) => {
  const [showCardNumber, setShowCardNumber] = useState(false);
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
                🏦 {acc.accountName} • {formatIban(acc.iban)}
              </option>
            ))}
          </select>

          {/* Custom Dropdown Arrow Icon */}
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.85rem', color: '#111111', fontWeight: 900 }}>
            ▼
          </div>
        </div>
      </div>

      {/* Selected Account Details Box */}
      {selectedAccount && (
        <div className="card-detail-box">
          <div className="card-detail-header">Hesap & Banka Kartı Detayları</div>

          <div className="card-detail-grid">
            <div className="card-detail-field">
              <span className="card-detail-field-label">Kart Numarası</span>
              <span className="card-detail-field-val" style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {formatCardNumber(selectedAccount.cardNumber || '4543 **** **** 9102', showCardNumber)}
              </span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">Toplam Bakiye</span>
              <span className="card-detail-field-val">{fmt(selectedAccount.balance)} TL</span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">Son Kullanma</span>
              <span className="card-detail-field-val">{selectedAccount.expiryDate || '09/2029'}</span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">CVV / CVC</span>
              <span className="card-detail-field-val" style={{ fontFamily: 'monospace' }}>
                {showCardNumber ? (selectedAccount.cvv || '582') : '***'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            <span
              className="btn-show-number"
              onClick={() => setShowCardNumber(!showCardNumber)}
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              {showCardNumber ? '👁️ Kart numarasını gizle' : '👁️ Kart numarasını göster'}
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                IBAN: <code style={{ fontFamily: 'monospace', fontWeight: 800, color: '#1E293B' }}>{formatIban(selectedAccount.iban)}</code>
              </span>
              <span
                className="btn-show-number"
                onClick={() => navigator.clipboard.writeText(selectedAccount.iban)}
                style={{ cursor: 'pointer' }}
              >
                📋 Kopyala
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

