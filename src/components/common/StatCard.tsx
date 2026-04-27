import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: ReactNode;
  delta?: { value: string; trend: 'up' | 'down' | 'flat' };
  hint?: string;
  icon?: ReactNode;
  accent?: 'teal' | 'blue' | 'amber' | 'rose';
}

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon,
  accent = 'teal',
}: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[`accent_${accent}`]}`}>
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.foot}>
        {delta && (
          <span className={`${styles.delta} ${styles[`delta_${delta.trend}`]}`}>
            {delta.trend === 'up' ? '▲' : delta.trend === 'down' ? '▼' : '•'} {delta.value}
          </span>
        )}
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    </div>
  );
}
