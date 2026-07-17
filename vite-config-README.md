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

## Environment Variables

| Variable | Default | Where set | Purpose |
|---|---|---|---|
| `VITE_REMOTE_PORT` | `3001` | `.env.development`, `.env.production` | Dev/preview server port |
| `VITE_API_URL` | `/api` | `.env.development`, `.env.production` | Backend API base URL |
| `VITE_BASE` | `/` | `.env.development`, `.env.production` | Public base path for assets |

### `VITE_BASE` — Production asset path

Controls the URL prefix for all bundled assets (`remoteEntry.js`, chunks, CSS). The shell fetches the remote entry at:

```
{base}/assets/remoteEntry.js
```

```ts
// vite.config.ts
base: env.VITE_BASE || '/',
```

| Environment | `.env` value | URL resolves to |
|---|---|---|
| Development | `VITE_BASE=/` | `http://localhost:3001/assets/remoteEntry.js` |
| Production | `VITE_BASE=/customer-mfe/` | `https://cdn.example.com/customer-mfe/assets/remoteEntry.js` |

**Before deploying:** update `VITE_BASE` in `.env.production` to match your CDN/deploy path then update the shell's `remotes` URL accordingly.

---

## Serving & Build Modes

### Development
```bash
pnpm dev
# Serves at http://localhost:3001
# Shell remote URL: http://localhost:3001/assets/remoteEntry.js
```

### Production build
```bash
pnpm build          # outputs to dist/
pnpm preview        # preview the built output locally
# Deploy dist/ to CDN/production server
```

The shell's `remotes` config must point to the deployed remote entry:
```ts
remotes: {
  customer: 'https://cdn.example.com/customer-mfe/assets/remoteEntry.js',
}
//                                    ^^^^^^^^^^^^^^^^
//                    must match VITE_BASE in .env.production
```

### CORS requirement

Your production server/CDN **must** send `Access-Control-Allow-Origin` headers so the shell can fetch `remoteEntry.js` and chunk files cross-origin:

```nginx
# nginx example
location /customer-mfe/ {
  add_header Access-Control-Allow-Origin *;
}
```

```yaml
# GitHub Pages, Vercel, Netlify, etc.
# Configure custom headers via their dashboard or _headers file
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

---

## Build Performance & Caching

### `cssCodeSplit: false`

By default Vite splits CSS per-chunk (each lazy-loaded route gets its own `.css` file). For an MFE consumed by a shell, this causes **multiple CSS requests** on route transitions, potentially flashing unstyled content (FOUC).

```ts
cssCodeSplit: false, // Single CSS file for the entire MFE
```

| Setting | When to use |
|---|---|
| `false` | Small-to-medium MFEs, Tailwind-based CSS, avoids FOUC on route changes |
| `true` (default) | Very large MFEs (50+ routes) where users shouldn't download CSS for pages they never visit |

**Recommendation:** Keep `false` for per-domain MFEs like this one.

---

### `rollupOptions.output` — Cache-busting with content hashes

```ts
rollupOptions: {
  output: {
    chunkFileNames: 'assets/[name]-[hash].js',  // Lazy-loaded routes
    entryFileNames: 'assets/[name]-[hash].js',  // Entry points
    assetFileNames: 'assets/[name]-[hash][extname]', // CSS, images, fonts
  },
}
```

| Pattern | Example | Purpose |
|---|---|---|
| `[name]` | `CustomerListPage` | Readable file names for debugging |
| `[hash]` | `Ab3k9f` | Content-based hash — changes only when file content changes |
| `[extname]` | `.css` / `.png` | Preserves original extension |

**Enterprise benefit:** The shell/CDN can serve `dist/assets/*` with `Cache-Control: immutable`. Browsers cache these files forever. On your next deploy, only files whose content changed get new hashes — users download only the delta.

Without hashes:
```
assets/CustomerListPage.js   ← cached forever, never invalidated on update
```

With hashes:
```
assets/CustomerListPage-Ab3k9f.js   ← deployed v1
assets/CustomerListPage-Xz4m8p.js   ← deployed v2 (only this file re-downloaded)
```

---

### `esbuild.drop` — Strip console & debugger in production

```ts
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
}
```

- **`pnpm build`** (production mode) — esbuild strips every `console.*` and `debugger` call from the bundled output. Source files remain untouched.
- **`pnpm dev`** (development mode) — nothing is removed, all logs visible.

**Why:** Smaller bundle, prevents internal debug info leaking to users, eliminates console noise in production. For enterprise, consider a logger utility that preserves `console.error` for error monitoring (Sentry, Datadog).

---

### `strictPort: true`

```ts
server: { port, strictPort: true },
preview: { port, strictPort: true },
```

If port `3001` is already in use, Vite **fails immediately** instead of falling back to the next available port (e.g. `3002`). This is intentional — the shell's Module Federation config hardcodes `http://localhost:3001/assets/remoteEntry.js`, so the MFE must always be on the expected port.

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
