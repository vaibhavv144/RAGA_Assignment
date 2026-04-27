import { useEffect } from 'react';
import { useNotificationStore } from '@/store/notificationStore';

export function useInitNotifications(): void {
  const init = useNotificationStore((s) => s.init);
  useEffect(() => {
    void init();
  }, [init]);
}
