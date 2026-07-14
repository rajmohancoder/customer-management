import type { CustomerWithDetails } from '../types';
import { CustomerStatusBadge } from './CustomerStatusBadge';
import { cn } from '@/utils/cn';

const tierColors: Record<string, string> = {
  bronze: 'badge-warning',
  silver: 'badge-neutral',
  gold: 'badge-info',
  platinum: 'badge-success',
};

interface CustomerInfoProps {
  customer: CustomerWithDetails;
}

function InfoRow({ label, value, span = false }: { label: string; value: React.ReactNode; span?: boolean }) {
  return (
    <div className={cn(span && 'sm:col-span-2')}>
      <dt className="text-xs font-medium uppercase tracking-wider text-surface-500">{label}</dt>
      <dd className="mt-1.5 text-sm text-surface-900">{value}</dd>
    </div>
  );
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50">
            <span className="text-sm font-bold text-brand-600">
              {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-base font-semibold text-surface-900">Contact Information</h3>
            <p className="text-xs text-surface-500">Personal and account details</p>
          </div>
        </div>
        <div className="rounded-xl border border-surface-200 bg-surface-50/50 p-6">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow label="Full Name" value={customer.name} />
            <InfoRow label="Email" value={customer.email} />
            <InfoRow label="Phone" value={customer.phone || <span className="text-surface-400">&mdash;</span>} />
            <InfoRow
              label="Website"
              value={
                customer.website ? (
                  <a
                    href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    {customer.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="text-surface-400">&mdash;</span>
                )
              }
            />
            <InfoRow label="GST Number" value={customer.gstNumber || <span className="text-surface-400">&mdash;</span>} />
            <InfoRow label="Company" value={customer.companyName} />
            <InfoRow label="Status" value={<CustomerStatusBadge status={customer.status} />} />
            <InfoRow
              label="Tier"
              value={
                <span className={cn('inline-flex items-center gap-1.5', tierColors[customer.tier])}>
                  <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                  {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
                </span>
              }
            />
          </dl>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100">
            <svg className="h-5 w-5 text-surface-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-surface-900">Address</h3>
            <p className="text-xs text-surface-500">Location details</p>
          </div>
        </div>
        <div className="rounded-xl border border-surface-200 bg-surface-50/50 p-6">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow label="Street" value={customer.address.street} span />
            <InfoRow label="City" value={customer.address.city} />
            <InfoRow label="State" value={customer.address.state} />
            <InfoRow label="Postal Code" value={customer.address.postalCode} />
            <InfoRow label="Country" value={customer.address.country} />
          </dl>
        </div>
      </section>
    </div>
  );
}
