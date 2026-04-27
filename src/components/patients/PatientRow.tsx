import { Avatar } from '@/components/common/Avatar';
import { Tag } from '@/components/common/Tag';
import { formatDate } from '@/utils/format';
import type { Patient } from '@/types';
import styles from './PatientRow.module.css';

interface Props {
  patient: Patient;
  onSelect: (id: string) => void;
}

export function PatientRow({ patient, onSelect }: Props) {
  return (
    <tr
      className={styles.row}
      tabIndex={0}
      onClick={() => onSelect(patient.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(patient.id);
        }
      }}
    >
      <td>
        <div className={styles.cell}>
          <Avatar name={patient.name} color={patient.avatarColor} size={32} />
          <div>
            <div className={styles.name}>{patient.name}</div>
            <div className={styles.id}>
              {patient.id} · {patient.age}y · {patient.gender}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.condition}>{patient.primaryCondition}</div>
        <div className={styles.muted}>{patient.department}</div>
      </td>
      <td>{patient.attendingPhysician}</td>
      <td>{formatDate(patient.lastVisit)}</td>
      <td>{formatDate(patient.nextAppointment)}</td>
      <td>
        <Tag variant={patient.riskLevel}>{patient.riskLevel}</Tag>
      </td>
      <td>
        <Tag variant={patient.status}>{patient.status}</Tag>
      </td>
    </tr>
  );
}
