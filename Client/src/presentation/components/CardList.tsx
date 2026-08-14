import React, { useState } from 'react';
import type { CreditCardDto } from '../../core/types/api.types';

interface CardListProps {
  customerName: string;
  cards: CreditCardDto[];
  selectedCardId: number | null;
  onSelectCard: (id: number) => void;
}

const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const UNIQUE_LUHN_PRESETS = [
  { masked: '4000 **** **** 0002', full: '4000 0000 0000 0002' },
  { masked: '5500 **** **** 0004', full: '5500 0000 0000 0004' },
  { masked: '4111 **** **** 1111', full: '4111 1111 1111 1111' },
];

const formatCardNumber = (num: string, showFull: boolean) => {
  if (!num) return '';
  const clean = num.replace(/\s+/g, '');

  const matched = UNIQUE_LUHN_PRESETS.find(p => p.masked.replace(/\s+/g, '') === clean);
  if (matched) {
    return showFull ? matched.full : matched.masked;
  }

  if (!showFull) {
    if (clean.includes('*')) {
      return clean.match(/.{1,4}/g)?.join(' ') || num;
    }
    const first4 = clean.slice(0, 4);
    const last4 = clean.slice(-4);
    return `${first4} **** **** ${last4}`;
  }

  // Göster denildiğinde (Luhn uyumlu gösterim)
  if (clean.includes('*')) {
    const first4 = clean.slice(0, 4);
    const last4 = clean.slice(-4);
    if (first4 === '4000' || last4 === '0002') return '4000 0000 0000 0002';
    if (first4 === '5500' || last4 === '0004') return '5500 0000 0000 0004';
    if (first4 === '4111' || last4 === '1111') return '4111 1111 1111 1111';
    return `${first4} 0000 0000 ${last4}`;
  }

  return clean.match(/.{1,4}/g)?.join(' ') || num;
};

export const CardList: React.FC<CardListProps> = ({
  customerName, cards, selectedCardId, onSelectCard,
}) => {
  const [showCardNumber, setShowCardNumber] = useState(false);
  const selectedCard = cards.find(c => c.creditCardId === selectedCardId) || cards[0];

  const isCardBlocked = selectedCard?.isBlocked ?? false;
  const hasSuspicious = selectedCard?.recentTransactions?.some(t => t.isSuspicious) ?? false;
  const isCardSuspended = !isCardBlocked && hasSuspicious;

  return (
    <div>
      {/* Header Title */}
      <div className="col-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Kart Bilgileri</span>
      </div>

      {/* Kart Bilgileri Yanında / Üstünde Durum Uyarı Bannerları */}
      {isCardBlocked && (
        <div style={{
          background: '#FEF2F2',
          border: '1.5px solid #FCA5A5',
          color: '#991B1B',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '14px',
          fontSize: '0.82rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.2rem' }}>🚫</span>
          <div>
            <div>KARTINIZ BLOKE EDİLMİŞTİR</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B91C1C', marginTop: '2px' }}>
              Güvenlik şüphesi nedeniyle kartınız bloke edilmiştir. İşlem gerçekleştiremezsiniz.
            </div>
          </div>
        </div>
      )}

      {isCardSuspended && (
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FCD34D',
          color: '#92400E',
          padding: '12px 16px',
          borderRadius: '12px',
          marginBottom: '14px',
          fontSize: '0.82rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '1.3rem', color: '#D97706' }}>⚠️</span>
          <div>
            <div>KARTINIZ GEÇİCİ OLARAK ASKIYA ALINMIŞTIR</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B45309', marginTop: '2px' }}>
              Frauda düşen şüpheli işlem tespit edildi. Lütfen Müşteri Hizmetlerini Arayınız: <strong>444 0 724</strong>
            </div>
          </div>
        </div>
      )}

      {/* Modern Combobox (Dropdown Select) for Card Selection */}
      <div style={{ margin: '14px 0 20px 0' }}>

        <div style={{ position: 'relative' }}>
          <select
            value={selectedCard?.creditCardId}
            onChange={(e) => onSelectCard(Number(e.target.value))}
            style={{
              width: '100%',
              padding: '14px 44px 14px 16px',
              fontSize: '0.92rem',
              fontWeight: 800,
              color: isCardBlocked ? '#DC2626' : isCardSuspended ? '#D97706' : '#1E293B',
              background: '#FFFFFF',
              border: isCardBlocked ? '2px solid #FCA5A5' : isCardSuspended ? '2px solid #FCD34D' : '2px solid #FDBB30',
              borderRadius: '12px',
              outline: 'none',
              appearance: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease'
            }}
          >
            {cards.map((card) => {
              const cardBlocked = card.isBlocked ?? false;
              const cardSuspicious = card.recentTransactions?.some(t => t.isSuspicious) ?? false;
              const cardSuspended = !cardBlocked && cardSuspicious;

              let statusSuffix = '';
              if (cardBlocked) statusSuffix = ' [🚫 BLOKELİ]';
              else if (cardSuspended) statusSuffix = ' [⚠️ ASKIYA ALINDI]';

              return (
                <option
                  key={card.creditCardId}
                  value={card.creditCardId}
                  style={{
                    padding: '12px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: cardBlocked ? '#DC2626' : cardSuspended ? '#D97706' : '#1E293B',
                    backgroundColor: cardBlocked ? '#FEF2F2' : cardSuspended ? '#FFFBEB' : '#FFFFFF'
                  }}
                >
                  💳 {formatCardNumber(card.cardNumber, showCardNumber)} {statusSuffix}
                </option>
              );
            })}
          </select>

          {/* Custom Dropdown Arrow Icon */}
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.85rem', color: '#111111', fontWeight: 900 }}>
            ▼
          </div>
        </div>
      </div>

      {/* Selected Card Details Box (VakıfBank UI Bottom Box) */}
      {selectedCard && (
        <div className="card-detail-box" style={{
          borderColor: isCardBlocked ? '#FCA5A5' : isCardSuspended ? '#FDE68A' : undefined
        }}>
          <div className="card-detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Kart Listesi</span>
            {isCardBlocked && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', fontWeight: 900 }}>
                🚫 KART BLOKE EDİLMİŞTİR
              </span>
            )}
            {isCardSuspended && (
              <span style={{ color: '#D97706', fontSize: '0.75rem', fontWeight: 900 }}>
                ⚠️ KART ASKIYA ALINDI • MÜŞTERİ HİZMETLERİNİ ARAYINIZ (444 0 724)
              </span>
            )}
          </div>

          <div className="card-detail-grid">
            <div className="card-detail-field">
              <span className="card-detail-field-label">Kart Numarası</span>
              <span className="card-detail-field-val" style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {formatCardNumber(selectedCard.cardNumber, showCardNumber)}
              </span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">Kullanılabilir Limit</span>
              <span className="card-detail-field-val">{fmt(selectedCard.availableLimit)} TL</span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">Son Kullanma</span>
              <span className="card-detail-field-val">{selectedCard.expiryDate || '12/28'}</span>
            </div>

            <div className="card-detail-field">
              <span className="card-detail-field-label">CVV / CVC</span>
              <span className="card-detail-field-val" style={{ fontFamily: 'monospace' }}>
                {showCardNumber ? (selectedCard.cvv || '341') : '***'}
              </span>
            </div>
          </div>

          <span
            className="btn-show-number"
            onClick={() => setShowCardNumber(!showCardNumber)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {showCardNumber ? '👁️ Kart numarasını gizle' : '👁️ Kart numarasını göster'}
          </span>
        </div>
      )}
    </div>
  );
};
