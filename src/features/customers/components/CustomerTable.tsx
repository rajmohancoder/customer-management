import type { CustomerWithDetails } from '../types';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { cn } from '@/utils/cn';

const tierStyles: Record<string, string> = {
  bronze: 'bg-amber-100 text-amber-800',
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-purple-100 text-purple-800',
};

const sortableFields = ['name', 'email', 'status', 'tier', 'createdAt'] as const;

interface CustomerTableProps {
  customers: CustomerWithDetails[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export function CustomerTable({
  customers,
  onView,
  onEdit,
  onDelete,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
}: CustomerTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Get started by creating a new customer."
      />
    );
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return (
        <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="ml-1 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.55-.24l-3.25-3.5a.75.75 0 111.1-1.02l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5A.75.75 0 0110 17zm-3.76-9.2a.75.75 0 01-.04-1.06l3.25-3.5a.75.75 0 011.1 0l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.06.04z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="ml-1 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {sortableFields.map((field) => (
              <th
                key={field}
                scope="col"
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500',
                  onSort && 'cursor-pointer select-none'
                )}
                onClick={() => onSort?.(field)}
                aria-label={`Sort by ${field}${sortBy === field ? `, current sort order: ${sortOrder}` : ''}`}
                role={onSort ? 'button' : undefined}
                tabIndex={onSort ? 0 : undefined}
                onKeyDown={(e) => {
                  if (onSort && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSort(field);
                  }
                }}
              >
                <span className="inline-flex items-center">
                  {field === 'createdAt' ? 'Created' : field.charAt(0).toUpperCase() + field.slice(1)}
                  {onSort && renderSortIcon(field)}
                </span>
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Company
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {customers.map((customer) => (
            <tr key={customer.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {customer.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {customer.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {customer.companyName}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <CustomerStatusBadge status={customer.status} />
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    tierStyles[customer.tier]
                  )}
                >
                  {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {formatDate(customer.createdAt)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(customer.id)}
                    className="rounded p-1 text-gray-400 hover:text-blue-600"
                    aria-label={`View ${customer.name}`}
                    title="View"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(customer.id)}
                    className="rounded p-1 text-gray-400 hover:text-indigo-600"
                    aria-label={`Edit ${customer.name}`}
                    title="Edit"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                      <path d="M3.83 16.17a.75.75 0 00.566.457l2.71.542a.75.75 0 00.742-.327L9.67 14.33l-2-2-3.84 2.84z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="rounded p-1 text-gray-400 hover:text-red-600"
                    aria-label={`Delete ${customer.name}`}
                    title="Delete"
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
