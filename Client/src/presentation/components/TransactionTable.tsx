import React from 'react';
import type { TransactionDto } from '../../core/types/api.types';

interface Props {
  transactions: TransactionDto[];
}

const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Market': return '🛒';
    case 'E-Ticaret': return '🌐';
    case 'Akaryakıt': return '⛽';
    case 'Kuyumcu': return '💎';
    case 'Restoran': return '🍽️';
    case 'Seyahat': return '✈️';
    case 'Elektronik': return '📱';
    case 'Giyim': return '👔';
    default: return '💳';
  }
};

const getBadge = (tx: TransactionDto) => {
  if (tx.isSuspicious) {
    return (
      <span style={{
        background: '#FEF2F2',
        color: '#DC2626',
        border: '1px solid #FCA5A5',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }} title={tx.fraudReason || 'Şüpheli işlem'}>
        ⚠️ Şüpheli İşlem
      </span>
    );
  }
  if (tx.isRefund) {
    return (
      <span style={{
        background: '#F3E8FF',
        color: '#7C3AED',
        border: '1px solid #DDD6FE',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: 800,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        ↩️ İade İşlemi
      </span>
    );
  }
  return (
    <span style={{
      background: '#DCFCE7',
      color: '#15803D',
      border: '1px solid #86EFAC',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.72rem',
      fontWeight: 800,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px'
    }}>
      ✅ Onaylı
    </span>
  );
};

export const TransactionTable: React.FC<Props> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <div className="empty-state">Bu kart için henüz işlem bulunmuyor.</div>;
  }

  return (
    <div>
      {/* Modern Header Section */}
      <div className="section-title" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Alışveriş & İşlem Geçmişi</span>
          <span style={{ background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
            {transactions.length} İşlem
          </span>
        </div>
      </div>

      {/* Modern Card List Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 14 }}>
        {transactions.map((tx, i) => (
          <div
            key={tx.transactionId || i}
            style={{
              background: '#FFFFFF',
              border: tx.isSuspicious ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
              transition: 'all 0.2s ease',
              animation: 'fadeIn 0.3s ease-out',
            }}
          >
            {/* Left: Category Icon & Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: tx.isSuspicious ? '#FEF2F2' : tx.isRefund ? '#F3E8FF' : '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0
                }}
              >
                {getCategoryIcon(tx.merchantCategory)}
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>
                  {tx.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px', fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                  <span>{tx.merchantCategory}</span>
                  <span>•</span>
                  <span>{tx.country}</span>
                  <span>•</span>
                  <span>{tx.isOnline ? '🌐 Online POS' : '🏪 Fiziksel POS'}</span>
                  <span>•</span>
                  <span>{formatDate(tx.transactionDate)}</span>
                </div>
              </div>
            </div>

            {/* Right: Badge & Amount */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', textAlign: 'right' }}>
              <div>{getBadge(tx)}</div>

              <div style={{ minWidth: '110px' }}>
                <span
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 900,
                    color: tx.isRefund ? '#7C3AED' : '#0F172A',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {tx.isRefund ? '-' : ''}{fmt(tx.amount)} <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{tx.currency}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
