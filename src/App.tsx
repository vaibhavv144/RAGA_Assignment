import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { FullPageLoader } from '@/components/common/FullPageLoader';
import { useInitAuth } from '@/hooks/useInitAuth';
import { useInitNotifications } from '@/hooks/useNotifications';
import { useDemoNotifications } from '@/hooks/useDemoNotifications';

// Code-split each page — keeps the auth path lean.
const LoginPage = lazy(() => import('@/pages/Login').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('@/pages/Dashboard').then((m) => ({ default: m.DashboardPage })),
);
const AnalyticsPage = lazy(() =>
  import('@/pages/Analytics').then((m) => ({ default: m.AnalyticsPage })),
);
const PatientsPage = lazy(() =>
  import('@/pages/Patients').then((m) => ({ default: m.PatientsPage })),
);

export function App() {
  useInitAuth();
  useInitNotifications();
  useDemoNotifications();

  return (
    <BrowserRouter>
      <Suspense fallback={<FullPageLoader label="Loading workspace…" />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/patients" element={<PatientsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
