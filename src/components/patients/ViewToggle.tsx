import { GridIcon, ListIcon } from '@/components/common/Icon';
import type { ViewMode } from '@/types';

interface Props {
  value: ViewMode;
  onChange: (m: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: Props) {
  return (
    <div className="segmented" role="group" aria-label="Patient view">
      <button
        type="button"
        className="segmented__btn"
        aria-pressed={value === 'grid'}
        onClick={() => onChange('grid')}
      >
        <GridIcon size={14} /> Grid
      </button>
      <button
        type="button"
        className="segmented__btn"
        aria-pressed={value === 'list'}
        onClick={() => onChange('list')}
      >
        <ListIcon size={14} /> List
      </button>
    </div>
  );
}
