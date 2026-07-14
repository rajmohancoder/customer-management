import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { QUERY_KEYS } from '@/constants';
import type { CustomerFormData } from '../types';

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CustomerFormData) => customerService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customerStats] });
    },
  });
};
