export interface CustomerInfoDto {
  customerId: number;
  fullName: string;
  email?: string;
}

export interface TransactionDto {
  transactionId: number;
  rrn: string;
  amount: number;
  currency: string;
  location: string;
  country: string;
  merchantCategory: string;
  transactionDate: string;
  isOnline: boolean;
  isRefund: boolean;
  isSuspicious: boolean;
  fraudReason: string | null;
}

export interface CreditCardDto {
  creditCardId: number;
  cardNumber: string;
  expiryDate: string;
  cardLimit: number;
  availableLimit: number;
  isBlocked?: boolean;
  recentTransactions: TransactionDto[];
}

export interface BankAccountDto {
  accountId: number;
  accountName: string;
  iban: string;
  balance: number;
  recentTransactions: TransactionDto[];
}

export interface RecommendationDto {
  campaignId: number;
  title: string;
  description: string;
  benefitDescription: string;
  reason: string;
  priorityScore: number;
  isJoined: boolean;
}

export interface CustomerDashboardDto {
  customerId: number;
  customerName: string;
  totalAccountBalance: number;
  totalCreditCardAvailableLimit: number;
  bankAccounts: BankAccountDto[];
  creditCards: CreditCardDto[];
  recommendedCampaign: RecommendationDto | null;
}

export interface CustomerRecommendationResultDto {
  customerId: number;
  customerName: string;
  spendAnalysisSummary: string;
  recommendedCampaignTitle: string;
  ruleCode: string;
}
