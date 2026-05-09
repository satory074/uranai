import type { ReactNode } from 'react';

export function PageHero({
  emoji,
  title,
  subtitle,
  children,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-12">
      <div className="text-center">
        <div className="text-5xl mb-3" aria-hidden>{emoji}</div>
        <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">{title}</h1>
        {subtitle && <p className="text-sm text-ink/60">{subtitle}</p>}
      </div>
      {children && <div className="mt-8">{children}</div>}
    </div>
  );
}
