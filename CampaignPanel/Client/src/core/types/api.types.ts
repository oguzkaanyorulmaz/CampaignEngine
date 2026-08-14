export interface Campaign {
  campaignId: number;
  title: string;
  description: string;
  benefitDescription: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  discountPercent: number;
  minSpendAmount: number;
  maxDiscountAmount: number;
  category: string;
  minTransactionCount: number;
  lookbackMonths: number;
  cardTypeCondition: string;
  benefitType: string;
  targetingType: string;
  cardBINs?: string;
  customerIds?: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  benefitDescription: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  minSpendAmount: number;
  maxDiscountAmount: number;
  category: string;
  minTransactionCount: number;
  lookbackMonths: number;
  cardTypeCondition: string;
  benefitType: string;
  targetingType: string;
  cardBINs?: string;
  customerIds?: string;
}

export interface UpdateCampaignRequest extends CreateCampaignRequest {
  campaignId: number;
  status: string;
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalParticipants: number;
  expiredCampaigns: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  token?: string;
  fullName?: string;
  errorMessage?: string;
}
