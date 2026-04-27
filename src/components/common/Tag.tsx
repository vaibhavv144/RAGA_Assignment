import type { ReactNode } from 'react';

interface TagProps {
  variant?: string;
  children: ReactNode;
}

export function Tag({ variant, children }: TagProps) {
  const className = variant ? `tag tag--${variant}` : 'tag';
  return <span className={className}>{children}</span>;
}
