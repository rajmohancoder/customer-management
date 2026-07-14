import type { CustomerWithDetails } from '../types';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { cn } from '@/utils/cn';

const tierStyles: Record<string, string> = {
  bronze: 'bg-amber-100 text-amber-800',
  silver: 'bg-gray-100 text-gray-800',
  gold: 'bg-yellow-100 text-yellow-800',
  platinum: 'bg-purple-100 text-purple-800',
};

interface CustomerCardProps {
  customer: CustomerWithDetails;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerCard({ customer, onView, onEdit, onDelete }: CustomerCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">{customer.companyName}</p>
        </div>
        <div className="flex items-center gap-2">
          <CustomerStatusBadge status={customer.status} />
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              tierStyles[customer.tier]
            )}
          >
            {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
          </span>
        </div>
      </div>
      <p className="mb-4 text-sm text-gray-600">{customer.email}</p>
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={onView}
          className="rounded px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="rounded px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
