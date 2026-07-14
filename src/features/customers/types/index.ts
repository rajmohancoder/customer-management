import type {
  Customer,
  CustomerStatus,
  CustomerTier,
  Address,
} from '@rajmohancoder/types';

export type { Customer, CustomerStatus, CustomerTier, Address };

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  website?: string;
  gstNumber?: string;
  status: CustomerStatus;
  tier: CustomerTier;
  companyName: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus | '';
  tier?: CustomerTier | '';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byTier: Record<CustomerTier, number>;
}

export interface CustomerWithDetails extends Customer {
  phone: string;
  website: string;
  gstNumber: string;
  companyName: string;
  updatedAt: string;
  notes?: string;
}

export interface CustomerListParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: CustomerStatus | '';
  tier?: CustomerTier | '';
}
