# Customer Management — Micro Frontend

Enterprise-grade Customer Management Micro Frontend (MFE) built for the shell platform.

## Architecture

```
shell-app (host)
  └── /customers/* ──► customer-management (remote)
        ├── /                         redirect to /customers
        ├── /customers                list + search + filter + sort
        ├── /customers/new            create
        ├── /customers/:id            details
        ├── /customers/:id/edit       edit
        └── /customers/settings       settings (placeholder)
```

This application is a **Module Federation Remote** consumed by the Shell at runtime. It owns only Customer Management domain logic and UI. Authentication, navigation, layout, and authorization are handled by the Shell.

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 |
| Language | TypeScript (strict) |
| Bundler | Vite 6 |
| Module Federation | @originjs/vite-plugin-federation |
| Routing | React Router v6 |
| Styling | Tailwind CSS 3 |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Package Manager | pnpm |

## Shared Libraries

Consumed from `@rajmohancoder/*` (never recreated):

| Package | Purpose |
|---------|---------|
| `@rajmohancoder/types` | Domain types: Customer, Address, PaginatedResult, ApiError |
| `@rajmohancoder/auth-sdk` | Auth hooks, MSAL provider, permissions |
| `@rajmohancoder/api-client` | Axios-based HTTP client with retry, tracing, auth injection |
| `@rajmohancoder/events` | Event type definitions for cross-MFE communication |

## Folder Structure

```
src/
├── app/
│   ├── providers.tsx        # React Query client, Error Boundary
│   └── routes.tsx            # Internal route definitions (code-split)
├── components/
│   ├── ErrorBoundary.tsx     # Class-based error boundary
│   ├── NotFoundPage.tsx      # 404 page
│   └── UnauthorizedPage.tsx  # 403 page
├── constants/
│   └── index.ts              # App constants, query keys, enums
├── features/
│   └── customers/            # Feature module (domain-driven)
│       ├── api/
│       │   ├── client.ts     # Mock CRUD API with pagination/sort/filter
│       │   └── mock.ts       # 50 realistic customer records
│       ├── components/       # Reusable UI components
│       │   ├── CustomerTable.tsx
│       │   ├── CustomerCard.tsx
│       │   ├── CustomerForm.tsx         # RHF + Zod form
│       │   ├── CustomerSearch.tsx       # Debounced search
│       │   ├── CustomerFilters.tsx      # Status + Tier dropdowns
│       │   ├── CustomerStatusBadge.tsx  # Color-coded badge
│       │   ├── CustomerActions.tsx      # View/Edit/Delete buttons
│       │   ├── CustomerInfo.tsx         # Read-only detail view
│       │   ├── ConfirmDeleteDialog.tsx  # Modal with ESC support
│       │   ├── PageHeader.tsx
│       │   ├── StatCards.tsx            # Dashboard statistics
│       │   ├── EmptyState.tsx
│       │   └── LoadingSpinner.tsx
│       ├── hooks/            # TanStack Query hooks
│       │   ├── useCustomers.ts
│       │   ├── useCustomer.ts
│       │   ├── useCreateCustomer.ts
│       │   ├── useUpdateCustomer.ts
│       │   └── useDeleteCustomer.ts
│       ├── pages/            # Route-level page components
│       │   ├── DashboardPage.tsx
│       │   ├── CustomerListPage.tsx
│       │   ├── CustomerDetailsPage.tsx
│       │   ├── CreateCustomerPage.tsx
│       │   ├── EditCustomerPage.tsx
│       │   └── SettingsPage.tsx
│       ├── schemas/
│       │   └── customerSchema.ts   # Zod validation schemas
│       ├── services/
│       │   └── customerService.ts  # Service layer (DI-ready)
│       └── types/
│           └── index.ts            # Feature-specific types
├── routes/
│   └── index.tsx            # Re-export for Module Federation
├── styles/
│   └── index.css            # Tailwind base + component classes
├── utils/
│   └── cn.ts                # Classname utility
├── App.tsx                  # Root component (exposed as CustomerApp)
├── main.tsx                 # Standalone bootstrap
└── global.d.ts              # Type declarations
```

## Module Federation Integration

### Remote Configuration (`vite.config.ts`)

```ts
federation({
  name: 'customer',
  filename: 'remoteEntry.js',
  exposes: {
    './CustomerApp': './src/App.tsx',
    './Routes': './src/routes/index.tsx',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.0.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    'react-router-dom': { singleton: true, requiredVersion: '^6.0.0' },
  },
})
```

### Shell Integration

The Shell loads this remote at `/customers/*`:

```ts
// Shell's vite.config.ts
remotes: {
  customer: `http://localhost:3001/assets/remoteEntry.js`,
}

// Shell's federation/remoteLoader.ts
customer: () => import('customer/CustomerApp'),

// Shell's remotes.ts
{
  name: 'customer',
  displayName: 'Customer Management',
  routePath: '/customers/*',
  modulePath: './CustomerApp',
  requiredPermission: 'customer:view',
  navOrder: 1,
}
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Install

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Runs on `http://localhost:3001` by default (configurable via `VITE_REMOTE_PORT` in `.env.development`).

### Build

```bash
pnpm build
```

Outputs to `dist/` with `remoteEntry.js` in `dist/assets/`.

### TypeScript Check

```bash
pnpm typecheck
```

## Adding a New Feature Page

1. Create page component in `src/features/customers/pages/`
2. Add route in `src/app/routes.tsx` (lazy import)
3. Add navigation link if needed
4. Add API endpoint in `src/features/customers/api/client.ts`
5. Add query hook in `src/features/customers/hooks/`
6. Create reusable components as needed in `src/features/customers/components/`

## Error Handling

- **ErrorBoundary** — class-based, wraps all routes, catches render errors
- **404** — `NotFoundPage` for unmatched routes
- **403** — `UnauthorizedPage` for access-denied states (future use)
- **API errors** — handled per-page with error state display and retry
- **Form errors** — inline field validation via Zod + React Hook Form

## Performance

- All page components are **lazy-loaded** (code-split by route)
- TanStack Query provides **automatic caching** and **background refetching**
- `keepPreviousData` for smooth pagination transitions
- **Debounced search** (300ms) to reduce API calls
- **Memoized callbacks** in page components

## Testing

The codebase is structured for easy test setup:

- **Vitest** — unit/integration tests (add `vitest.config.ts`)
- **React Testing Library** — component tests (import components directly)
- **Playwright** — E2E tests (test against running dev server)

No test runner is configured to avoid unnecessary dependencies.

## Events (Future Integration)

Prepare for `@rajmohancoder/events` integration:

| Event | When |
|-------|------|
| `customer:created` | After successful create |
| `customer:updated` | After successful update |
| `customer:deleted` | After successful delete |

Publish using `window.postMessage` or the Shell's event bus.

## API Layer (Future Integration)

The `CustomerService` class accepts an optional `ApiClient` parameter for DI:

```ts
// When ready to switch from mock to real API:
import { createApiClient } from '@rajmohancoder/api-client';

const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
});

const service = createCustomerService({
  fetchCustomers: (params) => apiClient.get('/customers', { params }),
  // ... implement each method
});
```

## Code Quality Principles

- **SOLID** — single responsibility per component, dependency injection in services
- **Clean Architecture** — separation of API, services, hooks, components
- **Strict TypeScript** — no `any`, explicit interfaces, strict mode
- **Reusable Components** — small, focused, composable
- **No Duplication** — shared components, constants, and utilities
- **Accessibility** — semantic HTML, ARIA labels, keyboard navigation
- **Enterprise UI** — consistent design tokens, responsive layout
