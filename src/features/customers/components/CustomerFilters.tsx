import type { CustomerStatus, CustomerTier } from '../types';
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '@/constants';

interface CustomerFiltersProps {
  status: CustomerStatus | '';
  tier: CustomerTier | '';
  onStatusChange: (status: CustomerStatus | '') => void;
  onTierChange: (tier: CustomerTier | '') => void;
}

export function CustomerFilters({ status, tier, onStatusChange, onTierChange }: CustomerFiltersProps) {
  return (
    <div className="flex gap-4">
      <div>
        <label htmlFor="status-filter" className="sr-only">
          Filter by status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as CustomerStatus | '')}
          className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {CUSTOMER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tier-filter" className="sr-only">
          Filter by tier
        </label>
        <select
          id="tier-filter"
          value={tier}
          onChange={(e) => onTierChange(e.target.value as CustomerTier | '')}
          className="block rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Tiers</option>
          {CUSTOMER_TIERS.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
