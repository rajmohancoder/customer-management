import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerApi } from './api';
import { QUERY_KEYS } from '@/constants';
import type { CustomerFormData } from '../../types';

export function useCustomers(params: { page: number; pageSize: number; search?: string; status?: string; tier?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) {
  return useQuery({
    queryKey: [QUERY_KEYS.customers, params],
    queryFn: () => customerApi.list(params).then((r) => r.data),
    staleTime: 30_000,
    retry: false, // api-client already retries internally
  });
}

export function useCustomer(id?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.customer(id!),
    queryFn: () => customerApi.get(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 30_000,
    retry: false,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: [QUERY_KEYS.customerStats],
    queryFn: () => customerApi.getStats().then((r) => r.data),
    staleTime: 30_000,
    retry: false,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) => customerApi.create(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customerStats] });
    },
  });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomerFormData>) => customerApi.update(id, data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.customer(id) });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerApi.delete(id).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customerStats] });
    },
  });
}
