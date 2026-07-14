import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { customerService } from '../services/customerService';
import { QUERY_KEYS } from '@/constants';
import { PageHeader } from '../components/PageHeader';
import { StatCards } from '../components/StatCards';
import { PageSkeleton } from '../components/LoadingSpinner';
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

function QuickActionCard({ to, icon, title, description }: { to: string; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="card-hover group flex items-start gap-4 p-5 animate-fade-in"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors duration-200">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">{title}</h3>
        <p className="mt-0.5 text-xs text-surface-500">{description}</p>
      </div>
      <svg className="ml-auto h-5 w-5 shrink-0 text-surface-300 group-hover:text-brand-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
      </svg>
    </Link>
  );
}

function StatusOverviewCard({ stats }: { stats: CustomerStats }) {
  const total = stats.total || 1;
  const items = [
    { label: 'Active', count: stats.active, color: 'bg-emerald-500', percentage: Math.round((stats.active / total) * 100) },
    { label: 'Inactive', count: stats.inactive, color: 'bg-amber-400', percentage: Math.round((stats.inactive / total) * 100) },
    { label: 'Suspended', count: stats.suspended, color: 'bg-red-400', percentage: Math.round((stats.suspended / total) * 100) },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-surface-900">Customer Status Overview</h3>
        <Link to="/customers" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>
      <div className="space-y-4">
        <div className="flex h-3 gap-1 overflow-hidden rounded-full bg-surface-100">
          {items.filter(i => i.count > 0).map((item) => (
            <div
              key={item.label}
              className={item.color}
              style={{ width: `${item.percentage}%` }}
              title={`${item.label}: ${item.count}`}
            />
          ))}
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                <span className="text-sm text-surface-600">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-surface-900">{item.count}</span>
                <span className="text-xs text-surface-400 w-8 text-right">{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecentActivityCard({ customers, isLoading }: { customers: CustomerWithDetails[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-5 w-36 mb-5" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="skeleton h-8 w-8 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-4 w-32" />
                <div className="mt-1 skeleton h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-surface-900 mb-5">Recent Customers</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100">
            <svg className="h-6 w-6 text-surface-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-sm text-surface-500">No customers yet.</p>
          <Link to="/customers/new" className="mt-3 btn-primary btn-sm">
            Add your first customer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-surface-900">Recent Customers</h3>
        <Link to="/customers" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          View all
        </Link>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-surface-100">
          {customers.map((customer: CustomerWithDetails) => (
            <li key={customer.id}>
              <Link
                to={`/customers/${customer.id}`}
                className="group flex items-center gap-3 rounded-lg px-3 py-3 -mx-3 transition-colors hover:bg-surface-50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-600">
                  {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-900 truncate group-hover:text-brand-600 transition-colors">
                    {customer.name}
                  </p>
                  <p className="text-xs text-surface-500 truncate">{customer.email}</p>
                </div>
                <div className="hidden sm:block text-xs text-surface-400 shrink-0">
                  {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <svg className="h-4 w-4 shrink-0 text-surface-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChartPlaceholder() {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-semibold text-surface-900">Revenue Overview</h3>
        <span className="text-xs text-surface-500">Last 6 months</span>
      </div>
      <div className="relative h-48 sm:h-64">
        <div className="absolute inset-0 flex items-end gap-2 px-2">
          {[40, 55, 45, 70, 60, 85].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-surface-400 font-medium">{height}k</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-brand-500 to-brand-400 opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
              />
              <span className="text-2xs text-surface-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useCustomerStats();

  const { data: recentData, isLoading: recentLoading } = useRecentCustomers();

  if (statsLoading) {
    return <PageSkeleton />;
  }

  if (statsError || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-surface-900">Failed to load dashboard</h2>
        <p className="mt-1 text-sm text-surface-500">There was an error loading dashboard data.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const recentCustomers = recentData?.data ?? [];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of your customer management metrics and activity."
      />

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ChartPlaceholder />
          <RecentActivityCard customers={recentCustomers} isLoading={recentLoading} />
        </div>
        <div className="space-y-6">
          <StatusOverviewCard stats={stats} />
          <div className="card p-6">
            <h3 className="text-base font-semibold text-surface-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <QuickActionCard
                to="/customers/new"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
                title="Add Customer"
                description="Create a new customer record"
              />
              <QuickActionCard
                to="/customers"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="View Customers"
                description="Browse and manage customers"
              />
              <QuickActionCard
                to="/customers/settings"
                icon={
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                title="Settings"
                description="Configure your preferences"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
