interface Props {
  label?: string;
}

export function FullPageLoader({ label = 'Loading…' }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        background: 'var(--color-bg)',
        color: 'var(--color-text-muted)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-primary)',
          animation: 'btn-spin 0.8s linear infinite',
        }}
      />
      <span style={{ fontSize: 13 }}>{label}</span>
    </div>
  );
}
