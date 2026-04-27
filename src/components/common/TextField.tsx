import { forwardRef, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, ...rest },
  ref,
) {
  const inputId = id ?? `tf-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label className="label" htmlFor={inputId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        className="input"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <span id={`${inputId}-err`} className="field-error">
          {error}
        </span>
      ) : hint ? (
        <span id={`${inputId}-hint`} style={{ color: 'var(--color-text-faint)', fontSize: 12 }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
});
