export const APP_NAME = 'Customer Management';
export const APP_SOURCE = 'customer-app' as const;

export const CUSTOMER_STATUSES = ['active', 'inactive', 'suspended'] as const;

export const CUSTOMER_TIERS = ['bronze', 'silver', 'gold', 'platinum'] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const DEFAULT_PAGE_SIZE = 20;

export const API_ENDPOINTS = {
  customers: '/api/customers',
  customerById: (id: string) => `/api/customers/${id}`,
} as const;

export const QUERY_KEYS = {
  customers: 'customers',
  customer: (id: string) => ['customer', id],
  customerStats: 'customer-stats',
} as const;

export const DEBOUNCE_MS = 300;
