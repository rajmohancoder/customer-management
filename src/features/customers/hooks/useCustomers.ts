import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import type { CustomerListParams, CustomerWithDetails } from '../types';
import type { PaginatedResult } from '@rajmohancoder/types';
import { customerApi } from '../api/real-client/api';


export const useCustomers = (params: CustomerListParams) => {
  return useQuery<PaginatedResult<CustomerWithDetails>>({
    queryKey: [QUERY_KEYS.customers, params],
    queryFn: () => customerApi.list(params).then((r) => r.data),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
};
