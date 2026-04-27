import { initials } from '@/utils/format';

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = '#0d9488', size = 36 }: AvatarProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        color: '#fff',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: Math.max(11, Math.floor(size * 0.38)),
        flexShrink: 0,
        letterSpacing: 0.5,
      }}
    >
      {initials(name) || '?'}
    </span>
  );
}
