import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DataTableColumnHeaderProps {
  title: string;
  columnId: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  className?: string;
}

export function DataTableColumnHeader({
  title,
  columnId,
  sortBy,
  sortOrder,
  onSort,
  className,
}: DataTableColumnHeaderProps) {
  const isSorted = sortBy === columnId;

  return (
    <div className={cn('flex items-center', className)}>
      <button
        type="button"
        onClick={() => onSort?.(columnId)}
        className="-ml-3 inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-semibold uppercase tracking-wider text-surface-600 transition-colors hover:bg-surface-100 hover:text-surface-900"
        aria-label={`Sort by ${title}${isSorted ? `, current sort order: ${sortOrder}` : ''}`}
      >
        <span>{title}</span>
        {isSorted && sortOrder === 'desc' ? (
          <ArrowDown className="h-3.5 w-3.5 text-brand-600 shrink-0" />
        ) : isSorted && sortOrder === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5 text-brand-600 shrink-0" />
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 text-surface-400 shrink-0" />
        )}
      </button>
    </div>
  );
}
