import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomers } from '../hooks/useCustomers';
import { PageHeader } from '../components/PageHeader';
import { CustomerSearch } from '../components/CustomerSearch';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerTable } from '../components/CustomerTable';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { DEBOUNCE_MS } from '@/constants';
import type { CustomerStatus, CustomerTier } from '../types';

export function CustomerListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | ''>('');
  const [tierFilter, setTierFilter] = useState<CustomerTier | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const handleFilterChange = useCallback(
    (setter: (value: any) => void) =>
      (value: any) => {
        setter(value);
        setPage(1);
      },
    [],
  );

  const toggleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    },
    [sortBy],
  );

  const { data, isLoading, isError } = useCustomers({
    page,
    pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    tier: tierFilter || undefined,
    sortBy,
    sortOrder,
  });

  const customers = data?.data ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load customers. Please try again.</p>
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

  return (
    <div>
      <PageHeader title="Customers">
        <Link
          to="/customers/new"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Add Customer
        </Link>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <CustomerSearch
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
        <CustomerFilters
          status={statusFilter}
          tier={tierFilter}
          onStatusChange={handleFilterChange(setStatusFilter)}
          onTierChange={handleFilterChange(setTierFilter)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={
            debouncedSearch || statusFilter || tierFilter
              ? 'Try adjusting your search or filters.'
              : 'Get started by adding your first customer.'
          }
          action={
            !debouncedSearch && !statusFilter && !tierFilter ? (
              <Link
                to="/customers/new"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                Add Customer
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          <CustomerTable
            customers={customers}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
            onView={(id) => navigate(`/customers/${id}`)}
            onEdit={(id) => navigate(`/customers/${id}/edit`)}
            onDelete={(id) => setShowDeleteId(id)}
          />

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500">
                Page {page} of {totalPages} ({data?.total ?? 0} total)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="btn-secondary btn-sm"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary btn-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
