import { useMemo, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { usePatientStore } from '@/store/patientStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/common/Button';
import { Tag } from '@/components/common/Tag';
import { Avatar } from '@/components/common/Avatar';
import {
  AnalyticsIcon,
  BellIcon,
  ChevronRightIcon,
  HeartPulseIcon,
  PatientsIcon,
} from '@/components/common/Icon';
import { formatDate } from '@/utils/format';
import styles from './Dashboard.module.css';

const DARK_TOOLTIP: CSSProperties = {
  background: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 10,
  boxShadow: '0 10px 32px -12px rgba(0,0,0,0.6)',
  backdropFilter: 'blur(12px)',
  fontSize: 12,
  color: '#e2e8f0',
};

const ADMISSION_TREND = [
  { day: 'Mon', admissions: 28, discharges: 18 },
  { day: 'Tue', admissions: 32, discharges: 22 },
  { day: 'Wed', admissions: 30, discharges: 25 },
  { day: 'Thu', admissions: 41, discharges: 28 },
  { day: 'Fri', admissions: 38, discharges: 30 },
  { day: 'Sat', admissions: 24, discharges: 20 },
  { day: 'Sun', admissions: 19, discharges: 16 },
];

export function DashboardPage() {
  const patients = usePatientStore((s) => s.patients);
  const user = useAuthStore((s) => s.user);
  const pushNotification = useNotificationStore((s) => s.push);

  const stats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter((p) => p.status === 'active').length;
    const admitted = patients.filter((p) => p.status === 'admitted').length;
    const critical = patients.filter((p) => p.riskLevel === 'critical').length;
    return { total, active, admitted, critical };
  }, [patients]);

  const upcoming = useMemo(
    () =>
      patients
        .filter((p) => p.nextAppointment)
        .sort(
          (a, b) =>
            new Date(a.nextAppointment as string).getTime() -
            new Date(b.nextAppointment as string).getTime(),
        )
        .slice(0, 5),
    [patients],
  );

  const criticalQueue = useMemo(
    () => patients.filter((p) => p.riskLevel === 'critical' || p.riskLevel === 'high').slice(0, 4),
    [patients],
  );

  const triggerCriticalAlert = () => {
    void pushNotification({
      title: 'Critical patient escalation',
      body: `${criticalQueue[0]?.name ?? 'Patient'} requires immediate attention in ${
        criticalQueue[0]?.department ?? 'ICU'
      }.`,
      level: 'critical',
    });
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">
            Hello, {user?.displayName?.split(' ')[1] ?? 'Doctor'} 👋
          </h1>
          <p className="page__subtitle">
            Here's what's happening across your facilities today.
          </p>
        </div>
        <div className={styles.headerActions}>
          <Button
            variant="ghost"
            small
            leadingIcon={<BellIcon size={16} />}
            onClick={triggerCriticalAlert}
          >
            Trigger demo alert
          </Button>
          <Link to="/patients">
            <Button small trailingIcon={<ChevronRightIcon size={16} />}>
              View patients
            </Button>
          </Link>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          label="Patients in system"
          value={stats.total}
          delta={{ value: '+8 this week', trend: 'up' }}
          icon={<PatientsIcon size={18} />}
          accent="teal"
        />
        <StatCard
          label="Currently admitted"
          value={stats.admitted}
          delta={{ value: '+2 vs yesterday', trend: 'up' }}
          hint="Across 4 departments"
          icon={<HeartPulseIcon size={18} />}
          accent="blue"
        />
        <StatCard
          label="Active outpatients"
          value={stats.active}
          delta={{ value: '−3 vs yesterday', trend: 'down' }}
          icon={<AnalyticsIcon size={18} />}
          accent="amber"
        />
        <StatCard
          label="Critical risk"
          value={stats.critical}
          delta={{ value: 'Needs review', trend: 'flat' }}
          hint="Auto-escalated"
          icon={<BellIcon size={18} />}
          accent="rose"
        />
      </section>

      <section className={styles.gridTwo}>
        <article className="card card--padded">
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Admissions vs discharges</h2>
              <p className={styles.cardSubtitle}>Last 7 days, all departments</p>
            </div>
            <Tag variant="active">Live</Tag>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer>
              <AreaChart data={ADMISSION_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="adm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.08)"
                  vertical={false}
                  strokeDasharray="3 3"
                />
                <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                />
                <Area
                  type="monotone"
                  dataKey="admissions"
                  stroke="#2dd4bf"
                  strokeWidth={2}
                  fill="url(#adm)"
                />
                <Area
                  type="monotone"
                  dataKey="discharges"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="url(#dis)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card card--padded">
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Critical watchlist</h2>
              <p className={styles.cardSubtitle}>High-risk patients needing review</p>
            </div>
            <Link to="/patients" className={styles.cardLink}>
              See all
            </Link>
          </div>

          <ul className={styles.watchList}>
            {criticalQueue.map((p) => (
              <li key={p.id} className={styles.watchItem}>
                <Avatar name={p.name} color={p.avatarColor} size={36} />
                <div className={styles.watchBody}>
                  <div className={styles.watchName}>{p.name}</div>
                  <div className={styles.watchMeta}>
                    {p.primaryCondition} · {p.department}
                  </div>
                </div>
                <Tag variant={p.riskLevel}>{p.riskLevel}</Tag>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="card card--padded">
        <div className={styles.cardHead}>
          <div>
            <h2 className={styles.cardTitle}>Upcoming appointments</h2>
            <p className={styles.cardSubtitle}>Next 5 scheduled visits</p>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Department</th>
                <th>Physician</th>
                <th>Visit date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.patientCell}>
                      <Avatar name={p.name} color={p.avatarColor} size={30} />
                      <div>
                        <div className={styles.patientName}>{p.name}</div>
                        <div className={styles.patientId}>{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.department}</td>
                  <td>{p.attendingPhysician}</td>
                  <td>{formatDate(p.nextAppointment)}</td>
                  <td>
                    <Tag variant={p.status}>{p.status}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
