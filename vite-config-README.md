# Vite Module Federation Configuration

This file (`vite.config.ts`) configures the **Customer Management** Micro Frontend (MFE) as a **remote** using Module Federation via `@originjs/vite-plugin-federation`.

## Purpose

This MFE exposes React components that a **shell (host) application** can consume at runtime. The shell fetches the remote entry point and loads components on demand — no build-time dependency required.

## How It Works

### 1. Remote (this MFE)

```ts
federation({
  name: 'customer',          // Unique remote name
  filename: 'remoteEntry.js', // Entry file the shell fetches
  exposes: {
    './CustomerApp': './src/App.tsx',
    './Routes': './src/routes/index.tsx',
  },
  shared: { ... },
})
```

- Build generates `remoteEntry.js` plus chunk files in `dist/`
- The shell loads `http://localhost:3001/assets/remoteEntry.js`

### 2. Shell (host application)

```ts
// Shell's vite.config.ts
federation({
  name: 'shell',
  remotes: {
    customer: 'http://localhost:3001/assets/remoteEntry.js',
  },
})
```

```tsx
// Shell uses the remote component
const CustomerApp = React.lazy(() => import('customer/CustomerApp'))

function ShellRoutes() {
  return (
    <Routes>
      <Route path="/customers/*" element={
        <Suspense fallback={<Spinner />}>
          <CustomerApp />
        </Suspense>
      } />
    </Routes>
  )
}
```

---

## Configuration Options

### `name`
Unique identifier for this remote. Used by the shell to reference this MFE.

```ts
name: 'customer'
```

### `filename`
The remote entry filename generated at build time.

```ts
filename: 'remoteEntry.js'
```

### `exposes`
Components/modules this remote makes available to the shell. Each key is how the shell refers to the module.

```ts
exposes: {
  './CustomerApp': './src/App.tsx',
  './Routes': './src/routes/index.tsx',
}
```

#### `./CustomerApp` — Full self-contained application

Exports the entire `App` component (providers + routes). Use when the shell wants to mount the MFE as an isolated unit.

**Shell usage:**
```tsx
// Shell imports the full app
const CustomerApp = React.lazy(() => import('customer/CustomerApp'))

function ShellLayout() {
  return (
    <Routes>
      {/* Shell mounts the entire MFE at /customers/* */}
      <Route path="/customers/*" element={
        <Suspense fallback={<Spinner />}>
          <CustomerApp />
        </Suspense>
      } />
    </Routes>
  )
}
```
- Best for: **Isolation** — the MFE manages its own providers, error boundaries, and routing
- Trade-off: Shell has **no control** over the layout inside the MFE

#### `./Routes` — Route definitions only

Exports just the `<AppRoutes />` component (the `<Routes>` block with all page routes). Use when the shell wants to embed MFE routes directly into its own router and control the surrounding layout.

**Shell usage:**
```tsx
// Shell imports only the routes
const CustomerRoutes = React.lazy(() => import('customer/Routes'))

function ShellLayout() {
  return (
    <div className="shell-layout">
      <Sidebar />
      <main>
        <Routes>
          {/* Shell's own dashboard route */}
          <Route path="/" element={<Dashboard />} />
          {/* MFE routes embedded — no extra BrowserRouter needed */}
          <Route path="/customers/*" element={
            <Suspense fallback={<Spinner />}>
              <CustomerRoutes />
            </Suspense>
          } />
        </Routes>
      </main>
    </div>
  )
}
```
- Best for: **Layout control** — shell wraps MFE routes with its own header/sidebar/analytics
- Trade-off: MFE relies on the shell for providers (React Query, ErrorBoundary, etc.)

#### When to use which

| Use `./CustomerApp` when... | Use `./Routes` when... |
|---|---|
| MFE is a standalone app with its own providers | Shell already has the same providers |
| Shell wants zero coupling | Shell needs to wrap MFE in shared layout |
| MFE needs its own ErrorBoundary, QueryClient | Shell manages global error handling |
| Quick integration | Fine-grained control over routing |

### `remotes` (shell only)
Remotes the shell consumes.

```ts
remotes: {
  customer: 'http://localhost:3001/assets/remoteEntry.js',
  'another-mfe': 'http://localhost:3002/assets/remoteEntry.js',
}
```

### `shared`
Shared dependencies to avoid duplicate bundles. `singleton: true` ensures only one instance of React runs at runtime.

```ts
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',
  },
  'react-dom': {
    singleton: true,
    requiredVersion: '^18.0.0',
  },
  'react-router-dom': {
    singleton: true,
    requiredVersion: '^6.0.0',
  },
}
```

#### Advanced shared options

```ts
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',
    strictVersion: true,      // Fail if version doesn't match
    eager: false,             // Load synchronously (default: false)
    import: false,            // Don't include fallback bundle
    shareScope: 'default',    // Custom share scope name
  },
  // Share libraries with different strategies
  '@tanstack/react-query': {
    singleton: true,
    requiredVersion: '^5.0.0',
  },
  'zod': {
    singleton: false,         // Allow multiple versions
  },
}
```

---

## Serving & Build Modes

### Development
```bash
pnpm dev
# Serves at http://localhost:3001
# The shell must also run in dev mode and reference the remote URL
```

### Production build
```bash
pnpm build
pnpm preview
# Serves built assets at http://localhost:3001
# Deploy dist/ to CDN/production server
```

In production, replace `remotes` URLs in the shell:
```ts
remotes: {
  customer: 'https://cdn.example.com/customer/assets/remoteEntry.js',
}
```

---

## Adding New Exposed Components

1. Add to `exposes` in `vite.config.ts`:
```ts
exposes: {
  './CustomerApp': './src/App.tsx',
  './Routes': './src/routes/index.tsx',
  './CustomerListPage': './src/features/customers/pages/CustomerListPage.tsx',
}
```

2. Shell imports it:
```tsx
const CustomerList = React.lazy(() => import('customer/CustomerListPage'))
```

---

## Troubleshooting

| Symptom | Likely Cause |
|---|---|
| Blank page | Shell missing `Suspense` fallback around lazy-loaded remote |
| "Failed to fetch" remoteEntry.js | Wrong URL in `remotes` config; CORS |
| React version mismatch | `shared.react.singleton: false` or version range mismatch |
| Component not found | Key in `remotes` doesn't match import path prefix |
| Chunk load error | Remote's `dist/` not deployed or wrong base path |

---

## References

- [@originjs/vite-plugin-federation](https://github.com/originjs/vite-plugin-federation)
- [Module Federation documentation](https://module-federation.io/)
