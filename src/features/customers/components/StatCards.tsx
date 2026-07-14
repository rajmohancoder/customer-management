import type { CustomerStats } from '../types';
import { CUSTOMER_TIERS } from '@/constants';
import { cn } from '@/utils/cn';

interface StatCardsProps {
  stats: CustomerStats;
  isLoading?: boolean;
}

function StatSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card p-6 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="skeleton h-12 w-12 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-4 w-20" />
              <div className="mt-2 skeleton h-7 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const tierLabel: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

const tierColors: Record<string, string> = {
  bronze: 'bg-amber-50 text-amber-600',
  silver: 'bg-surface-100 text-surface-600',
  gold: 'bg-blue-50 text-blue-600',
  platinum: 'bg-emerald-50 text-emerald-600',
};

export function StatCards({ stats, isLoading }: StatCardsProps) {
  if (isLoading) {
    return <StatSkeleton />;
  }

  const cards = [
    {
      label: 'Total Customers',
      value: stats.total,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      color: 'text-brand-600',
      bgColor: 'bg-brand-50',
      change: '+12.5%',
      changeType: 'up',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+8.2%',
      changeType: 'up',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      change: '-3.1%',
      changeType: 'down',
    },
    {
      label: 'Suspended',
      value: stats.suspended,
      icon: (
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '0%',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-6 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', card.bgColor)}>
                <div className={card.color}>{card.icon}</div>
              </div>
              {card.change && (
                <span className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
                  card.changeType === 'up' ? 'bg-emerald-50 text-emerald-700' :
                  card.changeType === 'down' ? 'bg-red-50 text-red-700' :
                  'bg-surface-100 text-surface-600'
                )}>
                  {card.changeType === 'up' && (
                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                    </svg>
                  )}
                  {card.changeType === 'down' && (
                    <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                    </svg>
                  )}
                  {card.change}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-surface-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold tracking-tight text-surface-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-surface-900">Customer Distribution by Tier</h3>
          <span className="text-xs text-surface-500">All time</span>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {CUSTOMER_TIERS.map((tier) => {
            const total = stats.total || 1;
            const count = stats.byTier[tier];
            const percentage = Math.round((count / total) * 100);
            return (
              <div key={tier} className="text-center">
                <div className={cn(
                  'mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold',
                  tierColors[tier]
                )}>
                  {count}
                </div>
                <p className="text-sm font-medium text-surface-900 capitalize">{tierLabel[tier]}</p>
                <div className="mt-2 h-2 w-full rounded-full bg-surface-100">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-500',
                      tier === 'bronze' && 'bg-amber-500',
                      tier === 'silver' && 'bg-surface-400',
                      tier === 'gold' && 'bg-blue-500',
                      tier === 'platinum' && 'bg-emerald-500',
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-surface-400">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
