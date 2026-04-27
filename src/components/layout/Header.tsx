import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { BellIcon, LogoutIcon } from '@/components/common/Icon';
import { NotificationCenter } from './NotificationCenter';
import styles from './Header.module.css';

export function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const unreadCount = useNotificationStore((s) => s.items.filter((n) => !n.read).length);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickAway);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClickAway);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <header className={`app-shell__header ${styles.header}`}>
      <div className={styles.inner}>
        <div className={styles.greeting}>
          <span className={styles.eyebrow}>Welcome back</span>
          <span className={styles.name}>{user?.displayName || user?.email || 'Clinician'}</span>
        </div>

        <div className={styles.actions}>
          <div className={styles.bellWrap} ref={popoverRef}>
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <BellIcon size={18} />
              {unreadCount > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {open && <NotificationCenter onClose={() => setOpen(false)} />}
          </div>

          <div className={styles.user}>
            <Avatar
              name={user?.displayName || user?.email || '??'}
              color="#0d9488"
              size={34}
            />
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user?.displayName || 'Clinician'}</span>
              <span className={styles.userRole}>{user?.email}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            small
            leadingIcon={<LogoutIcon size={16} />}
            onClick={() => void logout()}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
