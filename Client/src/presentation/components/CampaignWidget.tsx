import React, { useState } from 'react';
import type { RecommendationDto } from '../../core/types/api.types';

interface Props {
  recommendation: RecommendationDto | null;
  onJoin: (campaignId: number) => Promise<boolean>;
}

export const CampaignWidget: React.FC<Props> = ({ recommendation, onJoin }) => {
  const [joined, setJoined] = useState(recommendation?.isJoined ?? false);
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!recommendation || joined || loading) return;
    setLoading(true);
    const success = await onJoin(recommendation.campaignId);
    if (success) setJoined(true);
    setLoading(false);
  };

  return (
    <div>
      <div className="col-title">Kart Avantajları</div>

      <div className="campaign-card-container">
        {/* Soft Blue Illustration Banner (Exact VakıfBank Credit Cards Illustration) */}
        <div className="campaign-banner-illustration">
          <div className="illustration-svg-wrap">
            <svg width="170" height="130" viewBox="0 0 200 150" fill="none">
              {/* Back Card (Yellow) */}
              <rect x="25" y="15" width="140" height="90" rx="12" fill="#FDE047" transform="rotate(-8 95 60)" />
              {/* Card Rays / Sparkles */}
              <path d="M95 10 L95 2M90 6 L100 6M120 18 L126 12M70 18 L64 12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
              {/* Front Card (Purple/Blue) */}
              <rect x="35" y="45" width="145" height="92" rx="12" fill="#6366F1" />
              <rect x="52" y="62" width="28" height="22" rx="4" fill="#FDE047" />
              <circle cx="145" cy="115" r="10" fill="#EF4444" opacity="0.9" />
              <circle cx="132" cy="115" r="10" fill="#F59E0B" opacity="0.9" />
            </svg>
          </div>
        </div>

        {/* Campaign Card Body */}
        <div className="campaign-card-content">
          <div className="campaign-subtitle">Size Özel</div>

          <div className="campaign-title-main">
            {recommendation ? recommendation.title : 'Kartınızla Ayrıcalıklı Alışveriş'}
          </div>

          <p className="campaign-desc-text">
            {recommendation
              ? recommendation.description
              : 'Taksit fırsatları, puan kazanımı ve size özel indirimlerle harcamalarınız avantaja dönüşsün.'}
          </p>

          {recommendation && (
            <div className="campaign-reason-box">
              📊 <strong>Analiz Özeti:</strong> {recommendation.reason}
            </div>
          )}

          {recommendation ? (
            <button
              className={`btn-campaign-action ${joined ? 'joined' : ''}`}
              onClick={handleJoin}
              disabled={joined || loading}
            >
              {loading ? '⏳ İşleniyor...' : joined ? '✅ Kampanyaya Katıldınız' : 'Kampanyaya Katıl'}
            </button>
          ) : (
            <button className="btn-campaign-action">
              Kampanyaları İnceleyin
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
