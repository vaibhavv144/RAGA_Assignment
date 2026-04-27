import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { TextField } from '@/components/common/TextField';
import { Button } from '@/components/common/Button';
import { HeartPulseIcon } from '@/components/common/Icon';
import { useMockAuth } from '@/services/firebase';
import { demoCredentials } from '@/services/auth.service';
import styles from './Login.module.css';

interface FieldErrors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 6) errors.password = 'Use at least 6 characters.';
  return errors;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const isAuthenticated = useAuthStore((s) => s.status === 'authenticated');
  const login = useAuthStore((s) => s.login);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState(useMockAuth ? 'admin@healthplus.io' : '');
  const [password, setPassword] = useState(useMockAuth ? 'demo1234' : '');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);

  // Already signed in — bounce to wherever the user was headed.
  useEffect(() => {
    if (bootstrapped && isAuthenticated) {
      const redirectTo =
        (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    }
  }, [bootstrapped, isAuthenticated, location.state, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const fieldErrors = validate(email, password);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string } | null)?.from || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch {
      // Error is set in the store; UI displays it. Avoid crashing the form.
    }
  };

  const onChange =
    (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      if (error) clearError();
      setter(e.target.value);
      if (touched) {
        const next = validate(
          setter === setEmail ? e.target.value : email,
          setter === setPassword ? e.target.value : password,
        );
        setErrors(next);
      }
    };

  const submitting = status === 'loading';

  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            <HeartPulseIcon size={22} />
          </span>
          <div>
            <div className={styles.brandName}>HealthPlus</div>
            <div className={styles.brandTag}>Operations Cloud</div>
          </div>
        </div>

        <h1 className={styles.title}>Sign in to your workspace</h1>
        <p className={styles.subtitle}>
          Manage patients, monitor analytics, and stay on top of clinical alerts.
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextField
            label="Work email"
            type="email"
            autoComplete="email"
            placeholder="you@clinic.com"
            value={email}
            onChange={onChange(setEmail)}
            error={errors.email}
            disabled={submitting}
            required
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={onChange(setPassword)}
            error={errors.password}
            disabled={submitting}
            required
          />

          {error && (
            <div role="alert" className="alert alert--error">
              {error}
            </div>
          )}

          <Button type="submit" loading={submitting} disabled={submitting} className={styles.submit}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {useMockAuth && (
          <div className={styles.demoBox}>
            <div className={styles.demoTitle}>Demo accounts (mock auth)</div>
            <ul className={styles.demoList}>
              {demoCredentials.map((c) => (
                <li key={c.email}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(c.email);
                      setPassword(c.password);
                      setErrors({});
                    }}
                  >
                    <strong>{c.name}</strong>
                    <span>{c.email}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className={styles.demoHint}>
              Set <code>VITE_USE_MOCK_AUTH=false</code> with Firebase config to use real auth.
            </p>
          </div>
        )}
      </div>

      <aside className={styles.aside} aria-hidden="true">
        <div className={styles.asideContent}>
          <span className={styles.asideEyebrow}>Trusted by 40+ clinics</span>
          <h2 className={styles.asideHeadline}>
            Unified patient operations for modern healthcare teams.
          </h2>
          <ul className={styles.asideList}>
            <li>360° patient view with clinical risk scoring</li>
            <li>Real-time alerts via push notifications</li>
            <li>Analytics across departments and physicians</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
