import type { CustomerWithDetails } from '../types';
import { CustomerStatusBadge } from './CustomerStatusBadge';

interface CustomerInfoProps {
  customer: CustomerWithDetails;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Contact Information</h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.phone}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Website</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customer.website ? (
                <a
                  href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {customer.website}
                </a>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">GST Number</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customer.gstNumber || <span className="text-gray-400">—</span>}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Company</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.companyName}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <CustomerStatusBadge status={customer.status} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Tier</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {customer.tier.charAt(0).toUpperCase() + customer.tier.slice(1)}
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Address</h3>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Street</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.address.street}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">City</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.address.city}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">State</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.address.state}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.address.postalCode}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Country</dt>
            <dd className="mt-1 text-sm text-gray-900">{customer.address.country}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
