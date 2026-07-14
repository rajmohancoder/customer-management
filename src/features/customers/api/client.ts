import type { PaginatedResult, PageParams } from '@rajmohancoder/types';
import type {
  CustomerWithDetails,
  CustomerFormData,
  CustomerFilters,
  CustomerStats,
  CustomerListParams,
} from '../types';
import { mockCustomers, simulateDelay, simulateError } from './mock';

const ALLOWED_SORT_FIELDS = new Set([
  'name',
  'email',
  'status',
  'tier',
  'companyName',
  'createdAt',
  'updatedAt',
]);

function generateId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `CUST-${ts}-${rand}`;
}

function getNowISO(): string {
  return new Date().toISOString();
}

function matchesSearch(item: CustomerWithDetails, search: string): boolean {
  const q = search.toLowerCase();
  return (
    item.name.toLowerCase().includes(q) ||
    item.email.toLowerCase().includes(q) ||
    item.companyName.toLowerCase().includes(q)
  );
}

function matchesFilters(item: CustomerWithDetails, filters: CustomerFilters): boolean {
  if (filters.search && !matchesSearch(item, filters.search)) return false;
  if (filters.status && item.status !== filters.status) return false;
  if (filters.tier && item.tier !== filters.tier) return false;
  return true;
}

function getSortValue(item: CustomerWithDetails, field: string): string {
  switch (field) {
    case 'name':
      return item.name;
    case 'email':
      return item.email;
    case 'status':
      return item.status;
    case 'tier':
      return item.tier;
    case 'companyName':
      return item.companyName;
    case 'createdAt':
      return item.createdAt;
    case 'updatedAt':
      return item.updatedAt;
    default:
      return '';
  }
}

function sortCustomers(
  items: CustomerWithDetails[],
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): CustomerWithDetails[] {
  if (!sortBy || !ALLOWED_SORT_FIELDS.has(sortBy)) {
    return items;
  }

  const dir = sortOrder === 'desc' ? -1 : 1;

  return [...items].sort((a, b) => {
    const aVal = getSortValue(a, sortBy);
    const bVal = getSortValue(b, sortBy);
    return aVal.localeCompare(bVal) * dir;
  });
}

export async function fetchCustomers(
  params: CustomerListParams,
): Promise<PaginatedResult<CustomerWithDetails>> {
  await simulateDelay();
  simulateError();

  const { page, pageSize, sortBy, sortOrder, search, status, tier } = params;

  const filters: CustomerFilters = { search, status, tier, sortBy, sortOrder };

  let filtered = mockCustomers.filter((item) => matchesFilters(item, filters));

  filtered = sortCustomers(filtered, sortBy, sortOrder);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    data: items,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function fetchCustomer(id: string): Promise<CustomerWithDetails> {
  await simulateDelay();
  simulateError();

  const customer = mockCustomers.find((c) => c.id === id);
  if (!customer) {
    throw new Error(`Customer with id "${id}" not found`);
  }
  return customer;
}

export async function createCustomer(
  data: CustomerFormData,
): Promise<CustomerWithDetails> {
  await simulateDelay();
  simulateError();

  const now = getNowISO();
  const customer: CustomerWithDetails = {
    id: generateId(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    website: data.website ?? '',
    gstNumber: data.gstNumber ?? '',
    companyName: data.companyName,
    address: data.address,
    status: data.status,
    tier: data.tier,
    createdAt: now,
    updatedAt: now,
  };

  mockCustomers.unshift(customer);
  return customer;
}

export async function updateCustomer(
  id: string,
  data: Partial<CustomerFormData>,
): Promise<CustomerWithDetails> {
  await simulateDelay();
  simulateError();

  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Customer with id "${id}" not found`);
  }

  const existing = mockCustomers[index];
  const updated: CustomerWithDetails = {
    ...existing,
    ...data,
    address: data.address ?? existing.address as CustomerWithDetails['address'],
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: getNowISO(),
  };

  mockCustomers[index] = updated;
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await simulateDelay();
  simulateError();

  const index = mockCustomers.findIndex((c) => c.id === id);
  if (index === -1) {
    throw new Error(`Customer with id "${id}" not found`);
  }
  mockCustomers.splice(index, 1);
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
  await simulateDelay();
  simulateError();

  const total = mockCustomers.length;
  let active = 0;
  let inactive = 0;
  let suspended = 0;
  const byTier: Record<string, number> = { bronze: 0, silver: 0, gold: 0, platinum: 0 };

  for (const c of mockCustomers) {
    if (c.status === 'active') active++;
    else if (c.status === 'inactive') inactive++;
    else if (c.status === 'suspended') suspended++;

    if (c.tier in byTier) {
      byTier[c.tier]++;
    }
  }

  return {
    total,
    active,
    inactive,
    suspended,
    byTier: byTier as CustomerStats['byTier'],
  };
}
