import type { PaginatedResult } from '@rajmohancoder/types';
import type {
  CustomerWithDetails,
  CustomerFormData,
  CustomerFilters,
  CustomerStats,
  CustomerListParams,
} from '../types';

const API_BASE = 'https://jsonplaceholder.typicode.com';

interface JsonPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

let cachedUsers: CustomerWithDetails[] | null = null;

async function fetchAllUsers(): Promise<CustomerWithDetails[]> {
  if (cachedUsers) return cachedUsers;

  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.statusText}`);
  const users: JsonPlaceholderUser[] = await res.json();

  cachedUsers = users.map((u) => ({
    id: `CUST-${String(u.id).padStart(4, '0')}`,
    name: u.name,
    email: u.email,
    phone: u.phone,
    website: u.website || '',
    gstNumber: '',
    companyName: u.company?.name || '',
    status: 'active' as const,
    tier: 'bronze' as const,
    address: {
      street: u.address?.street || '',
      city: u.address?.city || '',
      state: '',
      postalCode: u.address?.zipcode || '',
      country: '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return cachedUsers;
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
    case 'name': return item.name;
    case 'email': return item.email;
    case 'status': return item.status;
    case 'tier': return item.tier;
    case 'companyName': return item.companyName;
    case 'createdAt': return item.createdAt;
    case 'updatedAt': return item.updatedAt;
    default: return '';
  }
}

function sortCustomers(
  items: CustomerWithDetails[],
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
): CustomerWithDetails[] {
  if (!sortBy) return items;
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
  const { page, pageSize, sortBy, sortOrder, search, status, tier } = params;

  const filters: CustomerFilters = { search, status, tier, sortBy, sortOrder };

  let all = await fetchAllUsers();
  let filtered = all.filter((item) => matchesFilters(item, filters));
  filtered = sortCustomers(filtered, sortBy, sortOrder);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return { data: items, total, page: safePage, pageSize, totalPages };
}

export async function fetchCustomer(id: string): Promise<CustomerWithDetails> {
  const all = await fetchAllUsers();
  const customer = all.find((c) => c.id === id);
  if (!customer) throw new Error(`Customer with id "${id}" not found`);
  return customer;
}

export async function createCustomer(data: CustomerFormData): Promise<CustomerWithDetails> {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      website: data.website,
      company: { name: data.companyName },
      address: {
        street: data.address.street,
        city: data.address.city,
        zipcode: data.address.postalCode,
      },
    }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to create customer');

  return {
    id: `CUST-${Date.now().toString(36).toUpperCase()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    website: data.website ?? '',
    gstNumber: data.gstNumber ?? '',
    companyName: data.companyName,
    status: data.status,
    tier: data.tier,
    address: data.address,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function updateCustomer(
  id: string,
  data: Partial<CustomerFormData>,
): Promise<CustomerWithDetails> {
  const all = await fetchAllUsers();
  const existing = all.find((c) => c.id === id);
  if (!existing) throw new Error(`Customer with id "${id}" not found`);

  await fetch(`${API_BASE}/users/${id.replace('CUST-', '')}`, {
    method: 'PATCH',
    body: JSON.stringify({ name: data.name }),
    headers: { 'Content-Type': 'application/json' },
  });

  return { ...existing, ...data, updatedAt: new Date().toISOString() };
}

export async function deleteCustomer(id: string): Promise<void> {
  const all = await fetchAllUsers();
  const index = all.findIndex((c) => c.id === id);
  if (index === -1) throw new Error(`Customer with id "${id}" not found`);

  await fetch(`${API_BASE}/users/${id.replace('CUST-', '')}`, { method: 'DELETE' });
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
  const all = await fetchAllUsers();
  const total = all.length;
  const active = total;
  const inactive = 0;
  const suspended = 0;
  const byTier: Record<string, number> = { bronze: total, silver: 0, gold: 0, platinum: 0 };

  return { total, active, inactive, suspended, byTier: byTier as CustomerStats['byTier'] };
}
