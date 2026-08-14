import type { Campaign } from '../../core/types/api.types';

interface CampaignTableProps {
  campaigns: Campaign[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: number) => void;
  onCreate: () => void;
}

const categoryLabels: Record<string, string> = {
  All: 'Tüm İşlemler',
  Fuel: 'Akaryakıt',
  ECommerce: 'E-Ticaret',
  Restaurant: 'Restoran',
  Market: 'Süpermarket',
  Travel: 'Seyahat',
  Entertainment: 'Eğlence',
};

const targetLabels: Record<string, string> = {
  All: 'Tüm Kullanıcılar',
  SpecificCards: 'Spesifik Kartlar',
  CustomerSegment: 'Müşteri Segmenti',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

export default function CampaignTable({ campaigns, onEdit, onDelete, onCreate }: CampaignTableProps) {
  return (
    <div className="table-container">
      <div className="table-header">
        <h3>📋 Kampanya Listesi</h3>
        <button className="btn-create" onClick={onCreate}>
          <span>＋</span> Yeni Kampanya
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Henüz kampanya yok</h3>
          <p>Yeni bir kampanya oluşturmak için yukarıdaki butona tıklayın.</p>
        </div>
      ) : (
        <table className="campaign-table">
          <thead>
            <tr>
              <th>Kampanya Adı</th>
              <th>İndirim</th>
              <th>Min / Max</th>
              <th>Kategori</th>
              <th>Tarih Aralığı</th>
              <th>Hedef</th>
              <th>Durum</th>
              <th>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(c => (
              <tr key={c.campaignId}>
                <td>
                  <strong>{c.title}</strong>
                  <br />
                  <span style={{ fontSize: 12, color: '#94A3B8' }}>{c.description.substring(0, 50)}{c.description.length > 50 ? '...' : ''}</span>
                </td>
                <td style={{ fontWeight: 700, color: '#FDBB30' }}>%{c.discountPercent}</td>
                <td>
                  <span style={{ fontSize: 12 }}>
                    Min: {c.minSpendAmount.toLocaleString('tr-TR')}₺<br />
                    Max: {c.maxDiscountAmount.toLocaleString('tr-TR')}₺
                  </span>
                </td>
                <td>{categoryLabels[c.category] || c.category}</td>
                <td style={{ fontSize: 12 }}>
                  {formatDate(c.startDate)}<br />
                  {formatDate(c.endDate)}
                </td>
                <td>
                  <span style={{ fontSize: 12 }}>{targetLabels[c.targetingType] || c.targetingType}</span>
                </td>
                <td>
                  <span className={`badge ${c.status.toLowerCase()}`}>{c.status}</span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn-icon" title="Düzenle" onClick={() => onEdit(c)}>✏️</button>
                    <button className="btn-icon danger" title="Sil" onClick={() => onDelete(c.campaignId)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
