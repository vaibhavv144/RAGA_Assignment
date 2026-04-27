import { useEffect } from 'react';
import { Avatar } from '@/components/common/Avatar';
import { Tag } from '@/components/common/Tag';
import { Button } from '@/components/common/Button';
import { BellIcon, XIcon } from '@/components/common/Icon';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDate } from '@/utils/format';
import type { Patient } from '@/types';
import styles from './PatientDetailDrawer.module.css';

interface Props {
  patient: Patient | null;
  onClose: () => void;
}

export function PatientDetailDrawer({ patient, onClose }: Props) {
  const push = useNotificationStore((s) => s.push);

  useEffect(() => {
    if (!patient) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [patient, onClose]);

  if (!patient) return null;

  const triggerAlert = () =>
    push({
      title: `Update on ${patient.name}`,
      body: `Care team has been notified — ${patient.primaryCondition} (${patient.department}).`,
      level: patient.riskLevel === 'critical' ? 'critical' : 'info',
    });

  return (
    <div className={styles.scrim} onClick={onClose}>
      <aside
        role="dialog"
        aria-label={`Details for ${patient.name}`}
        className={styles.drawer}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <Avatar name={patient.name} color={patient.avatarColor} size={48} />
            <div>
              <h2 className={styles.name}>{patient.name}</h2>
              <div className={styles.idLine}>
                {patient.id} · {patient.age}y · {patient.gender} · Blood {patient.bloodGroup}
              </div>
              <div className={styles.tags}>
                <Tag variant={patient.status}>{patient.status}</Tag>
                <Tag variant={patient.riskLevel}>{patient.riskLevel} risk</Tag>
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} aria-label="Close" onClick={onClose}>
            <XIcon size={16} />
          </button>
        </header>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Care plan</h3>
          <dl className={styles.list}>
            <div>
              <dt>Primary condition</dt>
              <dd>{patient.primaryCondition}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{patient.department}</dd>
            </div>
            <div>
              <dt>Attending physician</dt>
              <dd>{patient.attendingPhysician}</dd>
            </div>
            <div>
              <dt>Last visit</dt>
              <dd>{formatDate(patient.lastVisit)}</dd>
            </div>
            <div>
              <dt>Next appointment</dt>
              <dd>{formatDate(patient.nextAppointment)}</dd>
            </div>
          </dl>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Contact</h3>
          <dl className={styles.list}>
            <div>
              <dt>Email</dt>
              <dd>{patient.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{patient.phone}</dd>
            </div>
          </dl>
        </section>

        <footer className={styles.foot}>
          <Button variant="ghost" small onClick={onClose}>
            Close
          </Button>
          <Button small leadingIcon={<BellIcon size={14} />} onClick={triggerAlert}>
            Notify care team
          </Button>
        </footer>
      </aside>
    </div>
  );
}
