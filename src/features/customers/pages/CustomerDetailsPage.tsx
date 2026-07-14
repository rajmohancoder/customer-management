import { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomer';
import { useDeleteCustomer } from '../hooks/useDeleteCustomer';
import { PageHeader } from '../components/PageHeader';
import { CustomerInfo } from '../components/CustomerInfo';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: customer, isLoading, isError } = useCustomer(id);
  const deleteMutation = useDeleteCustomer();
  const [showDelete, setShowDelete] = useState(false);

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
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-600">Failed to load customer details.</p>
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
        <Link to="/customers" className="text-sm text-blue-600 hover:text-blue-800">
          &larr; Back to Customers
        </Link>
      </div>

      <PageHeader title={customer.name}>
        <Link
          to={`/customers/${id}/edit`}
          className="btn-secondary"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="btn-danger"
        >
          Delete
        </button>
      </PageHeader>

      <div className="mt-6">
        <CustomerInfo customer={customer} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Created</h3>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(customer.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
          <p className="mt-1 text-sm text-gray-900">
            {new Date(customer.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
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
