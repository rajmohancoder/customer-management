import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerFormSchema, type CustomerFormValues } from '../schemas/customerSchema';
import { CUSTOMER_STATUSES, CUSTOMER_TIERS } from '@/constants';
import { cn } from '@/utils/cn';

interface CustomerFormProps {
  defaultValues?: CustomerFormValues;
  onSubmit: (data: CustomerFormValues) => void;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function CustomerForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: defaultValues ?? {
      name: '',
      email: '',
      phone: '',
      website: '',
      gstNumber: '',
      companyName: '',
      status: 'active',
      tier: 'bronze',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    },
  });

  const inputClass =
    'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Name" error={errors.name?.message}>
            <input
              type="text"
              {...register('name')}
              className={cn(inputClass, errors.name && 'border-red-500')}
              placeholder="John Doe"
            />
          </FormField>
        </div>

        <FormField label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register('email')}
            className={cn(inputClass, errors.email && 'border-red-500')}
            placeholder="john@example.com"
          />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message}>
          <input
            type="text"
            {...register('phone')}
            className={cn(inputClass, errors.phone && 'border-red-500')}
            placeholder="+1 (555) 123-4567"
          />
        </FormField>

        <FormField label="Website" error={errors.website?.message}>
          <input
            type="text"
            {...register('website')}
            className={cn(inputClass, errors.website && 'border-red-500')}
            placeholder="https://example.com"
          />
        </FormField>

        <FormField label="GST Number" error={errors.gstNumber?.message}>
          <input
            type="text"
            {...register('gstNumber')}
            className={cn(inputClass, errors.gstNumber && 'border-red-500')}
            placeholder="22AAAAA0000A1Z5"
          />
        </FormField>

        <FormField label="Company Name" error={errors.companyName?.message}>
          <input
            type="text"
            {...register('companyName')}
            className={cn(inputClass, errors.companyName && 'border-red-500')}
            placeholder="Acme Corp"
          />
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <select
            {...register('status')}
            className={cn(inputClass, errors.status && 'border-red-500')}
          >
            {CUSTOMER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Tier" error={errors.tier?.message}>
          <select
            {...register('tier')}
            className={cn(inputClass, errors.tier && 'border-red-500')}
          >
            {CUSTOMER_TIERS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Address</h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField label="Street" error={errors.address?.street?.message}>
              <input
                type="text"
                {...register('address.street')}
                className={cn(inputClass, errors.address?.street && 'border-red-500')}
                placeholder="123 Main St"
              />
            </FormField>
          </div>

          <FormField label="City" error={errors.address?.city?.message}>
            <input
              type="text"
              {...register('address.city')}
              className={cn(inputClass, errors.address?.city && 'border-red-500')}
              placeholder="New York"
            />
          </FormField>

          <FormField label="State" error={errors.address?.state?.message}>
            <input
              type="text"
              {...register('address.state')}
              className={cn(inputClass, errors.address?.state && 'border-red-500')}
              placeholder="NY"
            />
          </FormField>

          <FormField label="Postal Code" error={errors.address?.postalCode?.message}>
            <input
              type="text"
              {...register('address.postalCode')}
              className={cn(inputClass, errors.address?.postalCode && 'border-red-500')}
              placeholder="10001"
            />
          </FormField>

          <FormField label="Country" error={errors.address?.country?.message}>
            <input
              type="text"
              {...register('address.country')}
              className={cn(inputClass, errors.address?.country && 'border-red-500')}
              placeholder="United States"
            />
          </FormField>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Customer'
              : 'Update Customer'}
        </button>
      </div>
    </form>
  );
}
