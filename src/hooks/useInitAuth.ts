import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * Subscribes to auth state once on mount. Returns the bootstrapped flag so
 * route guards can wait for the initial check before redirecting.
 */
export function useInitAuth(): boolean {
  const init = useAuthStore((s) => s.init);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);

  useEffect(() => {
    const unsub = init();
    return () => unsub();
  }, [init]);

  return bootstrapped;
}
