import type { PaginatedResult } from '@rajmohancoder/types';
import type {
  CustomerWithDetails,
  CustomerFormData,
  CustomerStats,
  CustomerListParams,
} from '../types';
import {
  fetchCustomers,
  fetchCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchCustomerStats,
} from '../api/client';

export interface ApiClient {
  fetchCustomers: typeof fetchCustomers;
  fetchCustomer: typeof fetchCustomer;
  createCustomer: typeof createCustomer;
  updateCustomer: typeof updateCustomer;
  deleteCustomer: typeof deleteCustomer;
  fetchCustomerStats: typeof fetchCustomerStats;
}

const defaultClient: ApiClient = {
  fetchCustomers,
  fetchCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  fetchCustomerStats,
};

export class CustomerService {
  private client: ApiClient;

  constructor(client: ApiClient = defaultClient) {
    this.client = client;
  }

  async list(params: CustomerListParams): Promise<PaginatedResult<CustomerWithDetails>> {
    return this.client.fetchCustomers(params);
  }

  async getById(id: string): Promise<CustomerWithDetails> {
    return this.client.fetchCustomer(id);
  }

  async create(data: CustomerFormData): Promise<CustomerWithDetails> {
    return this.client.createCustomer(data);
  }

  async update(id: string, data: Partial<CustomerFormData>): Promise<CustomerWithDetails> {
    return this.client.updateCustomer(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.client.deleteCustomer(id);
  }

  async getStats(): Promise<CustomerStats> {
    return this.client.fetchCustomerStats();
  }
}

export function createCustomerService(apiClient?: ApiClient): CustomerService {
  return new CustomerService(apiClient);
}

export const customerService = createCustomerService();
