
<<<<<<< HEAD
A frontend application that simulates a B2B healthcare operations platform —
authentication, dashboard, analytics, and a patient panel with grid/list views
plus push-style notifications delivered through a service worker.

Built as a frontend assignment to demonstrate code quality, architecture, and
real-world feature handling.

## Highlights

- **React 18 + TypeScript (strict)** with Vite for fast HMR and code-split builds.
- **Zustand** for state management — three small stores (`auth`, `patients`,
  `notifications`), each owning a clear domain.
- **Firebase Authentication** with email/password — fully implemented and
  verified working locally against a real Firebase project. The app also ships
  with a built-in mock auth provider so reviewers can sign in instantly using
  the demo accounts shown right on the login page (no Firebase setup needed).
- **Service worker** with offline app-shell caching, page-to-SW notification
  bridge, and a `push` event handler ready for FCM / web-push.
- **Recharts** for performant SVG charts (area, bar, pie, line).
- **CSS Modules + design tokens** (no UI library) — a small, scalable design
  system tuned for healthcare data density.
- **Code-splitting per route** via `React.lazy` and a `manualChunks` config
  (react / firebase / charts / app), so the login bundle is tiny.
- **Accessible**: keyboard activation on patient cards/rows, focus rings,
  ARIA attributes on dialogs, segmented controls, and notification badges.
- **Responsive** down to mobile (hides sidebar, collapses grids).

## Quick start

```bash
# 1. Install
npm install

# 2. Run in dev mode (uses mock auth out of the box)
npm run dev

# 3. Production build
npm run build
npm run preview
```

Open the dev URL Vite prints (default <http://localhost:5173>). The app ships
in **mock auth mode by default** so anyone cloning the repo can sign in
without setting up Firebase — the credentials are listed on the login page
itself, and clicking a row auto-fills the form.

## Authentication

Two providers are wired up behind a single interface
([`src/services/auth.service.ts`](src/services/auth.service.ts)). The active
one is selected at boot from environment config:

```ts
// src/services/firebase.ts
export const useMockAuth =
  import.meta.env.VITE_USE_MOCK_AUTH === 'true' || !config.apiKey;
```

### 1. Mock auth — the default for reviewers

Zero setup. Run `npm install && npm run dev` and use one of the credentials
displayed inside the **"Demo accounts (mock auth)"** card on the login page:

| Email                    | Password   | Role          |
| ------------------------ | ---------- | ------------- |
| `admin@healthplus.io`    | `demo1234` | Admin         |
| `doctor@healthplus.io`   | `demo1234` | Practitioner  |

The mock provider mirrors Firebase's API surface (`login`, `logout`,
`subscribe`) and persists the session to `localStorage`, so the rest of the
app — route guards, header, sign-out, etc. — behaves identically to the real
Firebase path. This exists purely so the assignment can be reviewed end-to-end
without anyone needing access to a Firebase console.

### 2. Real Firebase auth — verified working locally

The Firebase email/password flow was implemented end-to-end and **tested on my
local machine against a real Firebase project**, signing in successfully with
an account I created in the Firebase Console. The reason this README still
points reviewers at the mock accounts is that committing my Firebase
credentials would expose the API key and require everyone to share my
project; instead, anyone can plug in their own Firebase project with two file
edits:

1. Copy `.env.example` to `.env.local`.
2. Paste your Firebase web config from **Firebase Console → Project Settings →
   Your apps → Web app SDK setup**.
3. Set `VITE_USE_MOCK_AUTH=false`.
4. In **Firebase Console → Authentication**, enable the **Email/Password**
   sign-in method and create a user under the **Users** tab.
5. Restart `npm run dev`.

When real Firebase is active, the demo-accounts card on the login page
disappears (it's gated by `useMockAuth`), which serves as a visual
confirmation that you're now hitting `identitytoolkit.googleapis.com`.

The auth service translates Firebase error codes
(`auth/wrong-password`, `auth/invalid-credential`, `auth/too-many-requests`,
`auth/network-request-failed`, etc.) into user-friendly messages so the UI
never surfaces raw codes — see
[`auth.service.ts:103`](src/services/auth.service.ts#L103).

> Both paths share the same Zustand store, route guard, and session-restore
> hook. Swapping providers is a config change, not a code change.

## Pages

| Route         | Purpose                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------- |
| `/login`      | Email/password sign-in, validation, demo accounts                                            |
| `/dashboard`  | Welcome, KPI cards, admissions chart, critical watchlist, upcoming appointments              |
| `/analytics`  | Revenue vs target, risk distribution, department load, patient satisfaction                  |
| `/patients`   | Patient panel with grid/list toggle, search, filters, and a side-drawer detail view          |

## Patient Details — grid / list toggle

The `/patients` page renders the same data through two presentations:

- **Grid view** — `PatientCard` components with primary condition, department,
  physician, next visit, status, risk tag.
- **List view** — denser tabular layout, scannable for triage workflows.

The active view is persisted to `localStorage` so the user's preference sticks
across sessions, and the toggle is a fully accessible segmented control with
`aria-pressed` state.

Tapping a card or row opens the **PatientDetailDrawer** — a slide-in side
panel with full profile, contact info, and a "Notify care team" action that
fires a push notification through the service worker.

## Notifications & Service Worker

The service worker lives at [`public/service-worker.js`](public/service-worker.js).
On boot, the app registers it via `notification.service.ts`. Three things work:

1. **Offline app-shell**: the SW caches `/`, `index.html`, manifest, and favicon
   so the app loads even with no network.
2. **Local notifications**: the page sends a `SHOW_NOTIFICATION` message to the
   active SW; the SW calls `registration.showNotification(...)`. This is what
   the "Trigger demo alert" button on the dashboard, the "Notify care team"
   button on the drawer, and a recurring vitals alert all use.
3. **Push notifications**: the SW also implements a `push` listener and a
   `notificationclick` handler that focuses or opens a tab — wire this to FCM
   or any web-push provider in production with no front-end changes.

Permission is requested *only after* the user opts in (banner inside the
notification center), respecting modern UX guidelines and avoiding the
"prompt-on-load" anti-pattern.

## State management

Three Zustand stores, each with a narrow API:

```
src/store/
  authStore.ts          // user, status, login/logout, init listener
  patientStore.ts       // patient list, view mode, filters, selection
  notificationStore.ts  // in-app feed, permission, SW init, push action
```

Why Zustand over Redux for this scope:

- Smaller bundle, no boilerplate (no actions/reducers/types ceremony).
- Co-located actions on the slice, easy to test, easy to mock.
- Selectors are just functions of state — derive lists with `useMemo` from a
  base slice rather than from the store, which avoids re-render storms when
  unrelated slices change.

## Project structure

```
src/
├── App.tsx                  # routes + boot-time hooks
├── main.tsx                 # React entry
├── components/
│   ├── auth/                # ProtectedRoute
│   ├── common/              # Button, Avatar, Tag, StatCard, Icon, …
│   ├── layout/              # AppLayout, Sidebar, Header, NotificationCenter
│   └── patients/            # PatientCard, PatientRow, ViewToggle, Drawer
├── data/                    # seed patient dataset (typed)
├── hooks/                   # useInitAuth, useNotifications, demo seeder
├── pages/                   # Login, Dashboard, Analytics, Patients
├── services/                # firebase, auth.service, notification.service
├── store/                   # zustand slices
├── styles/                  # global.css (tokens) + animations.css
├── types/                   # shared domain types
└── utils/                   # formatters
```

### Why this structure scales

- **Pages** are thin — they compose components and read from stores.
- **Services** isolate side-effecting libraries (Firebase, Notifications API)
  behind a stable interface, so swapping providers is a single-file change.
- **Components/common** stays UI-pure — no domain knowledge — making it usable
  across pages and easy to extract into a shared package later.
- **Components/{domain}** is where domain UI lives (e.g. `patients/`) and is
  the natural seam if you ever split this into a micro-frontend.

## Performance notes

- **Code-splitting**: each route is `React.lazy`-loaded; charts and Firebase
  ship in their own chunks via `vite.config.ts → manualChunks`.
- **CSS Modules**: scoped, tree-shakeable, no runtime cost.
- **Memoised derivations**: filters, departments, and dashboard aggregates use
  `useMemo` to avoid recomputing on unrelated state changes.
- **Stable selectors**: stores expose primitive/atomic slices; derived data is
  computed in components rather than via selectors that return new arrays.
- **Service worker** caches the shell so repeat visits start in milliseconds.
- **Source maps** are emitted for production debugging.

## Bonus / forward-looking

- **Micro-frontend ready**: the `components/{domain}` boundary, plus the
  service-layer indirection, means the patients module could be lifted into a
  remote with Module Federation or vite-plugin-federation with minimal change.
- **Reusable design system**: tokens in `global.css`, primitives in
  `components/common`. Adding a Storybook is the natural next step.
- **Pluggable auth**: the auth service already abstracts Firebase vs mock —
  adding SSO/Magic Link is just another provider behind the same `login()` /
  `subscribe()` API.

## Scripts

| Command            | What it does                              |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start Vite dev server                     |
| `npm run build`    | Type-check and build production bundle    |
| `npm run preview`  | Serve the production build locally        |
| `npm run lint`     | Type-check (`tsc --noEmit`) only          |

## Tested browsers

- Chromium / Edge — full support (notifications + SW).
- Firefox — full support.
- Safari — works; SW push requires user gesture per Apple's policy.
#   R A G A _ A s s i g n m e n t  
 
=======
>>>>>>> ddcc601c31178065a4d8648f42efcbc7b5e358ec
