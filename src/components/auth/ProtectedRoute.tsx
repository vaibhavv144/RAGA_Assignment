import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { FullPageLoader } from '@/components/common/FullPageLoader';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const status = useAuthStore((s) => s.status);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const location = useLocation();

  if (!bootstrapped) return <FullPageLoader label="Restoring session…" />;
  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}
