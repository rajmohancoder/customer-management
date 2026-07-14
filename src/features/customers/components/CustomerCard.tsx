import type { CustomerWithDetails } from '../types';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { cn } from '@/utils/cn';

const tierStyles: Record<string, string> = {
  bronze: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20',
  silver: 'bg-surface-100 text-surface-700 ring-1 ring-inset ring-surface-300',
  gold: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20',
  platinum: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20',
};

interface CustomerCardProps {
  customer: CustomerWithDetails;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerCard({ customer, onView, onEdit, onDelete }: CustomerCardProps) {
  return (
    <div className="card-hover group p-5 animate-fade-in">
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-surface-900 truncate">{customer.name}</h3>
          <p className="mt-0.5 text-sm text-surface-500 truncate">{customer.companyName}</p>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          <CustomerStatusBadge status={customer.status} />
          <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', tierStyles[customer.tier])}>
            {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-surface-500">
        <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
        </svg>
        <span className="truncate">{customer.email}</span>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4">
        <div className="flex items-center gap-1.5 text-xs text-surface-400">
          <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z" />
            <path d="M10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5z" />
          </svg>
          {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={onView}
            className="btn-ghost btn-sm text-xs"
          >
            View
          </button>
          <button
            onClick={onEdit}
            className="btn-ghost btn-sm text-xs"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="btn-ghost btn-sm text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
