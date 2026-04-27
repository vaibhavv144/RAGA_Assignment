/* HealthPlus service worker
 * Responsibilities:
 *  - Basic offline cache for the app shell.
 *  - Receive `SHOW_NOTIFICATION` messages from the page and forward to OS notifications.
 *  - Handle remote `push` events (when wired to FCM / web-push).
 *  - Re-focus an existing tab on notification click.
 */

const CACHE = 'healthplus-shell-v1';
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => undefined));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // Network-first for navigations (so users always see fresh app code), cache fallback offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/index.html')),
    );
    return;
  }
  // Cache-first for static assets.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => undefined);
          return res;
        }),
    ),
  );
});

// Page → SW bridge for local notifications.
self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type === 'SHOW_NOTIFICATION') {
    const { title, body, tag, url } = data.payload || {};
    self.registration.showNotification(title || 'HealthPlus', {
      body: body || '',
      tag: tag || 'healthplus',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: url || '/' },
    });
  }
});

// Real push event (wire this to FCM or any web-push provider in production).
self.addEventListener('push', (event) => {
  let payload = { title: 'HealthPlus', body: 'You have a new update.', url: '/' };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // Non-JSON payload — keep defaults.
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      tag: payload.tag || 'healthplus',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      data: { url: payload.url || '/' },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(target).catch(() => undefined);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
      return undefined;
    }),
  );
});
