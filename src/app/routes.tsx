import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { NotFoundPage } from '@/components/NotFoundPage';
import { LoadingSpinner } from '@/features/customers/components/LoadingSpinner';

const CustomerListPage = lazy(() =>
  import('@/features/customers/pages/CustomerListPage').then((m) => ({
    default: m.CustomerListPage,
  })),
);

const CustomerDetailsPage = lazy(() =>
  import('@/features/customers/pages/CustomerDetailsPage').then((m) => ({
    default: m.CustomerDetailsPage,
  })),
);

const CreateCustomerPage = lazy(() =>
  import('@/features/customers/pages/CreateCustomerPage').then((m) => ({
    default: m.CreateCustomerPage,
  })),
);

const EditCustomerPage = lazy(() =>
  import('@/features/customers/pages/EditCustomerPage').then((m) => ({
    default: m.EditCustomerPage,
  })),
);

const SettingsPage = lazy(() =>
  import('@/features/customers/pages/SettingsPage').then((m) => ({
    default: m.SettingsPage,
  })),
);

function SuspenseFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

export function AppRoutes() {
  return (
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <CustomerListPage />
            </Suspense>
          }
        />
        <Route
          path="new"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <CreateCustomerPage />
            </Suspense>
          }
        />
        <Route
          path=":id"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <CustomerDetailsPage />
            </Suspense>
          }
        />
        <Route
          path=":id/edit"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <EditCustomerPage />
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
}
