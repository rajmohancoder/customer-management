# Switching Between Mock & Real API

## Current State

| Hook | Data Source |
|---|---|
| `useCustomers` | **Mock** (`api/client.ts`) — 50 records, pagination/sort/filter |
| `useCustomer`, `useCustomerStats`, `useCreateCustomer`, `useUpdateCustomer`, `useDeleteCustomer` | **Real API** (`api/real-client/api.ts`) |

## How to Switch

Only one file to change: **`src/features/customers/api/real-client/hooks.ts`**

### Switch `useCustomers` to Real API

Replace:
```ts
import { fetchCustomers } from '../client';
// ...
queryFn: () => fetchCustomers(params),
```

With:
```ts
import { customerApi } from './api';
// ...
queryFn: () => customerApi.list(params).then((r) => r.data),
```

### Switch All Hooks to Mock (full demo mode)

Replace the `customerApi.X().then(r => r.data)` pattern **and** the `import { customerApi }` with mock equivalents:
```ts
import {
  fetchCustomers, fetchCustomer, fetchCustomerStats,
  createCustomer, updateCustomer, deleteCustomer,
} from '../client';
```

Then use direct calls without `.then(r => r.data)`:
```ts
queryFn: () => fetchCustomers(params),     // useCustomers
queryFn: () => fetchCustomer(id!),         // useCustomer
mutationFn: (data) => createCustomer(data), // useCreateCustomer
```

### Switch All Hooks to Real API (production)

Replace mock imports with:
```ts
import { customerApi } from './api';
```

And add `.then((r) => r.data)` to every `queryFn`/`mutationFn`.

## The `.then(r => r.data)` Pattern

`@rajmohancoder/api-client` returns `{ data: T; status: number; headers }` — not `T` directly. Mock functions return `T` directly.

## Where the Hooks Are Consumed

| Page | Uses |
|---|---|
| `CustomerListPage` | `useCustomers`, `useDeleteCustomer` |
| `CustomerDetailsPage` | `useCustomer`, `useDeleteCustomer` |
| `EditCustomerPage` | `useCustomer`, `useUpdateCustomer` |
| `CreateCustomerPage` | `useCreateCustomer` |
