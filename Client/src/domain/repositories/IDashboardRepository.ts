import type { CustomerDashboardDto, CustomerRecommendationResultDto, CustomerInfoDto } from '../../core/types/api.types';

export interface IDashboardRepository {
  getCustomers(): Promise<CustomerInfoDto[]>;
  getCustomerDashboard(customerId: number): Promise<CustomerDashboardDto>;
  joinCampaign(customerId: number, campaignId: number): Promise<boolean>;
  getAdminResults(): Promise<CustomerRecommendationResultDto[]>;
}
