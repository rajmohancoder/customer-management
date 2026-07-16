import { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateCustomer } from '../api/real-client/hooks';
import { PageHeader } from '../components/PageHeader';
import { CustomerForm } from '../components/CustomerForm';
import type { CustomerFormValues } from '../schemas/customerSchema';

export function CreateCustomerPage() {
  const navigate = useNavigate();
  const createMutation = useCreateCustomer();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: CustomerFormValues) => {
      setSubmitError(null);
      try {
        const result = await createMutation.mutateAsync(data);
        navigate(`/customers/${result.id}`);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Failed to create customer',
        );
      }
    },
    [createMutation, navigate],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-surface-500">
        <Link to="/customers" className="hover:text-surface-700 transition-colors">Customers</Link>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <span className="font-medium text-surface-900">New Customer</span>
      </nav>

      <PageHeader
        title="Create Customer"
        description="Add a new customer to your CRM."
      />

      {submitError && (
        <div className="animate-slide-in-down rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 shrink-0 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-red-800">{submitError}</p>
          </div>
        </div>
      )}

      <CustomerForm
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
        mode="create"
      />
    </div>
  );
}
