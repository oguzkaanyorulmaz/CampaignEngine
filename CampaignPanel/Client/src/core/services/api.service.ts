import type { Campaign, CreateCampaignRequest, UpdateCampaignRequest, DashboardStats, LoginRequest, LoginResult } from '../types/api.types';

const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.errorMessage || err.message || 'İstek başarısız.');
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

export const api = {
  // Auth
  login: (data: LoginRequest) =>
    request<LoginResult>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  // Campaigns
  getCampaigns: () => request<Campaign[]>('/campaign'),
  getCampaignById: (id: number) => request<Campaign>(`/campaign/${id}`),
  createCampaign: (data: CreateCampaignRequest) =>
    request<Campaign>('/campaign', { method: 'POST', body: JSON.stringify(data) }),
  updateCampaign: (id: number, data: UpdateCampaignRequest) =>
    request<Campaign>(`/campaign/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCampaign: (id: number) =>
    request<void>(`/campaign/${id}`, { method: 'DELETE' }),

  // Dashboard
  getStats: () => request<DashboardStats>('/campaign/stats'),
};
