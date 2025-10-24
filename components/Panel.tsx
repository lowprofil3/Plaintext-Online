import type { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function Panel({ title, subtitle, children, className }: PanelProps) {
  const baseClass = 'rounded-lg border border-[#2a2a2a] bg-[#161616] p-6';
  const composedClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <section className={composedClass}>
      {(title || subtitle) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          {title ? (
            <h2 className="text-xs font-medium uppercase tracking-[0.3em] text-[#9a9a9a]">{title}</h2>
          ) : (
            <span />
          )}
          {subtitle}
        </div>
      )}
      <div className={title || subtitle ? 'mt-5' : undefined}>{children}</div>
    </section>
  );
}
