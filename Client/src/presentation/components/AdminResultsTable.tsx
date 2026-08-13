import React, { useEffect, useState } from 'react';
import type { CustomerRecommendationResultDto } from '../../core/types/api.types';
import { DashboardService } from '../../application/services/DashboardService';

interface Props {
  service: DashboardService;
}

const ruleIcons: Record<string, string> = {
  'MARKET_15K': 'ğŸ›’',
  'FUEL_5K': 'â›½',
  'ONLINE_60': 'ğŸ’»',
  'RESTAURANT_8K': 'ğŸ½ï¸',
  'INT_MILES': 'âœˆï¸',
  'INSTALLMENT_40': 'ğŸ’³',
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
    return <div className="loading"><div className="spinner" /> Analiz sonuÃ§larÄ± yÃ¼kleniyor...</div>;
  }

  return (
    <div className="admin-page">
      <div className="section-title" style={{ marginBottom: 16 }}>
        ğŸ“Š MÃ¼ÅŸteri Kampanya Analiz SonuÃ§ Tablosu <span className="badge">{results.length} MÃ¼ÅŸteri</span>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>MÃ¼ÅŸteri ID</th>
              <th>MÃ¼ÅŸteri AdÄ±</th>
              <th>Harcama Analiz Ã–zeti</th>
              <th>Ã–nerilen Kampanya</th>
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
                    {ruleIcons[r.ruleCode] || 'ğŸ'} {r.recommendedCampaignTitle}
                  </span>
                </td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={4} className="empty-state">HenÃ¼z analiz sonucu bulunamadÄ±.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
