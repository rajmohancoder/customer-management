import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CustomerSearch } from '../components/CustomerSearch';
import { CustomerFilters } from '../components/CustomerFilters';
import { CustomerTable } from '../components/CustomerTable';
import { EmptyState } from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSpinner';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { useCustomers, useDeleteCustomer } from '..';
import { DEBOUNCE_MS } from '@/constants';
import type { CustomerStatus, CustomerTier } from '..';


export function CustomerListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | ''>('');
  const [tierFilter, setTierFilter] = useState<CustomerTier | ''>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');
  const deleteMutation = useDeleteCustomer();

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
    page: 1,
    pageSize: 100,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    tier: tierFilter || undefined,
    sortBy,
    sortOrder,
  });

  const customers = data?.data ?? [];
  const total = data?.total ?? 0;

  const handleDelete = useCallback((id: string) => {
    const customer = customers.find(c => c.id === id);
    if (customer) {
      setDeleteId(id);
      setDeleteName(customer.name);
    }
  }, [customers]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-surface-900">Failed to load customers</h2>
        <p className="mt-1 text-sm text-surface-500">There was an error loading customer data.</p>
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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Customers"
        description={total > 0 ? `${total} total customers` : 'Manage your customer relationships'}
      >
        <Link
          to="/customers/new"
          className="btn-primary"
        >
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          Add Customer
        </Link>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-4">
        <CustomerSearch
          value={search}
          onChange={(val) => {
            setSearch(val);
          }}
        />
        <CustomerFilters
          status={statusFilter}
          tier={tierFilter}
          onStatusChange={handleFilterChange(setStatusFilter)}
          onTierChange={handleFilterChange(setTierFilter)}
        />
        {(search || statusFilter || tierFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDebouncedSearch('');
              setStatusFilter('');
              setTierFilter('');
            }}
            className="btn-ghost btn-sm text-surface-500"
          >
            Clear all filters
          </button>
        )}
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers found"
          description={
            debouncedSearch || statusFilter || tierFilter
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Get started by creating your first customer record.'
          }
          action={
            !debouncedSearch && !statusFilter && !tierFilter ? (
              <Link to="/customers/new" className="btn-primary">
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
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
            onDelete={handleDelete}
          />
        </>
      )}

      {deleteId && (
        <ConfirmDeleteDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={async () => {
            if (!deleteId) return;
            try {
              await deleteMutation.mutateAsync(deleteId);
              setDeleteId(null);
            } catch {
              // Error handled by mutation
            }
          }}
          customerName={deleteName}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
