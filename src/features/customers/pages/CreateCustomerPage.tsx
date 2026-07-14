import { useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateCustomer } from '../hooks/useCreateCustomer';
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
    <div>
      <div className="mb-4">
        <Link to="/customers" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Customers
        </Link>
      </div>

      <PageHeader title="Create Customer" />

      {submitError && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="mt-6">
        <CustomerForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          mode="create"
        />
      </div>
    </div>
  );
}
