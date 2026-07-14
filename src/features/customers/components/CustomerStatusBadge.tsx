import type { CustomerStatus } from '../types';
import { cn } from '@/utils/cn';

const statusStyles: Record<CustomerStatus, string> = {
  active: 'badge-success',
  inactive: 'badge-neutral',
  suspended: 'badge-danger',
};

const statusIcons: Record<CustomerStatus, string> = {
  active: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  inactive: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  suspended: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
};

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', statusStyles[status])}>
      <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={statusIcons[status]} />
      </svg>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
