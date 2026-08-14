import { useState, useEffect, useCallback } from 'react';
import { api } from '../../core/services/api.service';
import type { Campaign, DashboardStats, CreateCampaignRequest } from '../../core/types/api.types';
import StatsCards from '../components/StatsCards';
import CampaignTable from '../components/CampaignTable';
import CampaignForm from '../components/CampaignForm';
import Header from '../components/Header';

interface DashboardPageProps {
  fullName: string;
  onLogout: () => void;
}

export default function DashboardPage({ fullName, onLogout }: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'edit'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalCampaigns: 0, activeCampaigns: 0, totalParticipants: 0, expiredCampaigns: 0 });
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [campaignList, dashStats] = await Promise.all([
        api.getCampaigns(),
        api.getStats(),
      ]);
      setCampaigns(campaignList);
      setStats(dashStats);
    } catch (err) {
      console.error('Veri yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = () => {
    setEditingCampaign(null);
    setActiveTab('create');
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setActiveTab('edit');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) return;
    try {
      await api.deleteCampaign(id);
      await loadData();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  const handleFormSubmit = async (data: CreateCampaignRequest, campaignId?: number) => {
    try {
      if (campaignId) {
        await api.updateCampaign(campaignId, { ...data, campaignId, status: 'Active' });
      } else {
        await api.createCampaign(data);
      }
      setActiveTab('campaigns');
      await loadData();
    } catch (err) {
      console.error('Kaydetme hatası:', err);
    }
  };

  const handleCancel = () => {
    setEditingCampaign(null);
    setActiveTab('campaigns');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header fullName={fullName} onLogout={onLogout} />

      {/* Tabs Bar (FraudGuard Style) */}
      <div className="fg-tabs-container">
        <div className="fg-tabs">
          <button
            className={`fg-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => { setEditingCampaign(null); setActiveTab('campaigns'); }}
          >
            <span>📊</span> Kampanya Yönetimi
          </button>
          <button
            className={`fg-tab ${activeTab === 'create' || activeTab === 'edit' ? 'active' : ''}`}
            onClick={handleCreate}
          >
            <span>➕</span> {activeTab === 'edit' ? 'Kampanya Düzenle' : 'Yeni Kampanya Yayınla'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="fg-container">
        {activeTab === 'campaigns' && (
          <div className="row-enter">
            <StatsCards stats={stats} />

            {loading ? (
              <div className="loading"><div className="spinner" /></div>
            ) : (
              <CampaignTable
                campaigns={campaigns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onCreate={handleCreate}
              />
            )}
          </div>
        )}

        {(activeTab === 'create' || activeTab === 'edit') && (
          <div className="row-enter">
            <CampaignForm
              editCampaign={editingCampaign}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}
      </main>
    </div>
  );
}
