import {
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, useMockAuth } from './firebase';
import type { AuthUser } from '@/types';

const MOCK_SESSION_KEY = 'healthplus.mockUser';

const DEMO_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@healthplus.io': {
    password: 'demo1234',
    user: {
      uid: 'demo-admin',
      email: 'admin@healthplus.io',
      displayName: 'Dr. Asha Menon',
      photoURL: null,
    },
  },
  'doctor@healthplus.io': {
    password: 'demo1234',
    user: {
      uid: 'demo-doctor',
      email: 'doctor@healthplus.io',
      displayName: 'Dr. Rohit Verma',
      photoURL: null,
    },
  },
};

function toAuthUser(u: User): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
  };
}

function readMockSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(MOCK_SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeMockSession(user: AuthUser | null): void {
  if (user) localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(MOCK_SESSION_KEY);
}

export async function login(email: string, password: string): Promise<AuthUser> {
  if (useMockAuth) {
    // Simulate network latency so the UI loading state is visible.
    await new Promise((r) => setTimeout(r, 600));
    const record = DEMO_USERS[email.toLowerCase()];
    if (!record || record.password !== password) {
      throw new Error('Invalid email or password.');
    }
    writeMockSession(record.user);
    return record.user;
  }

  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase auth is not configured.');
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return toAuthUser(cred.user);
  } catch (err) {
    throw new Error(translateFirebaseError(err));
  }
}

export async function logout(): Promise<void> {
  if (useMockAuth) {
    writeMockSession(null);
    return;
  }
  const auth = getFirebaseAuth();
  if (auth) await fbSignOut(auth);
}

/**
 * Subscribes to auth state. Returns unsubscribe.
 * Calls cb with the current user (or null) on every change, including initial state.
 */
export function subscribe(cb: (user: AuthUser | null) => void): () => void {
  if (useMockAuth) {
    cb(readMockSession());
    const onStorage = (e: StorageEvent) => {
      if (e.key === MOCK_SESSION_KEY) cb(readMockSession());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }
  const auth = getFirebaseAuth();
  if (!auth) {
    cb(null);
    return () => undefined;
  }
  return onAuthStateChanged(auth, (u) => cb(u ? toAuthUser(u) : null));
}

function translateFirebaseError(err: unknown): string {
  const code =
    typeof err === 'object' && err && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address is not valid.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and retry.';
    default:
      return err instanceof Error ? err.message : 'Could not sign you in.';
  }
}

export const demoCredentials = Object.entries(DEMO_USERS).map(([email, v]) => ({
  email,
  password: v.password,
  name: v.user.displayName ?? email,
}));
