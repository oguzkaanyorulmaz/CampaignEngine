import type { CustomerDashboardDto, CustomerRecommendationResultDto, CustomerInfoDto } from '../../core/types/api.types';
import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';

const API_BASE = 'http://localhost:5000/api';

export class DashboardRepository implements IDashboardRepository {
  async getCustomers(): Promise<CustomerInfoDto[]> {
    try {
      const res = await fetch(`${API_BASE}/dashboard/customers`);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch {
      return [
        { customerId: 1, fullName: 'Arda Güler' },
        { customerId: 2, fullName: 'Hakan Çalhanoğlu' },
        { customerId: 3, fullName: 'Kenan Yıldız' },
        { customerId: 1001, fullName: 'Ahmet Yılmaz (Demo)' }
      ];
    }
  }

  async getCustomerDashboard(customerId: number): Promise<CustomerDashboardDto> {
    const res = await fetch(`${API_BASE}/dashboard/${customerId}`);
    if (!res.ok) throw new Error(`Dashboard fetch failed: ${res.status}`);
    return res.json();
  }

  async joinCampaign(customerId: number, campaignId: number): Promise<boolean> {
    const res = await fetch(`${API_BASE}/campaigns/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, campaignId }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  }

  async getAdminResults(): Promise<CustomerRecommendationResultDto[]> {
    const res = await fetch(`${API_BASE}/campaigns/admin/results`);
    if (!res.ok) throw new Error(`Admin results fetch failed: ${res.status}`);
    return res.json();
  }
}
