import { apiClient } from './client';
import type { PaginatedResult } from '@rajmohancoder/types';
import type {
  CustomerWithDetails,
  CustomerFormData,
  CustomerStats,
} from '../../types';

export const customerApi = {
  list: (params: { page: number; pageSize: number; search?: string; status?: string; tier?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) =>
    apiClient.get<PaginatedResult<CustomerWithDetails>>('/customers', { params }),

  get: (id: string) =>
    apiClient.get<CustomerWithDetails>(`/customers/${id}`),

  create: (data: CustomerFormData) =>
    apiClient.post<CustomerWithDetails>('/customers', data),

  update: (id: string, data: Partial<CustomerFormData>) =>
    apiClient.put<CustomerWithDetails>(`/customers/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/customers/${id}`),

  getStats: () =>
    apiClient.get<CustomerStats>('/customers/stats'),
};
