import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { QUERY_KEYS } from '@/constants';
import type { CustomerListParams, CustomerWithDetails } from '../types';
import type { PaginatedResult } from '@rajmohancoder/types';

export const useCustomers = (params: CustomerListParams) => {
  return useQuery<PaginatedResult<CustomerWithDetails>>({
    queryKey: [QUERY_KEYS.customers, params],
    queryFn: () => customerService.list(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
