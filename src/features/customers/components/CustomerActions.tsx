import { cn } from '@/utils/cn';

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
};

interface CustomerActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  size?: 'sm' | 'md';
}

export function CustomerActions({ onView, onEdit, onDelete, size = 'md' }: CustomerActionsProps) {
  const iconClass = cn(sizeMap[size]);

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={onView}
        className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-brand-600"
        aria-label="View customer"
        title="View"
      >
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
          <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        onClick={onEdit}
        className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-brand-600"
        aria-label="Edit customer"
        title="Edit"
      >
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
          <path d="M3.83 16.17a.75.75 0 00.566.457l2.71.542a.75.75 0 00.742-.327L9.67 14.33l-2-2-3.84 2.84z" />
        </svg>
      </button>
      <button
        onClick={onDelete}
        className="rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
        aria-label="Delete customer"
        title="Delete"
      >
        <svg className={iconClass} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
