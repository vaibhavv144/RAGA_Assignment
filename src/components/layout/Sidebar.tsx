import { NavLink } from 'react-router-dom';
import {
  AnalyticsIcon,
  DashboardIcon,
  HeartPulseIcon,
  PatientsIcon,
} from '@/components/common/Icon';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/analytics', label: 'Analytics', Icon: AnalyticsIcon },
  { to: '/patients', label: 'Patients', Icon: PatientsIcon },
];

export function Sidebar() {
  return (
    <aside className={`app-shell__sidebar ${styles.sidebar}`} aria-label="Primary navigation">
      <div className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          <HeartPulseIcon size={20} />
        </span>
        <div>
          <div className={styles.brandName}>HealthPlus</div>
          <div className={styles.brandTag}>Operations Cloud</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.foot}>
        <div className={styles.footTitle}>Need help?</div>
        <p className={styles.footText}>
          Browse the runbook or ping the on-call team in #healthplus-ops.
        </p>
      </div>
    </aside>
  );
}
