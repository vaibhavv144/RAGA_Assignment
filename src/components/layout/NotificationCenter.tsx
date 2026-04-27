import { useNotificationStore } from '@/store/notificationStore';
import { CheckIcon, XIcon } from '@/components/common/Icon';
import { formatRelative } from '@/utils/format';
import styles from './NotificationCenter.module.css';

interface Props {
  onClose: () => void;
}

export function NotificationCenter({ onClose }: Props) {
  const items = useNotificationStore((s) => s.items);
  const permission = useNotificationStore((s) => s.permission);
  const requestPerm = useNotificationStore((s) => s.requestPermission);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const remove = useNotificationStore((s) => s.remove);

  return (
    <div role="dialog" aria-label="Notifications" className={styles.popover}>
      <div className={styles.head}>
        <strong>Notifications</strong>
        <button className={styles.linkBtn} onClick={markAllRead} disabled={items.length === 0}>
          Mark all read
        </button>
      </div>

      {permission !== 'granted' && permission !== 'unsupported' && (
        <div className={styles.permBanner}>
          <p>Enable browser notifications to get alerts for critical patients.</p>
          <button
            className="btn btn--primary btn--small"
            onClick={async () => {
              await requestPerm();
            }}
          >
            Enable
          </button>
        </div>
      )}

      <div className={styles.list} role="list">
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span aria-hidden="true">🔔</span>
            <p>No notifications yet</p>
            <small>Triggered alerts and system messages will appear here.</small>
          </div>
        ) : (
          items.map((n) => (
            <div
              role="listitem"
              key={n.id}
              className={`${styles.item} ${n.read ? styles.itemRead : ''}`}
            >
              <span className={`${styles.dot} ${styles[`dot${cap(n.level)}`]}`} aria-hidden="true" />
              <div className={styles.itemBody}>
                <div className={styles.itemTitle}>{n.title}</div>
                <div className={styles.itemText}>{n.body}</div>
                <div className={styles.itemTime}>{formatRelative(n.createdAt)}</div>
              </div>
              <button
                aria-label="Dismiss notification"
                className={styles.dismiss}
                onClick={() => remove(n.id)}
              >
                <XIcon size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className={styles.foot}>
        <button className={styles.linkBtn} onClick={onClose}>
          <CheckIcon size={14} /> Close
        </button>
      </div>
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
