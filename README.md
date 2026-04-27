# Healthcare Operations Platform (Frontend)

A frontend application that simulates a B2B healthcare operations platform — authentication, dashboard, analytics, and a patient panel with grid/list views plus push-style notifications delivered through a service worker.

Built as a frontend assignment to demonstrate code quality, architecture, and real-world feature handling.

---

## Highlights

- **React 18 + TypeScript (strict)** with Vite for fast HMR and code-split builds.
- **Zustand** for state management — three small stores (`auth`, `patients`, `notifications`), each owning a clear domain.
- **Firebase Authentication** with email/password — fully implemented and verified working locally against a real Firebase project.
- Built-in **mock auth provider** so reviewers can sign in instantly using demo accounts.
- **Service worker** with:
  - Offline app-shell caching
  - Page-to-SW notification bridge
  - Push event handler ready for FCM / web-push
- **Recharts** for analytics visualizations.
- **CSS Modules + design tokens** (no UI library).
- **Code-splitting per route** using `React.lazy` and Vite `manualChunks`.
- **Accessible UI** with keyboard navigation, focus rings, ARIA support.
- Fully **responsive** design.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
npm run preview
```

Open:

```text
http://localhost:5173
```

The app runs in **mock auth mode by default**, so no Firebase setup is required.

---

## Authentication

Two providers are wired behind a single interface:

`src/services/auth.service.ts`

The active provider is selected at runtime:

```ts
export const useMockAuth =
  import.meta.env.VITE_USE_MOCK_AUTH === "true" || !config.apiKey;
```

---

## Mock Authentication (Default)

No setup required.

Use these demo credentials:

| Email                  | Password | Role         |
| ---------------------- | -------- | ------------ |
| admin@healthplus.io    | demo1234 | Admin        |
| doctor@healthplus.io   | demo1234 | Practitioner |

Features:

- Mirrors Firebase API (`login`, `logout`, `subscribe`)
- Session persistence via `localStorage`
- Same route guards and session restore logic

---

## Firebase Authentication (Real)

The Firebase authentication flow has been implemented and verified locally.

To use Firebase:

### Setup

1. Copy environment template:

```bash
cp .env.example .env.local
```

2. Add Firebase config values.

3. Set:

```env
VITE_USE_MOCK_AUTH=false
```

4. Enable Email/Password auth in Firebase Console.

5. Create users in Firebase Authentication.

6. Restart:

```bash
npm run dev
```

---

## Routes

| Route        | Description |
|-------------|-------------|
| `/login` | Sign in page |
| `/dashboard` | KPI dashboard |
| `/analytics` | Business analytics |
| `/patients` | Patient management panel |

---

## Patient Module

The `/patients` page supports:

### Grid View

Uses `PatientCard` components.

Displays:

- Condition
- Department
- Physician
- Next visit
- Status
- Risk tag

### List View

Compact table-based layout for quick triage workflows.

### Features

- Search
- Filters
- View toggle
- Persisted preferences (`localStorage`)
- Accessible segmented controls

---

## Patient Detail Drawer

Clicking a patient opens a slide-in drawer.

Shows:

- Full profile
- Contact information
- Medical overview
- Notify care team action

This triggers notifications through the service worker.

---

## Notifications & Service Worker

Location:

```text
public/service-worker.js
```

### Features

### 1. Offline App Shell

Caches:

- `/`
- `index.html`
- manifest
- favicon

### 2. Local Notifications

Uses:

```js
SHOW_NOTIFICATION
```

Supported actions:

- Dashboard alerts
- Care team notifications
- Vitals monitoring alerts

### 3. Push Notifications

Implements:

- `push`
- `notificationclick`

Ready for:

- Firebase Cloud Messaging (FCM)
- Any Web Push provider

---

## State Management

Using Zustand.

Project stores:

```text
src/store/
├── authStore.ts
├── patientStore.ts
└── notificationStore.ts
```

### authStore

Manages:

- User session
- Auth state
- Login/logout
- Init listener

### patientStore

Manages:

- Patient data
- Filters
- Selected patient
- View mode

### notificationStore

Manages:

- Notifications feed
- Permission state
- Service worker initialization

---

## Why Zustand?

- Lightweight
- Minimal boilerplate
- Easy testing
- Simpler than Redux for this scale
- Fast selectors

---

## Project Structure

```text
src/
├── App.tsx
├── main.tsx
├── components/
│   ├── auth/
│   ├── common/
│   ├── layout/
│   └── patients/
├── data/
├── hooks/
├── pages/
├── services/
├── store/
├── styles/
├── types/
└── utils/
```

---

## Architecture Decisions

### Pages stay thin

Pages only compose UI and connect stores.

### Services isolate side effects

Examples:

- Firebase
- Notifications API

This makes provider swapping easy.

### Shared UI primitives

Reusable components inside:

```text
components/common
```

### Domain-specific UI separation

Example:

```text
components/patients
```

Helps scale into micro-frontends.

---

## Performance Optimizations

- Route-level lazy loading
- Vite manual chunk splitting
- CSS Modules
- Memoized derivations
- Stable store selectors
- Service worker caching
- Production source maps

---

## Forward-looking Improvements

### Micro-frontend ready

The domain boundaries support Module Federation.

### Design system ready

Design tokens and UI primitives can evolve into Storybook.

### Pluggable auth providers

Can add:

- Google Auth
- SSO
- Magic Link

without changing UI logic.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | Type-check only |

---

## Browser Support

### Fully Supported

- Chromium
- Google Chrome
- Microsoft Edge
- Firefox

### Supported with limitations

- Safari  
  (Push notifications require user interaction)

---

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand
- Firebase Auth
- Recharts
- CSS Modules
- Service Workers

---

## Future Integrations

- Firebase Cloud Messaging
- Web Push APIs
- Storybook
- Module Federation
- SSO providers

---

## License

This project was built as a frontend technical assignment for demonstration purposes.
