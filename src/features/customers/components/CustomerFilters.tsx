import type { CustomerStatus, CustomerTier } from '../types';
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '@/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CustomerFiltersProps {
  status: CustomerStatus | '';
  tier: CustomerTier | '';
  onStatusChange: (status: CustomerStatus | '') => void;
  onTierChange: (tier: CustomerTier | '') => void;
}

export function CustomerFilters({ status, tier, onStatusChange, onTierChange }: CustomerFiltersProps) {
  const hasFilters = status !== '' || tier !== '';

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={(value) => onStatusChange(value as CustomerStatus | '')}>
        <SelectTrigger className="w-[150px] gap-2" aria-label="Filter by status">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {CUSTOMER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={tier} onValueChange={(value) => onTierChange(value as CustomerTier | '')}>
        <SelectTrigger className="w-[150px] gap-2" aria-label="Filter by tier">
          <SelectValue placeholder="All Tiers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Tiers</SelectItem>
          {CUSTOMER_TIERS.map((t) => (
            <SelectItem key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            onStatusChange('');
            onTierChange('');
          }}
          className="btn-ghost btn-sm text-surface-500"
        >
          Clear
        </button>
      )}
    </div>
  );
}
