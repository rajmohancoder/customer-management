import { useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomer';
import { useUpdateCustomer } from '../hooks/useUpdateCustomer';
import { PageHeader } from '../components/PageHeader';
import { CustomerForm } from '../components/CustomerForm';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { CustomerFormValues } from '../schemas/customerSchema';
import type { CustomerWithDetails } from '../types';

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
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load customer data.</p>
        <Link
          to="/customers"
          className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Customers
        </Link>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Customer not found.</p>
        <Link
          to="/customers"
          className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <Link to={`/customers/${id}`} className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Customer
        </Link>
      </div>

      <PageHeader title="Edit Customer" />

      {submitError && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="mt-6">
        <CustomerForm
          defaultValues={mapCustomerToFormValues(customer)}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          mode="edit"
        />
      </div>
    </div>
  );
}
