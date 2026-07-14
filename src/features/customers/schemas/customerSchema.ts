import { z } from 'zod';

const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(100),
  postalCode: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().min(1, 'Country is required').max(100),
});

export const customerFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer name is required')
    .max(200, 'Name must be under 200 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(phoneRegex, 'Invalid phone number format'),
  website: z
    .string()
    .max(500)
    .regex(urlRegex, 'Invalid URL format')
    .optional()
    .or(z.literal('')),
  gstNumber: z
    .string()
    .regex(gstRegex, 'Invalid GST number format')
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive', 'suspended'], {
    required_error: 'Status is required',
  }),
  tier: z.enum(['bronze', 'silver', 'gold', 'platinum'], {
    required_error: 'Tier is required',
  }),
  companyName: z
    .string()
    .min(1, 'Company name is required')
    .max(200),
  address: addressSchema,
});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;
