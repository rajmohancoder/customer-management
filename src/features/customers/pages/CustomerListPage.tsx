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
import { cn } from '@/utils/cn';
import type { CustomerStatus, CustomerTier } from '..';


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
            setPage(1);
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
              setPage(1);
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

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-200 pt-4">
              <p className="text-sm text-surface-500">
                Showing <span className="font-medium text-surface-700">{((page - 1) * pageSize) + 1}</span> to{' '}
                <span className="font-medium text-surface-700">{Math.min(page * pageSize, total)}</span> of{' '}
                <span className="font-medium text-surface-700">{total}</span> customers
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={cn(
                    'btn-secondary btn-sm',
                    page <= 1 && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                  Previous
                </button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (page <= 4) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = page - 3 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          'btn-icon-sm rounded-lg text-sm font-medium transition-colors',
                          page === pageNum
                            ? 'bg-brand-600 text-white'
                            : 'text-surface-600 hover:bg-surface-100'
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className={cn(
                    'btn-secondary btn-sm',
                    page >= totalPages && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  Next
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
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
