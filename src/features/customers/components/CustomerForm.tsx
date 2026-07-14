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

function FormSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-base font-semibold text-surface-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-surface-500">{description}</p>}
      </div>
      <div className="rounded-xl border border-surface-200 bg-surface-50/50 p-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          {children}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-surface-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
          <svg className="h-3.5 w-3.5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in">
      <FormSection
        title="Basic Information"
        description="Personal and contact details for this customer."
      >
        <div className="sm:col-span-2">
          <FormField label="Full Name" error={errors.name?.message} required>
            <input
              type="text"
              {...register('name')}
              className={cn('input', errors.name && 'input-error')}
              placeholder="John Doe"
            />
          </FormField>
        </div>

        <FormField label="Email Address" error={errors.email?.message} required>
          <input
            type="email"
            {...register('email')}
            className={cn('input', errors.email && 'input-error')}
            placeholder="john@example.com"
          />
        </FormField>

        <FormField label="Phone Number" error={errors.phone?.message}>
          <input
            type="text"
            {...register('phone')}
            className={cn('input', errors.phone && 'input-error')}
            placeholder="+1 (555) 123-4567"
          />
        </FormField>

        <FormField label="Company Name" error={errors.companyName?.message} required>
          <input
            type="text"
            {...register('companyName')}
            className={cn('input', errors.companyName && 'input-error')}
            placeholder="Acme Corp"
          />
        </FormField>

        <FormField label="Website" error={errors.website?.message}>
          <input
            type="text"
            {...register('website')}
            className={cn('input', errors.website && 'input-error')}
            placeholder="https://example.com"
          />
        </FormField>

        <FormField label="GST Number" error={errors.gstNumber?.message}>
          <input
            type="text"
            {...register('gstNumber')}
            className={cn('input', errors.gstNumber && 'input-error')}
            placeholder="22AAAAA0000A1Z5"
          />
        </FormField>
      </FormSection>

      <FormSection
        title="Classification"
        description="Status and tier information for this customer."
      >
        <FormField label="Status" error={errors.status?.message}>
          <select
            {...register('status')}
            className={cn('select', errors.status && 'input-error')}
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
            className={cn('select', errors.tier && 'input-error')}
          >
            {CUSTOMER_TIERS.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </FormField>
      </FormSection>

      <FormSection
        title="Address"
        description="Physical location details for this customer."
      >
        <div className="sm:col-span-2">
          <FormField label="Street Address" error={errors.address?.street?.message}>
            <input
              type="text"
              {...register('address.street')}
              className={cn('input', errors.address?.street && 'input-error')}
              placeholder="123 Main St"
            />
          </FormField>
        </div>

        <FormField label="City" error={errors.address?.city?.message}>
          <input
            type="text"
            {...register('address.city')}
            className={cn('input', errors.address?.city && 'input-error')}
            placeholder="New York"
          />
        </FormField>

        <FormField label="State / Province" error={errors.address?.state?.message}>
          <input
            type="text"
            {...register('address.state')}
            className={cn('input', errors.address?.state && 'input-error')}
            placeholder="NY"
          />
        </FormField>

        <FormField label="Postal Code" error={errors.address?.postalCode?.message}>
          <input
            type="text"
            {...register('address.postalCode')}
            className={cn('input', errors.address?.postalCode && 'input-error')}
            placeholder="10001"
          />
        </FormField>

        <FormField label="Country" error={errors.address?.country?.message}>
          <input
            type="text"
            {...register('address.country')}
            className={cn('input', errors.address?.country && 'input-error')}
            placeholder="United States"
          />
        </FormField>
      </FormSection>

      <div className="sticky bottom-0 z-10 -mx-8 -mb-8 mt-8 border-t border-surface-200 bg-white/95 px-8 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn('btn-primary', isSubmitting && 'flex items-center gap-2')}
          >
            {isSubmitting && (
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {isSubmitting
              ? 'Saving...'
              : mode === 'create'
                ? 'Create Customer'
                : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
