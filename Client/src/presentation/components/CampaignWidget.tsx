import React, { useState, useEffect, useRef } from 'react';
import type { RecommendationDto } from '../../core/types/api.types';

interface Props {
  recommendation: RecommendationDto | null;
  activeCampaigns?: RecommendationDto[];
  redeemedCampaigns?: RecommendationDto[];
  onJoin: (campaignId: number) => Promise<boolean>;
}

export const CampaignWidget: React.FC<Props> = ({
  recommendation,
  activeCampaigns = [],
  redeemedCampaigns = [],
  onJoin,
}) => {
  // Eğer activeCampaigns listesi boşsa ama recommendation varsa ve redeemed değilse onu kullan
  const activeList = activeCampaigns.length > 0
    ? activeCampaigns
    : recommendation && !recommendation.isRedeemed
    ? [recommendation]
    : [];

  // Eğer redeemedCampaigns listesi boşsa ama recommendation redeemed ise onu kullan
  const redeemedList = redeemedCampaigns.length > 0
    ? redeemedCampaigns
    : recommendation && recommendation.isRedeemed
    ? [recommendation]
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [joinedMap, setJoinedMap] = useState<Record<number, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync initial joined status
  useEffect(() => {
    const map: Record<number, boolean> = {};
    activeList.forEach(c => {
      if (c.isJoined) map[c.campaignId] = true;
    });
    setJoinedMap(prev => ({ ...prev, ...map }));
  }, [activeList]);

  // Otomatik 5 Saniyede Bir Kayan Slider (Auto Carousel)
  useEffect(() => {
    if (activeList.length <= 1 || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeList.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeList.length, isHovered]);

  const handleJoin = async (campaignId: number) => {
    if (joinedMap[campaignId] || loadingMap[campaignId]) return;
    setLoadingMap(prev => ({ ...prev, [campaignId]: true }));
    const success = await onJoin(campaignId);
    if (success) {
      setJoinedMap(prev => ({ ...prev, [campaignId]: true }));
    }
    setLoadingMap(prev => ({ ...prev, [campaignId]: false }));
  };

  const currentActiveCampaign = activeList[currentIndex] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* ══════════════════════════════════════════════════════════════
          1. ÜST BÖLÜM: KATILABİLECEĞİNİZ VEYA KATILDIĞINIZ KAMPANYALAR
          ══════════════════════════════════════════════════════════════ */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div className="col-title" style={{ margin: 0 }}>
            🎁 Aktif & Katılabileceğiniz Kampanyalar
          </div>
          {activeList.length > 1 && (
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>
              {currentIndex + 1} / {activeList.length}
            </span>
          )}
        </div>

        <div
          className="campaign-card-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ transition: 'all 0.3s ease' }}
        >
          {/* Soft Illustration Banner */}
          <div className="campaign-banner-illustration">
            <div className="illustration-svg-wrap">
              <svg width="170" height="120" viewBox="0 0 200 150" fill="none">
                {/* Back Card (Yellow) */}
                <rect x="25" y="15" width="140" height="90" rx="12" fill="#FDE047" transform="rotate(-8 95 60)" />
                {/* Sparkles */}
                <path d="M95 10 L95 2M90 6 L100 6M120 18 L126 12M70 18 L64 12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
                {/* Front Card */}
                <rect x="35" y="45" width="145" height="92" rx="12" fill="#6366F1" />
                <rect x="52" y="62" width="28" height="22" rx="4" fill="#FDE047" />
                <circle cx="145" cy="115" r="10" fill="#EF4444" opacity="0.9" />
                <circle cx="132" cy="115" r="10" fill="#F59E0B" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* Campaign Card Body */}
          <div className="campaign-card-content">
            {currentActiveCampaign ? (
              <div key={currentActiveCampaign.campaignId} className="row-enter">
                {/* Header Tag / Pill */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div className="campaign-subtitle" style={{ margin: 0 }}>
                    Size Özel Fırsat
                  </div>
                  {joinedMap[currentActiveCampaign.campaignId] ? (
                    <span style={{
                      background: '#FEF3C7',
                      color: '#B45309',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #FDE68A'
                    }}>
                      ✅ KATILDINIZ
                    </span>
                  ) : (
                    <span style={{
                      background: '#EFF6FF',
                      color: '#2563EB',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 9px',
                      borderRadius: '12px',
                      border: '1px solid #BFDBFE'
                    }}>
                      ⚡ KATILABİLİRSİNİZ
                    </span>
                  )}
                </div>

                {/* Campaign Title */}
                <div className="campaign-title-main">
                  {currentActiveCampaign.title}
                </div>

                {/* Benefit Tag */}
                {currentActiveCampaign.benefitDescription && (
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', marginBottom: '8px' }}>
                    🎁 {currentActiveCampaign.benefitDescription}
                  </div>
                )}

                {/* Description */}
                <p className="campaign-desc-text">
                  {currentActiveCampaign.description}
                </p>

                {/* Analysis Reason Box */}
                {currentActiveCampaign.reason && (
                  <div className="campaign-reason-box">
                    📊 <strong>Analiz Özeti:</strong> {currentActiveCampaign.reason}
                  </div>
                )}

                {/* Action Button */}
                <button
                  className={`btn-campaign-action ${joinedMap[currentActiveCampaign.campaignId] ? 'joined' : ''}`}
                  onClick={() => handleJoin(currentActiveCampaign.campaignId)}
                  disabled={joinedMap[currentActiveCampaign.campaignId] || loadingMap[currentActiveCampaign.campaignId]}
                  style={{
                    cursor: joinedMap[currentActiveCampaign.campaignId] ? 'default' : 'pointer'
                  }}
                >
                  {loadingMap[currentActiveCampaign.campaignId]
                    ? '⏳ İşleniyor...'
                    : joinedMap[currentActiveCampaign.campaignId]
                    ? '✅ Kampanyaya Katıldınız (İlk Alışverişinizde Geçerli)'
                    : '🚀 Kampanyaya Katıl'}
                </button>
              </div>
            ) : (
              <div>
                <div className="campaign-subtitle" style={{ color: '#94A3B8' }}>Kampanya Durumu</div>
                <div className="campaign-title-main" style={{ fontSize: '15px' }}>
                  Yayınlanmış Aktif Kampanya Yok
                </div>
                <p className="campaign-desc-text">
                  Şu anda adınıza tanımlanmış yeni bir aktif kampanya bulunmamaktadır. Kampanya Yönetim Panelinden yeni kampanya yayınlandığında burada görüntülenecektir.
                </p>
              </div>
            )}

            {/* ═══════ GÖSTERGE TOPLARI (PAGINATION DOTS) ═══════ */}
            {activeList.length > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}>
                {activeList.map((c, idx) => (
                  <button
                    key={c.campaignId}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: currentIndex === idx ? '22px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: currentIndex === idx ? '#FDBB30' : '#CBD5E1',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      padding: 0
                    }}
                    title={c.title}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. ALT BÖLÜM: KULLANDIĞINIZ KAMPANYALAR (KAZANÇ SAĞLANANLAR)
          ══════════════════════════════════════════════════════════════ */}
      <div>
        <div className="col-title" style={{ color: '#16A34A', marginBottom: '8px' }}>
          🎉 Kullandığınız Kampanyalar
        </div>

        {redeemedList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {redeemedList.map(item => (
              <div
                key={item.campaignId}
                className="campaign-card-container"
                style={{
                  border: '1.5px solid #BBF7D0',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
                }}
              >
                <div style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      ✨ İndirim Uygulandı
                    </span>
                    <span style={{
                      background: '#DCFCE7',
                      color: '#15803D',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      border: '1px solid #86EFAC'
                    }}>
                      🎉 KULLANILDI
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    {item.title}
                  </h4>

                  {/* Saved Amount Badge */}
                  <div style={{
                    background: '#F0FDF4',
                    border: '1px solid #86EFAC',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#15803D',
                    margin: '8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>💰</span>
                    <span>
                      Bu kampanyadan <strong>{(item.totalSavedAmount || 250).toLocaleString('tr-TR')} ₺</strong> indirim/kazanç sağladınız!
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', margin: '6px 0' }}>
                    {item.description}
                  </p>

                  <div style={{
                    marginTop: '10px',
                    padding: '8px 12px',
                    background: '#F8FAFC',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#475569',
                    borderLeft: '3px solid #16A34A'
                  }}>
                    ℹ️ İndirim tutarı kart ekstrenize ve kullanılabilir limitinize otomatik olarak yansıtılmıştır.
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: '#F8FAFC',
            border: '1px dashed #CBD5E1',
            borderRadius: '12px',
            padding: '18px 20px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#64748B'
          }}>
            <span>⏳</span> Henüz kullandığınız bir kampanya bulunmuyor. Katıldığınız kampanyalardan harcama yaptıkça kazançlarınız burada listelenecektir.
          </div>
        )}
      </div>

    </div>
  );
};
