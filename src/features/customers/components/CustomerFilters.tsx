import type { CustomerStatus, CustomerTier } from '../types';
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '@/constants';

interface CustomerFiltersProps {
  status: CustomerStatus | '';
  tier: CustomerTier | '';
  onStatusChange: (status: CustomerStatus | '') => void;
  onTierChange: (tier: CustomerTier | '') => void;
}

export function CustomerFilters({ status, tier, onStatusChange, onTierChange }: CustomerFiltersProps) {
  const hasFilters = status !== '' || tier !== '';

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as CustomerStatus | '')}
          className="select min-w-[140px]"
        >
          <option value="">All Statuses</option>
          {CUSTOMER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="relative">
        <label htmlFor="tier-filter" className="sr-only">Filter by tier</label>
        <select
          id="tier-filter"
          value={tier}
          onChange={(e) => onTierChange(e.target.value as CustomerTier | '')}
          className="select min-w-[140px]"
        >
          <option value="">All Tiers</option>
          {CUSTOMER_TIERS.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
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
