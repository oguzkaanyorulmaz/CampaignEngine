import React, { useEffect, useState } from 'react';
import type { CustomerRecommendationResultDto } from '../../core/types/api.types';
import { DashboardService } from '../../application/services/DashboardService';

interface Props {
  service: DashboardService;
}

const ruleIcons: Record<string, string> = {
  'MARKET_15K': '🛒',
  'FUEL_5K': '⛽',
  'ONLINE_60': '💻',
  'RESTAURANT_8K': '🍽️',
  'INT_MILES': '✈️',
  'INSTALLMENT_40': '💳',
};

export const AdminResultsTable: React.FC<Props> = ({ service }) => {
  const [results, setResults] = useState<CustomerRecommendationResultDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    service.loadAdminResults()
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [service]);

  if (loading) {
    return <div className="loading"><div className="spinner" /> Analiz sonuçları yükleniyor...</div>;
  }

  return (
    <div className="admin-page">
      <div className="section-title" style={{ marginBottom: 16 }}>
        📊 Müşteri Kampanya Analiz Sonuç Tablosu <span className="badge">{results.length} Müşteri</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Müşteri ID</th>
              <th>Müşteri Adı</th>
              <th>Harcama Analiz Özeti</th>
              <th>Önerilen Kampanya</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={r.customerId} style={{ animationDelay: `${i * 0.08}s` }}>
                <td style={{ fontWeight: 700 }}>{r.customerId}</td>
                <td>{r.customerName}</td>
                <td style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{r.spendAnalysisSummary}</td>
                <td>
                  <span className="admin-campaign-badge">
                    {ruleIcons[r.ruleCode] || '🎁'} {r.recommendedCampaignTitle}
                  </span>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={4} className="empty-state">Henüz analiz sonucu bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
