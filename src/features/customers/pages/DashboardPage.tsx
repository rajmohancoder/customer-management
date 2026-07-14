import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { QUERY_KEYS } from '@/constants';
import { PageHeader } from '../components/PageHeader';
import { StatCards } from '../components/StatCards';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { CustomerStats, CustomerWithDetails } from '../types';

function useCustomerStats() {
  return useQuery<CustomerStats>({
    queryKey: [QUERY_KEYS.customerStats],
    queryFn: () => customerService.getStats(),
    staleTime: 30_000,
  });
}

function useRecentCustomers() {
  return useQuery({
    queryKey: [QUERY_KEYS.customers, 'recent'],
    queryFn: () =>
      customerService.list({
        page: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    staleTime: 30_000,
  });
}

export function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useCustomerStats();

  const { data: recentData, isLoading: recentLoading } = useRecentCustomers();

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load dashboard data.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const recentCustomers = recentData?.data ?? [];

  return (
    <div>
      <PageHeader title="Customer Dashboard" />

      <div className="mt-6">
        <StatCards stats={stats} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Customers
            </h2>
          </div>
          <div className="card-body">
            {recentLoading ? (
              <LoadingSpinner />
            ) : recentCustomers.length === 0 ? (
              <p className="text-sm text-gray-500">No customers yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentCustomers.map((customer: CustomerWithDetails) => (
                  <li key={customer.id}>
                    <Link
                      to={`/customers/${customer.id}`}
                      className="flex items-center justify-between py-3 transition-colors hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.companyName}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="card-body space-y-4">
            <Link
              to="/customers/new"
              className="btn-primary inline-flex"
            >
              Add Customer
            </Link>
            <Link
              to="/customers/settings"
              className="btn-secondary inline-flex"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
