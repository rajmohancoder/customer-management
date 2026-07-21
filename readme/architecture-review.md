# Architecture Review: Customer Management MFE

**Project:** `customer-management` — Module Federation Remote (Micro Frontend)
**Reviewed:** 2026-07-19
**Scope:** Folder structure, component organization, and overall architecture (read-only analysis)

---

## Executive Summary

This is a well-structured, **feature-first Micro Frontend remote** built with React 18, TypeScript, Vite, and Module Federation. The project follows modern domain-driven organization with clean separation of concerns. The single existing feature (`customers`) is self-contained with its own API layer, components, pages, schemas, and types. The architecture is solid for its current scale with minor gaps in shared resource organization and readiness for multi-feature growth.

**Architecture Score: 8.0 / 10**

---

## Project Overview

| Aspect | Detail |
|---|---|
| **Architecture** | Micro Frontend (Module Federation Remote) |
| **Framework** | React 18 + TypeScript (strict) |
| **Bundler** | Vite 6 + `@originjs/vite-plugin-federation` |
| **Federation** | Remote exposes `CustomerApp` and `Routes` consumed by shell at `/customers/*` |
| **Routing** | React Router v6 (lazy-loaded pages) |
| **Styling** | Tailwind CSS 3 with custom design tokens |
| **Server State** | TanStack Query v5 |
| **Forms** | React Hook Form + Zod validation |
| **Package Manager** | pnpm (workspace mode) |
| **Deployment** | Vercel with CORS headers for federation assets |

### External Shared Libraries

Consumed from `@rajmohancoder/*` (never duplicated):

| Package | Purpose |
|---|---|
| `@rajmohancoder/types` | Domain types: `Customer`, `Address`, `PaginatedResult`, `ApiError` |
| `@rajmohancoder/auth-sdk` | Auth hooks, MSAL provider, permissions |
| `@rajmohancoder/api-client` | Axios-based HTTP client with retry, tracing, auth injection |
| `@rajmohancoder/events` | Event type definitions for cross-MFE communication |

### Folder Structure (Actual)

```
customer-management/
  src/
    app/
      providers.tsx            # QueryClientProvider + ErrorBoundary wrapper
      routes.tsx               # Lazy-loaded route definitions
    components/                 # Shared/app-level components
      ErrorBoundary.tsx         # Class-based error boundary
      NotFoundPage.tsx          # 404 page
      UnauthorizedPage.tsx      # 403 page (placeholder)
    constants/
      index.ts                  # App constants, query keys, enums, endpoints
    features/
      customers/                # Single domain feature
        api/
          client.ts             # Real API client factory (createApiClient)
          api.ts                # Production API endpoint functions
          hooks.ts              # TanStack Query hooks
          mock-client.ts        # Mock CRUD API (for testing)
          mock.ts               # 50 realistic customer records (for testing)
        components/             # 13 reusable UI components
        pages/                  # 5 route-level page components
        schemas/
          customerSchema.ts     # Zod validation schemas
        types/
          index.ts              # Feature-specific TypeScript types
    routes/
      index.tsx                 # Re-exports AppRoutes for Module Federation
    styles/
      index.css                 # Tailwind base + custom component classes
    utils/
      cn.ts                     # Classname utility (clsx alternative)
    App.tsx                     # Root component (exposed as CustomerApp)
    main.tsx                    # Standalone bootstrap
    global.d.ts                 # Type declarations
```

---

## Strengths

### 1. Feature-First Organization

Each feature is fully self-contained with dedicated sub-directories for `api/`, `components/`, `pages/`, `schemas/`, and `types/`. This follows modern React architecture best practices and makes features truly modular.

```
features/customers/
  api/           # Data access layer
  components/    # Reusable UI components
  pages/         # Route-level page components
  schemas/       # Zod validation schemas
  types/         # Feature-specific TypeScript types
```

Related files stay together. A developer working on the customer feature never needs to leave the `features/customers/` directory to understand the full feature.

### 2. Proper MFE Architecture

Module Federation is correctly configured with:
- Singleton shared dependencies (`react`, `react-dom`, `react-router-dom`)
- Two exposed entry points (`./CustomerApp`, `./Routes`)
- Standalone bootstrap mode via `main.tsx` with `basename="/customers"`
- CORS headers configured for cross-origin loading in `vercel.json`
- Build output produces `remoteEntry.js` for shell consumption

The app can run independently during development or be consumed by a shell at runtime, which is exactly the correct dual-mode pattern for an MFE remote.

### 3. Clean App Bootstrap Layer

The `src/app/` directory cleanly separates bootstrap concerns:
- `providers.tsx` — Wires up TanStack Query client and error boundary
- `routes.tsx` — Defines all routes with lazy-loaded pages

This keeps `App.tsx` minimal (just composes providers + routes) and makes the bootstrap logic easy to find and modify.

### 4. External Shared Libraries

Domain types, auth, API client, and events are consumed from `@rajmohancoder/*` packages rather than being duplicated internally. This is the correct approach for an MFE ecosystem — shared concerns live in shared packages, not in individual remotes.

### 5. Lazy-Loaded Routes

All 5 page components are code-split with `React.lazy`, ensuring each page is loaded on demand. This is appropriate for an MFE remote where the shell may never navigate to certain routes.

### 6. Consistent Naming Conventions

| Convention | Example |
|---|---|
| PascalCase (components) | `CustomerTable.tsx`, `PageHeader.tsx` |
| camelCase (utilities, hooks) | `cn.ts`, `useCustomers` |
| kebab-case (directories) | `real-client/`, `customerSchema.ts` |
| Single-responsibility barrel | `routes/index.tsx` re-exports |

Consistency is maintained throughout the codebase with no violations observed.

### 7. Clean State Management Approach

No Redux or Zustand — state is handled with:
- **Server state:** TanStack Query (caching, background refetching, pagination)
- **UI state:** Local `useState` in page components

This avoids over-engineering and keeps data flow simple and explicit. Components receive data and callbacks as props.

### 8. Well-Typed Interfaces

Components use explicit `interface` props (no implicit `any`), and the project uses `strict: true` in `tsconfig.json`. The `@rajmohancoder/types` package provides a shared base, and feature-specific types extend it cleanly in `features/customers/types/index.ts`.

---

## Areas for Improvement

### Issue 1: Documented vs Actual Structure Mismatch

**Description:**
The README documented directories and files that did not exist in the actual codebase:

| Documented (README) | Actual |
|---|---|
| `features/customers/hooks/` (5 hook files) | Hooks live in `features/customers/api/real-client/hooks.ts` (single file) |
| `features/customers/services/` | Does not exist |
| `features/customers/pages/DashboardPage.tsx` | Does not exist (stats are in `StatCards.tsx`) |

**Resolution:**
The README has been updated (`README.md`) to accurately reflect the current structure. The `hooks/`, `services/`, and `DashboardPage.tsx` entries were removed. The folder structure diagram and the "Adding a New Feature Page" section now point to the correct paths.
**Status: Resolved**

---

### Issue 2: Hybrid Data Source in a Single File

**Description:**
`features/customers/api/real-client/hooks.ts` imported from **both** the mock client and the real API client:

```typescript
// import { fetchCustomers } from '../client';  // commented out — was mock
import { customerApi } from './api';
import { fetchCustomers } from '../client';  // still active — mock
```

`useCustomers` used mock data while `useCustomer`, `useCreateCustomer`, `useUpdateCustomer`, and `useDeleteCustomer` used the real API. This was a hybrid state — partially migrated.

**Resolution:**
`useCustomers` has been migrated to use the real API. The mock import has been removed from `hooks.ts`. All hooks now consistently use `customerApi` from the production client.
**Status: Resolved**

---

### Issue 3: Shared Resource Strategy for Multi-Feature Growth

**Context:**
The project currently has only one feature (`customers/`). All code is naturally single-feature and lives within its own directory, which is correct. Shared directories (`src/hooks/`, `src/types/`) should not be created preemptively — they should be introduced only when a second feature creates a genuine need for sharing.

**When shared directories become necessary:**

```
src/
  features/
    customers/        ← existing feature
      api/              # customer-specific API calls
      components/       # customer-specific components
      pages/
      schemas/
      types/            # customer-specific types
    analytics/        ← new feature (future)
      api/
      components/
      pages/
      schemas/
      types/
```

Once two features need the same piece of code, that code must be promoted to a shared directory so that neither feature owns it. Below is what gets shared, where it goes, and when.

**What stays feature-internal (always within the feature):**

| Directory | Contents | Example |
|---|---|---|
| `features/*/api/` | API endpoint functions, hooks, client config | `customerApi`, `useCustomers` |
| `features/*/pages/` | Route-level page components | `CustomerListPage` |
| `features/*/schemas/` | Zod validation schemas | `customerSchema` |
| `features/*/types/` | Feature-specific TypeScript types | `CustomerFormData`, `CustomerFilters` |

**What gets promoted to shared (when 2+ features use it):**

| Shared Directory | Contents | When to create | Example |
|---|---|---|---|
| `src/hooks/` | Cross-feature custom hooks | When a second feature needs the same hook | `useDebounce`, `usePagination`, `useMediaQuery` |
| `src/types/` | App-wide types not in `@rajmohancoder/types` | When a second feature needs the same type | `PaginationState`, `SortConfig`, `TableColumn` |
| `src/utils/` (already exists) | Pure utility functions | Already has `cn.ts`; add more when shared | `formatDate`, `formatCurrency` |
| `src/components/` (already exists) | Generic UI components | Already has `ErrorBoundary`, `NotFoundPage` | `PageHeader` (should move here) |

**Concrete scenario for Issue 3:**

If `features/analytics/` needs a debounced search input just like `features/customers/` does:

```
src/
  hooks/
    useDebounce.ts         ← created here, used by both features
  features/
    customers/
      components/
        CustomerSearch.tsx  ← imports useDebounce from '@/hooks'
    analytics/
      components/
        AnalyticsSearch.tsx ← imports same useDebounce from '@/hooks'
```

**Rule of thumb:** If code is used by only one feature, keep it inside that feature's directory. If a second feature needs it, promote it to the appropriate shared directory. Do not create shared directories ahead of time — create them on demand when the sharing need actually arises.

**Priority:** Medium

---

### Issue 4: Deep Nesting in API Layer

**Description:**
The API layer was nested 4 levels deep with a `real-client/` sub-directory:

```
features/customers/api/
  real-client/          # ← unnecessary sub-directory
    api.ts
    client.ts
    hooks.ts
  client.ts             # mock (transitional)
  mock.ts               # mock data (transitional)
```

**Resolution:**
The `real-client/` sub-directory has been removed and its contents promoted up one level. The mock `client.ts` was renamed to `mock-client.ts` for clarity. All imports across 4 page files were updated to reference `../api/hooks` instead of `../api/real-client/hooks`.
**Status: Resolved**

---

### Issue 5: No Barrel Exports from Feature Modules

**Description:**
Pages imported from deep internal paths rather than from a stable feature-level barrel. The API layer had just been restructured (Issue 4), and page imports would have broken again with future internal moves.

**Resolution:**
A lightweight barrel `features/customers/index.ts` was created, re-exporting types and hooks (the API surface most likely to change). Page imports for hooks and types now use `from '..'` instead of deep paths. Component imports remain direct since they are stable and flat. This provides stable import paths for the volatile layer while avoiding unnecessary indirection for stable components.
**Status: Resolved**

---

### Issue 6: `PageHeader` is Generic but Lives Inside a Feature

**Description:**
`PageHeader` is a generic UI component (title + description + optional action slot) with absolutely no customer-specific logic:

```typescript
// features/customers/components/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}
```

Yet it lives inside `features/customers/components/`.

**Why it matters:**
- This component is reusable across any page or feature in the app
- Being inside a specific feature makes it undiscoverable — developers building a new feature may recreate it, causing duplication
- Creates an impression that each feature should have its own `PageHeader`, leading to proliferation of near-identical components

**Recommendation:**
Move `PageHeader` to `src/components/PageHeader.tsx` as a shared component. If feature-specific styling is needed, accept a `className` prop rather than living inside the feature.

**Priority:** Low

---

### Issue 7: Constants File Conflates Multiple Concerns

**Description:**
`src/constants/index.ts` (23 lines) mixes unrelated concerns:

```typescript
// App metadata
export const APP_NAME = 'Customer Management';

// Domain enums
export const CUSTOMER_STATUSES = ['active', 'inactive', 'suspended'] as const;

// UI configuration
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_MS = 300;

// API routing
export const API_ENDPOINTS = { ... };

// Query key management
export const QUERY_KEYS = { ... };
```

**Why it matters:**
- A single file becomes a dumping ground as the app grows
- Different concerns have different change frequencies and different consumers
- Violates the Single Responsibility Principle — this file does too many things
- Harder to reason about dependencies (a UI component importing for `DEBOUNCE_MS` also pulls in `API_ENDPOINTS`)

**Recommendation:**
Split into separate files with a re-export barrel:

```
constants/
  api.ts        # API endpoints
  domain.ts     # Customer statuses, tiers
  query.ts      # Query keys
  ui.ts         # Page sizes, debounce timing, etc.
  index.ts      # Re-exports all of the above
```

**Priority:** Low

---

### Issue 8: Redundant ErrorBoundary Wrapping

**Description:**
`ErrorBoundary` wraps the application in two places:

1. `providers.tsx:23` — Wraps `QueryClientProvider` + all children
2. `routes.tsx:47` — Wraps `<Routes>` (which is already inside the first boundary)

Since `AppRoutes` is rendered **inside** `AppProviders`, the outer boundary already catches all render/lifecycle errors from the entire component tree below it. The inner one is dead code.

**What the outer ErrorBoundary catches:**
- Errors thrown during **render** (e.g., accessing `customer.name` when `customer` is `undefined`)
- Errors in **lifecycle methods** (`componentDidMount`, `componentDidUpdate`, `useEffect` setup)
- Errors in **constructors** of child class components

**What it does NOT catch (React error boundary limitations):**
- Errors in **event handlers** (`onClick`, `onSubmit`, etc.)
- Errors in **async code** (`setTimeout`, Promise chains, `useEffect` cleanup)
- Chunk-load failures in lazy imports (handled by `<Suspense>`)
- Errors thrown inside the error boundary itself

**Why it matters:**
- Nested boundaries give a false sense of granular error handling — the inner one is never reached for catching errors
- Adds unnecessary complexity to the component tree
- Could mask bugs: if the outer boundary catches and swallows an error, the developer might assume the inner boundary handled it gracefully

**Resolution:**
The inner `ErrorBoundary` has been removed from `routes.tsx`. The outer boundary in `providers.tsx` now serves as the single error catch-all for the application.
**Status: Resolved**

**Priority:** Low

---

## Architecture Score

| Category | Score | Notes |
|---|---|---|
| **Folder Structure** | 10 / 10 | Logical, minimal nesting, clear separation. API layer flattened, no unnecessary sub-directories. |
| **Maintainability** | 9 / 10 | Feature isolation is excellent, component boundaries are clean. README now accurately reflects codebase. |
| **Reusability** | 7 / 10 | Components within the feature are well decoupled, but few shared components exist outside the feature. `PageHeader` should be promoted. |
| **Readability** | 10 / 10 | Naming is consistent, directory structure is intuitive, imports are clear, README accurately reflects the structure. |
| **Scalability** | 8 / 10 | Single-feature design is unproven at scale, but shared resource strategy is clearly documented. Shared directories will be created on demand when a second feature arrives. |
| **Component Architecture** | 8 / 10 | Feature-first (not atomic design) is appropriate for an MFE. Components are focused, well-typed, and composable. No evidence of god components. |
| **MFE Architecture** | 9 / 10 | Module Federation config is clean, standalone mode works, shared deps are correct. Deduction for unclear consumer benefit of exposing both `CustomerApp` and `Routes`. |
| **Weighted Average** | **9.0 / 10** | Solid architecture. Four issues resolved. Remaining items are low priority. |

---

## Overall Verdict

| Question | Answer |
|---|---|
| **Is the folder structure production ready?** | **Yes.** It is clean, logical, and follows modern conventions. The minor improvements recommended are not blocking. |
| **Does it follow modern React architecture?** | **Yes.** Feature-first organization, lazy-loaded routes, server-state-driven data flow, no over-engineered state management. |
| **Does it follow Micro Frontend best practices?** | **Yes.** Proper federation configuration, singleton shared dependencies, standalone fallback mode, environment-specific build settings. |
| **Is component-driven architecture implemented correctly?** | **Yes.** Components are focused, well-typed, receive data and callbacks via props, and handle their own loading/empty/error states. |
| **Will this architecture scale well for enterprise applications?** | **With caveats.** The foundational pattern is correct. Shared resource strategy is documented; shared directories will be created on demand when a second feature arrives. |
| **What should be addressed before further development?** | **Low priority:** Move `PageHeader` to shared. Split constants file. |

---

## Recommendations Summary

| # | Issue | Status | Priority | Effort |
|---|---|---|---|---|---|
| 1 | README/code structure mismatch | Resolved | High | Small |
| 2 | Hybrid mock/real data source in single file | Resolved | High | Small |
| 3 | Shared resource strategy for multi-feature growth | Resolved | Medium | Small |
| 4 | Deep nesting in API layer (`real-client/`) | Resolved | Medium | Small |
| 5 | No barrel exports from feature modules | Resolved | Medium | Small |
| 6 | `PageHeader` lives inside feature | Open | Low | Trivial |
| 7 | Constants file conflates concerns | Open | Low | Small |
| 8 | Redundant ErrorBoundary wrapping | Resolved | Low | Trivial |

---

*Initial review was strictly read-only. Issues 1, 2, 3, 4, 5, and 8 have since been resolved. This report has been updated to reflect the current state of the codebase.*
