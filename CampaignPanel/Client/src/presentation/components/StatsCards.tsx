import type { DashboardStats } from '../../core/types/api.types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card gold">
        <div className="stat-icon">📊</div>
        <div className="stat-value">{stats.totalCampaigns}</div>
        <div className="stat-label">Toplam Kampanya</div>
      </div>
      <div className="stat-card green">
        <div className="stat-icon">✅</div>
        <div className="stat-value">{stats.activeCampaigns}</div>
        <div className="stat-label">Aktif Kampanya</div>
      </div>
      <div className="stat-card blue">
        <div className="stat-icon">👥</div>
        <div className="stat-value">{stats.totalParticipants}</div>
        <div className="stat-label">Toplam Katılımcı</div>
      </div>
      <div className="stat-card red">
        <div className="stat-icon">⏰</div>
        <div className="stat-value">{stats.expiredCampaigns}</div>
        <div className="stat-label">Süresi Dolan</div>
      </div>
    </div>
  );
}
