import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants';
import type { CustomerWithDetails } from '../types';
import { customerApi } from '../api/real-client/api';

export const useCustomer = (id: string | undefined) => {
  return useQuery<CustomerWithDetails>({
    queryKey: QUERY_KEYS.customer(id!),
    queryFn: () => customerApi.get(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 60_000,
    retry: false,
  });
};
