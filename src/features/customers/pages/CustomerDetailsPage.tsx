import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomer';
import { useDeleteCustomer } from '../hooks/useDeleteCustomer';
import { PageHeader } from '../components/PageHeader';
import { CustomerInfo } from '../components/CustomerInfo';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { DetailSkeleton } from '../components/LoadingSpinner';
import { cn } from '@/utils/cn';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError } = useCustomer(id);
  const deleteMutation = useDeleteCustomer();
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    try {
      await deleteMutation.mutateAsync(id);
      navigate('/customers');
    } catch {
      // Error handled by mutation
    }
  }, [id, deleteMutation, navigate]);

  const handleCloseDelete = useCallback(() => {
    setShowDelete(false);
  }, []);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
          <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-surface-900">Failed to load customer</h2>
        <p className="mt-1 text-sm text-surface-500">There was an error loading this customer's details.</p>
        <div className="mt-6 flex items-center gap-3">
          <Link to="/customers" className="btn-secondary">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to Customers
          </Link>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-100 mb-4">
          <svg className="h-8 w-8 text-surface-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-surface-900">Customer not found</h2>
        <p className="mt-1 text-sm text-surface-500">This customer may have been deleted or the link is invalid.</p>
        <Link to="/customers" className="mt-6 btn-primary">
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Back to Customers
        </Link>
      </div>
    );
  }

  const initials = customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-surface-500">
        <Link to="/customers" className="hover:text-surface-700 transition-colors">Customers</Link>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <span className="font-medium text-surface-900">{customer.name}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-50">
            <span className="text-lg font-bold text-brand-600">{initials}</span>
          </div>
          <div>
            <PageHeader title={customer.name} />
            <p className="text-sm text-surface-500">{customer.email} · {customer.companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={`/customers/${id}/edit`}
            className="btn-secondary"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.83 16.17a.75.75 0 00.566.457l2.71.542a.75.75 0 00.742-.327L9.67 14.33l-2-2-3.84 2.84z" />
            </svg>
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="btn-danger"
          >
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CustomerInfo customer={customer} />
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-semibold text-surface-900 mb-4">Account Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                    <svg className="h-3.5 w-3.5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-1 w-px flex-1 bg-surface-200" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-surface-900">Customer Created</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-100">
                    <svg className="h-3.5 w-3.5 text-surface-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">Last Updated</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {new Date(customer.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="card-hover w-full p-5 text-left animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-surface-900">Raw Data</h3>
              <svg
                className={cn('h-4 w-4 text-surface-400 transition-transform', showDetails && 'rotate-180')}
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          {showDetails && (
            <div className="card p-5 animate-slide-in-down">
              <pre className="overflow-x-auto text-xs text-surface-600 whitespace-pre-wrap break-all font-mono">
                {JSON.stringify(customer, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        isOpen={showDelete}
        onClose={handleCloseDelete}
        onConfirm={handleDelete}
        customerName={customer.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
