import { cn } from '@/utils/cn';

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-brand-600', sizeMap[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="skeleton-title" />
          <div className="mt-2 skeleton h-4 w-2/3" />
        </div>
        <div className="skeleton h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="skeleton h-4 w-24" />
            <div className="mt-3 skeleton h-8 w-16" />
          </div>
        ))}
      </div>
      <div className="card p-6">
        <div className="skeleton h-6 w-48" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="min-w-full divide-y divide-surface-200">
          <thead className="bg-surface-50">
            <tr>
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-6 py-3.5">
                  <div className="skeleton h-3 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="skeleton h-4 w-full" style={{ maxWidth: `${60 + Math.random() * 40}%` }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="card p-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={i < 2 ? 'sm:col-span-2' : ''}>
            <div className="skeleton h-4 w-20 mb-2" />
            <div className="skeleton h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center gap-4">
        <div className="skeleton h-10 w-10 rounded-full" />
        <div>
          <div className="skeleton h-6 w-48" />
          <div className="mt-1 skeleton h-4 w-32" />
        </div>
      </div>
      <div className="card p-6">
        <div className="skeleton h-5 w-36 mb-4" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
      <div className="card p-6">
        <div className="skeleton h-5 w-24 mb-4" />
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
