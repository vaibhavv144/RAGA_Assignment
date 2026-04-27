import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'subtle' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  small?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  small = false,
  leadingIcon,
  trailingIcon,
  loading = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, small ? 'btn--small' : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button {...rest} disabled={disabled || loading} className={classes}>
      {loading ? <Spinner /> : leadingIcon}
      <span>{children}</span>
      {!loading && trailingIcon}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 14,
        height: 14,
        border: '2px solid rgba(255,255,255,0.45)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        display: 'inline-block',
        animation: 'btn-spin 0.7s linear infinite',
      }}
    />
  );
}
