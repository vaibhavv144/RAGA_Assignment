import { Avatar } from '@/components/common/Avatar';
import { Tag } from '@/components/common/Tag';
import { ChevronRightIcon } from '@/components/common/Icon';
import { formatDate } from '@/utils/format';
import type { Patient } from '@/types';
import styles from './PatientCard.module.css';

interface Props {
  patient: Patient;
  onSelect: (id: string) => void;
}

export function PatientCard({ patient, onSelect }: Props) {
  return (
    <article
      className={`${styles.card} fade-in`}
      tabIndex={0}
      role="button"
      aria-label={`Open ${patient.name}`}
      onClick={() => onSelect(patient.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(patient.id);
        }
      }}
    >
      <header className={styles.head}>
        <Avatar name={patient.name} color={patient.avatarColor} size={44} />
        <div className={styles.identity}>
          <div className={styles.name}>{patient.name}</div>
          <div className={styles.id}>
            {patient.id} · {patient.age}y · {patient.gender}
          </div>
        </div>
        <Tag variant={patient.riskLevel}>{patient.riskLevel}</Tag>
      </header>

      <dl className={styles.meta}>
        <div>
          <dt>Condition</dt>
          <dd>{patient.primaryCondition}</dd>
        </div>
        <div>
          <dt>Department</dt>
          <dd>{patient.department}</dd>
        </div>
        <div>
          <dt>Physician</dt>
          <dd>{patient.attendingPhysician}</dd>
        </div>
        <div>
          <dt>Next visit</dt>
          <dd>{formatDate(patient.nextAppointment)}</dd>
        </div>
      </dl>

      <footer className={styles.foot}>
        <Tag variant={patient.status}>{patient.status}</Tag>
        <span className={styles.bg}>Blood {patient.bloodGroup}</span>
        <span className={styles.cta}>
          View <ChevronRightIcon size={14} />
        </span>
      </footer>
    </article>
  );
}
