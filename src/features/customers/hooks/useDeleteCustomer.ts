import { useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customerService';
import { QUERY_KEYS } from '@/constants';

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customerStats] });
    },
  });
};
