import React from 'react';
import type { TransactionDto } from '../../core/types/api.types';

interface Props {
  transactions: TransactionDto[];
  currentBalance?: number;
  balanceLabel?: string;
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
    case 'Banka Transferi': return '💸';
    case 'ATM': return '🏧';
    default: return '💳';
  }
};

// İade veya Hesaba Gelen Para kontrolü (Pozitif / Yeşil)
const isPositiveTx = (tx: TransactionDto) => {
  if (tx.isRefund) return true;
  const loc = (tx.location || '').toLowerCase();
  const cat = (tx.merchantCategory || '').toLowerCase();
  return (
    cat.includes('gelen') ||
    cat.includes('maaş') ||
    loc.includes('maaş') ||
    loc.includes('gelen transfer') ||
    loc.includes('eft gelen') ||
    loc.includes('havale gelen')
  );
};

export const TransactionTable: React.FC<Props> = ({ transactions, currentBalance = 0, balanceLabel = 'Kalan Bakiye' }) => {
  // Şüpheli ve Reddedilen işlemleri filtrele (sadece geçerli harcama/iade/para transferleri)
  const filteredTransactions = transactions.filter(
    (tx) => !tx.isSuspicious && !tx.isDeclined
  );

  if (filteredTransactions.length === 0) {
    return <div className="empty-state">Henüz işlem bulunmuyor.</div>;
  }

  // İşlem sonrası kalan bakiye/limit hesaplaması (en yeni işlemden en eskiye doğru)
  const balances: number[] = new Array(filteredTransactions.length);
  let running = currentBalance;
  for (let i = 0; i < filteredTransactions.length; i++) {
    balances[i] = running;
    const tx = filteredTransactions[i];
    const isPositive = isPositiveTx(tx);
    if (isPositive) {
      running -= tx.amount;
    } else {
      running += tx.amount;
    }
  }

  return (
    <div>
      {/* Modern Header Section */}
      <div className="section-title" style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Alışveriş & İşlem Geçmişi</span>
          <span style={{ background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
            {filteredTransactions.length} İşlem
          </span>
        </div>
      </div>

      {/* Modern Card List Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 14 }}>
        {filteredTransactions.map((tx, i) => {
          const isPositive = isPositiveTx(tx);
          const amountColor = isPositive ? '#16A34A' : '#DC2626'; // Yeşil : Kırmızı
          const amountPrefix = isPositive ? '+' : '-';
          const remainingAfter = balances[i];

          return (
            <div
              key={tx.transactionId || i}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
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
                    background: isPositive ? '#F0FDF4' : '#FEF2F2',
                    border: isPositive ? '1px solid #BBF7D0' : '1px solid #FECACA',
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

              {/* Right: Amount & Remaining Balance After Transaction */}
              <div style={{ minWidth: '140px', textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    color: amountColor,
                    letterSpacing: '-0.01em'
                  }}
                >
                  {amountPrefix}{fmt(tx.amount)} <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{tx.currency}</span>
                </span>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', fontWeight: 600 }}>
                  {balanceLabel}: {fmt(remainingAfter)} {tx.currency}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


