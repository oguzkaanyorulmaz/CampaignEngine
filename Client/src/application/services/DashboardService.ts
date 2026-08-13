import type { CustomerDashboardDto, CustomerRecommendationResultDto, CustomerInfoDto } from '../../core/types/api.types';
import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository';

export class DashboardService {
  constructor(private repo: IDashboardRepository) {}

  async loadCustomers(): Promise<CustomerInfoDto[]> {
    return this.repo.getCustomers();
  }

  async loadDashboard(customerId: number): Promise<CustomerDashboardDto> {
    return this.repo.getCustomerDashboard(customerId);
  }

  async joinCampaign(customerId: number, campaignId: number): Promise<boolean> {
    return this.repo.joinCampaign(customerId, campaignId);
  }

  async loadAdminResults(): Promise<CustomerRecommendationResultDto[]> {
    return this.repo.getAdminResults();
  }
}
