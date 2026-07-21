export type {
  Customer,
  CustomerStatus,
  CustomerTier,
  CustomerFormData,
  CustomerFilters,
  CustomerStats,
  CustomerWithDetails,
  CustomerListParams,
} from './types';

export {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useCustomerStats,
} from './api/hooks';
