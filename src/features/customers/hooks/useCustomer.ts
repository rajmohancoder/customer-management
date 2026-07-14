import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { QUERY_KEYS } from '@/constants';
import type { CustomerWithDetails } from '../types';

export const useCustomer = (id: string | undefined) => {
  return useQuery<CustomerWithDetails>({
    queryKey: QUERY_KEYS.customer(id!),
    queryFn: () => customerService.getById(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
};
