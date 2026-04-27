import { create } from 'zustand';
import type { AppNotification } from '@/types';
import * as notify from '@/services/notification.service';

interface NotificationState {
  items: AppNotification[];
  permission: notify.PermissionState;
  swReady: boolean;
  init: () => Promise<void>;
  requestPermission: () => Promise<notify.PermissionState>;
  push: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => Promise<AppNotification>;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clear: () => void;
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  permission: 'default',
  swReady: false,

  init: async () => {
    const reg = await notify.registerServiceWorker();
    set({
      swReady: !!reg,
      permission: notify.currentPermission(),
    });
  },

  requestPermission: async () => {
    const result = await notify.requestPermission();
    set({ permission: result });
    return result;
  },

  push: async ({ title, body, level }) => {
    const item: AppNotification = {
      id: makeId(),
      title,
      body,
      level,
      createdAt: Date.now(),
      read: false,
    };
    set((s) => ({ items: [item, ...s.items].slice(0, 50) }));
    if (get().permission === 'granted') {
      await notify.showNotification({ title, body, tag: item.id, url: '/' });
    }
    return item;
  },

  markRead: (id) =>
    set((s) => ({ items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
  markAllRead: () => set((s) => ({ items: s.items.map((n) => ({ ...n, read: true })) })),
  remove: (id) => set((s) => ({ items: s.items.filter((n) => n.id !== id) })),
  clear: () => set({ items: [] }),
}));
