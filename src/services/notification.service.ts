/**
 * Notification orchestration: wraps the Notifications API + the page→SW bridge.
 * Falls back to a foreground `new Notification(...)` when the service worker is unavailable.
 */

export type PermissionState = NotificationPermission | 'unsupported';

export interface ShowNotificationInput {
  title: string;
  body?: string;
  tag?: string;
  url?: string;
}

export function isSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function currentPermission(): PermissionState {
  if (!isSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestPermission(): Promise<PermissionState> {
  if (!isSupported()) return 'unsupported';
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission;
  }
  return Notification.requestPermission();
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
    return reg;
  } catch {
    return null;
  }
}

export async function showNotification(input: ShowNotificationInput): Promise<boolean> {
  if (!isSupported()) return false;
  if (Notification.permission !== 'granted') return false;

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.active) {
      reg.active.postMessage({ type: 'SHOW_NOTIFICATION', payload: input });
      return true;
    }
  }
  // Foreground fallback (no SW yet).
  // eslint-disable-next-line no-new
  new Notification(input.title, { body: input.body, tag: input.tag });
  return true;
}
