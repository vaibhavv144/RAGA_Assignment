import { useMemo, useState, type CSSProperties } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { usePatientStore } from '@/store/patientStore';
import { StatCard } from '@/components/common/StatCard';
import { Tag } from '@/components/common/Tag';
import {
  AnalyticsIcon,
  HeartPulseIcon,
  PatientsIcon,
} from '@/components/common/Icon';
import styles from './Analytics.module.css';

const DARK_TOOLTIP: CSSProperties = {
  background: 'rgba(15, 23, 42, 0.85)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 10,
  boxShadow: '0 10px 32px -12px rgba(0,0,0,0.6)',
  backdropFilter: 'blur(12px)',
  fontSize: 12,
  color: '#e2e8f0',
};

const RISK_COLOR: Record<string, string> = {
  low: '#4ade80',
  moderate: '#fbbf24',
  high: '#fb923c',
  critical: '#f87171',
};

const REVENUE = [
  { month: 'Nov', revenue: 184, target: 180 },
  { month: 'Dec', revenue: 196, target: 190 },
  { month: 'Jan', revenue: 208, target: 200 },
  { month: 'Feb', revenue: 215, target: 210 },
  { month: 'Mar', revenue: 232, target: 220 },
  { month: 'Apr', revenue: 248, target: 240 },
];

const SATISFACTION = [
  { week: 'W14', score: 4.4 },
  { week: 'W15', score: 4.5 },
  { week: 'W16', score: 4.3 },
  { week: 'W17', score: 4.6 },
];

type Range = '7d' | '30d' | '90d';

export function AnalyticsPage() {
  const patients = usePatientStore((s) => s.patients);
  const [range, setRange] = useState<Range>('30d');

  const departmentBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    patients.forEach((p) => map.set(p.department, (map.get(p.department) ?? 0) + 1));
    return Array.from(map, ([department, patients]) => ({ department, patients })).sort(
      (a, b) => b.patients - a.patients,
    );
  }, [patients]);

  const riskBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    patients.forEach((p) => map.set(p.riskLevel, (map.get(p.riskLevel) ?? 0) + 1));
    return ['low', 'moderate', 'high', 'critical']
      .map((k) => ({ name: k, value: map.get(k) ?? 0 }))
      .filter((d) => d.value > 0);
  }, [patients]);

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Analytics</h1>
          <p className="page__subtitle">
            Operational performance across departments, demand, and quality metrics.
          </p>
        </div>
        <div className="segmented" role="group" aria-label="Time range">
          {(['7d', '30d', '90d'] as Range[]).map((r) => (
            <button
              key={r}
              type="button"
              className="segmented__btn"
              aria-pressed={range === r}
              onClick={() => setRange(r)}
            >
              {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </header>

      <section className={styles.stats}>
        <StatCard
          label="Avg. occupancy"
          value="76%"
          delta={{ value: '+4 pts WoW', trend: 'up' }}
          icon={<HeartPulseIcon size={18} />}
          accent="teal"
        />
        <StatCard
          label="Avg. wait time"
          value="18 min"
          delta={{ value: '−2 min WoW', trend: 'up' }}
          icon={<AnalyticsIcon size={18} />}
          accent="blue"
        />
        <StatCard
          label="No-show rate"
          value="6.4%"
          delta={{ value: '+0.3 pts', trend: 'down' }}
          icon={<PatientsIcon size={18} />}
          accent="amber"
        />
        <StatCard
          label="Patient NPS"
          value="62"
          delta={{ value: '+5 vs Q1', trend: 'up' }}
          accent="rose"
        />
      </section>

      <section className={styles.gridTwo}>
        <article className="card card--padded">
          <header className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Revenue vs target</h2>
              <p className={styles.cardSubtitle}>Net revenue (₹ lakhs), past 6 months</p>
            </div>
            <Tag variant="active">{range}</Tag>
          </header>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={REVENUE} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={DARK_TOOLTIP}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                  cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }} />
                <Bar dataKey="target" fill="rgba(148,163,184,0.45)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="revenue" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card card--padded">
          <header className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Risk distribution</h2>
              <p className={styles.cardSubtitle}>Across the patient panel</p>
            </div>
          </header>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={riskBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={88}
                  paddingAngle={2}
                  stroke="rgba(15,23,42,0.6)"
                  strokeWidth={2}
                >
                  {riskBreakdown.map((d) => (
                    <Cell key={d.name} fill={RISK_COLOR[d.name]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={DARK_TOOLTIP}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }}
                  formatter={(v) => v.charAt(0).toUpperCase() + v.slice(1)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className={styles.gridTwo}>
        <article className="card card--padded">
          <header className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Department load</h2>
              <p className={styles.cardSubtitle}>Active patients per department</p>
            </div>
          </header>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart
                data={departmentBreakdown}
                layout="vertical"
                margin={{ top: 8, right: 16, left: 16, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                  horizontal={false}
                />
                <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="department"
                  width={130}
                  stroke="#cbd5e1"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={DARK_TOOLTIP}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                  cursor={{ fill: 'rgba(255,255,255,0.06)' }}
                />
                <Bar dataKey="patients" fill="#818cf8" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card card--padded">
          <header className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Patient satisfaction</h2>
              <p className={styles.cardSubtitle}>Average score over recent weeks</p>
            </div>
          </header>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={SATISFACTION} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
                <CartesianGrid
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis dataKey="week" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[3.5, 5]}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={DARK_TOOLTIP}
                  itemStyle={{ color: '#e2e8f0' }}
                  labelStyle={{ color: '#94a3b8' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.12)' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#c4b5fd"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#c4b5fd', stroke: '#0f172a', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>
    </div>
  );
}
