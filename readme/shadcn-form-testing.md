# shadcn Form Testing — Add Customer Dialog

## Purpose

Experimental implementation of a shadcn/ui form inside a shadcn Dialog for the "Add Customer" flow. This is a **test/prototype** — the original page-based `/customers/new` route remains untouched.

## What Changed

### New Dependencies Added

| Package | Purpose |
|---|---|
| `@shadcn/react` | shadcn shared utilities |
| `@radix-ui/react-dialog` | Accessible dialog behavior (focus trap, Esc, aria) |
| `@radix-ui/react-select` | Accessible select behavior |
| `@radix-ui/react-label` | Native label click-to-focus behavior |
| `@radix-ui/react-slot` | Polymorphic `asChild` pattern |
| `class-variance-authority` | Variant management for UI components |
| `clsx` | Conditional class joining |
| `tailwind-merge` | Tailwind class conflict resolution |
| `lucide-react` | Icon library (used by shadcn components) |

### New Files Created

| File | Description |
|---|---|
| `src/components/ui/dialog.tsx` | shadcn Dialog (Radix-based) |
| `src/components/ui/input.tsx` | shadcn styled Input |
| `src/components/ui/button.tsx` | shadcn Button with variants |
| `src/components/ui/select.tsx` | shadcn Select (Radix-based) |
| `src/components/ui/label.tsx` | shadcn Label (Radix-based) |
| `src/components/ui/field.tsx` | shadcn Field system (Field, FieldLabel, FieldError, FieldGroup) |
| `src/components/ui/separator.tsx` | shadcn Separator (used by Field component) |
| `src/lib/utils.ts` | Re-exports `cn` for shadcn alias resolution |
| `components.json` | shadcn CLI configuration |
| `src/features/customers/components/AddCustomerDialog.tsx` | **New dialog component** |

### Files Modified

| File | Change |
|---|---|
| `src/utils/cn.ts` | Upgraded from simple `filter().join()` to `clsx` + `tailwind-merge` |
| `src/features/customers/pages/CustomerListPage.tsx` | Replaced `<Link to="/customers/new">` with `<AddCustomerDialog />` |

## Architecture

```
AddCustomerDialog
├── Dialog (shadcn/Radix)
│   ├── DialogTrigger → "Add Customer" button
│   └── DialogContent
│       ├── DialogHeader (title + description)
│       ├── Form (react-hook-form + Controller + Field)
│       │   └── Basic Information section (6 fields)
│       └── DialogFooter (Cancel + Submit)
└── useCreateCustomer mutation (existing hook)
```

The form uses:
- **react-hook-form** `useForm` + `Controller` (instead of `register`)
- **shadcn Field** components (`Field`, `FieldLabel`, `FieldError`, `FieldGroup`) for layout
- **shadcn Input** for text fields
- **Zod** validation via `zodResolver` (same schema as existing form)

## Current State (Phase 1)

Only the **Basic Information** section is implemented:
- Full Name, Email Address, Phone Number, Company Name, Website, GST Number

**Not yet implemented (planned for future phases):**
- Classification section (Status, Tier) — will use shadcn Select
- Address section (Street, City, State, Postal Code, Country)

## How to Test

1. Start the dev server: `pnpm run dev`
2. Navigate to `http://localhost:3001/customers`
3. Click the **"Add Customer"** button in the page header
4. The shadcn dialog opens with the Basic Information form
5. Fill in fields and submit

The existing `/customers/new` page-based flow remains fully functional.

## How to Rollback

### Option A — Full rollback (recommended)

```bash
git checkout main
git branch -D feat/shadcn-form-testing
pnpm install   # restores original lockfile
```

### Option B — Keep dependencies, revert file changes

```bash
git checkout main -- src/   # restore all source files
```

### Option C — Uninstall added packages only

```bash
pnpm remove @shadcn/react @radix-ui/react-dialog @radix-ui/react-select \
            @radix-ui/react-label @radix-ui/react-slot \
            class-variance-authority clsx tailwind-merge lucide-react
```
