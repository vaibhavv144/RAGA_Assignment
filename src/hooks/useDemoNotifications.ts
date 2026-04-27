import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

/**
 * Seeds a few in-app notifications after sign-in so the bell shows real content
 * out of the box. Also schedules a recurring "vitals check" alert as a working
 * push/notification use case (delivered through the service worker).
 */
export function useDemoNotifications(): void {
  const isAuthed = useAuthStore((s) => s.status === 'authenticated');
  const push = useNotificationStore((s) => s.push);
  const seeded = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthed) {
      seeded.current = false;
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (seeded.current) return;
    seeded.current = true;

    void push({
      title: 'Welcome to HealthPlus',
      body: 'Notifications are wired up via a service worker. Click the bell to enable them.',
      level: 'info',
    });

    window.setTimeout(() => {
      void push({
        title: 'Lab results uploaded',
        body: 'CBC report for Aarav Sharma is ready for review.',
        level: 'success',
      });
    }, 4000);

    // Recurring sample push every 90s — demonstrates SW-delivered notifications.
    intervalRef.current = window.setInterval(() => {
      void push({
        title: 'Vitals threshold alert',
        body: 'Bed 14B — heart rate spiked above 110 bpm for 5 minutes.',
        level: 'warning',
      });
    }, 90_000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthed, push]);
}
