import { useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomer, useUpdateCustomer } from '..';
import { PageHeader } from '../components/PageHeader';
import { CustomerForm } from '../components/CustomerForm';
import { DetailSkeleton } from '../components/LoadingSpinner';
import type { CustomerFormValues } from '../schemas/customerSchema';
import type { CustomerWithDetails } from '..';

function mapCustomerToFormValues(customer: CustomerWithDetails): CustomerFormValues {
  return {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    website: customer.website || '',
    gstNumber: customer.gstNumber || '',
    status: customer.status,
    tier: customer.tier,
    companyName: customer.companyName,
    address: {
      street: customer.address.street,
      city: customer.address.city,
      state: customer.address.state,
      postalCode: customer.address.postalCode,
      country: customer.address.country,
    },
  };
}

export function EditCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError } = useCustomer(id);
  const updateMutation = useUpdateCustomer(id!);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: CustomerFormValues) => {
      if (!id) return;
      setSubmitError(null);
      try {
        await updateMutation.mutateAsync(data);
        navigate(`/customers/${id}`);
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : 'Failed to update customer',
        );
      }
    },
    [id, updateMutation, navigate],
  );

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
        <p className="mt-1 text-sm text-surface-500">Unable to load customer data for editing.</p>
        <Link to="/customers" className="mt-6 btn-secondary">
          Back to Customers
        </Link>
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
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-surface-500">
        <Link to="/customers" className="hover:text-surface-700 transition-colors">Customers</Link>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <Link to={`/customers/${id}`} className="hover:text-surface-700 transition-colors">{customer.name}</Link>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
        <span className="font-medium text-surface-900">Edit</span>
      </nav>

      <PageHeader
        title="Edit Customer"
        description={`Update details for ${customer.name}.`}
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
        defaultValues={mapCustomerToFormValues(customer)}
        onSubmit={handleSubmit}
        isSubmitting={updateMutation.isPending}
        mode="edit"
      />
    </div>
  );
}
