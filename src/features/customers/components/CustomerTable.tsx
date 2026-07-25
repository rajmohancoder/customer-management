import { useState, useRef, useCallback, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender, type ColumnDef, type PaginationState } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { CustomerWithDetails } from '../types';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import { TableSkeleton } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { cn } from '@/utils/cn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const tierStyles: Record<string, string> = {
  bronze: 'badge-warning',
  silver: 'badge-neutral',
  gold: 'badge-info',
  platinum: 'badge-success',
};

const tierIcons: Record<string, string> = {
  bronze: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  silver: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605',
  gold: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  platinum: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z',
};

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

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

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [paginationLoading, setPaginationLoading] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const schedulePagination = useCallback((newPagination: PaginationState) => {
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    setPaginationLoading(true);
    loadingTimerRef.current = setTimeout(() => {
      setPagination(newPagination);
      setPaginationLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (customers.length === 0) {
    return (
      <EmptyState
        title="No customers found"
        description="Get started by creating a new customer."
      />
    );
  }

  const columns: ColumnDef<CustomerWithDetails>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <DataTableColumnHeader
          title="Name"
          columnId="name"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <button
          onClick={() => onView(row.original.id)}
          className="text-sm font-medium text-surface-900 hover:text-brand-600 transition-colors"
        >
          {row.original.name}
        </button>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: () => (
        <DataTableColumnHeader
          title="Email"
          columnId="email"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <span className="text-surface-500">{row.original.email}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'companyName',
      header: () => (
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-600">Company</span>
      ),
      cell: ({ row }) => (
        <span className="text-surface-500">{row.original.companyName}</span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: () => (
        <DataTableColumnHeader
          title="Status"
          columnId="status"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
      enableSorting: false,
    },
    {
      accessorKey: 'tier',
      header: () => (
        <DataTableColumnHeader
          title="Tier"
          columnId="tier"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <span className={cn('inline-flex items-center gap-1.5', tierStyles[row.original.tier])}>
          <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d={tierIcons[row.original.tier]} />
          </svg>
          {row.original.tier.charAt(0).toUpperCase() + row.original.tier.slice(1)}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'createdAt',
      header: () => (
        <DataTableColumnHeader
          title="Created"
          columnId="createdAt"
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      ),
      cell: ({ row }) => (
        <span className="text-surface-500">{formatDate(row.original.createdAt)}</span>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-0.5">
          <button
            onClick={() => onView(row.original.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-brand-600"
            aria-label={`View ${row.original.name}`}
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(row.original.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-surface-100 hover:text-brand-600"
            aria-label={`Edit ${row.original.name}`}
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${row.original.name}`}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: paginationLoading ? undefined : getPaginationRowModel(),
    enableSorting: false,
    enableColumnResizing: false,
    state: { pagination },
    onPaginationChange: setPagination,
  });

  const { pageIndex, pageSize } = pagination;
  const totalRows = customers.length;
  const pageCount = table.getPageCount();
  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const isFetching = paginationLoading;

  return (
    <div className="space-y-4">
      <div className={cn('overflow-hidden rounded-md border', isFetching && 'relative')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i} className="border-b border-surface-200">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="skeleton h-4 w-full" style={{ maxWidth: `${50 + Math.random() * 40}%` }} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="group">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-surface-500">
          {isFetching ? (
            <>
              Loading{' '}
              <span className="inline-block h-3 w-16 skeleton align-middle" />
            </>
          ) : (
            <>
              Showing{' '}
              <span className="font-medium text-surface-700">{startRow}</span>
              {' '}to{' '}
              <span className="font-medium text-surface-700">{endRow}</span>
              {' '}of{' '}
              <span className="font-medium text-surface-700">{totalRows}</span>{' '}
              customers
            </>
          )}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-surface-500">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                schedulePagination({ pageIndex: 0, pageSize: Number(value) });
              }}
              disabled={isFetching}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => schedulePagination({ pageIndex: pageIndex - 1, pageSize })}
                disabled={!table.getCanPreviousPage() || isFetching}
              />
            </PaginationItem>

            {[1, 2, 3].filter((p) => p <= Math.min(pageCount, 3)).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={!isFetching && pageIndex + 1 === p}
                  onClick={() => schedulePagination({ pageIndex: p - 1, pageSize })}
                  disabled={isFetching}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {pageCount > 3 && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    isActive={!isFetching && pageIndex + 1 === pageCount}
                    onClick={() => schedulePagination({ pageIndex: pageCount - 1, pageSize })}
                    disabled={isFetching}
                  >
                    {pageCount}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => schedulePagination({ pageIndex: pageIndex + 1, pageSize })}
                disabled={!table.getCanNextPage() || isFetching}
              />
            </PaginationItem>
          </PaginationContent>
        </div>
      </div>
    </div>
  );
}
