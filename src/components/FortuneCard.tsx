import type { ReactNode } from 'react';
import type { FortuneInfo } from '../fortunes/types';
import { FortuneAboutPanel } from './FortuneAboutPanel';

type Props = {
  id: string;
  info: FortuneInfo;
  expanded: boolean;
  onToggle: () => void;
  aboutExpanded: boolean;
  onAboutToggle: () => void;
  children: ReactNode;
};

export function FortuneCard({
  id,
  info,
  expanded,
  onToggle,
  aboutExpanded,
  onAboutToggle,
  children,
}: Props) {
  return (
    <section id={id} className="mb-6 md:mb-8 scroll-mt-6 relative">
      <div className="surface-card-strong relative overflow-hidden p-5 pl-7 md:p-6 md:pl-9">
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${info.accent}`}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <span
              className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center text-2xl shrink-0 border border-border-hairline"
              aria-hidden
            >
              {info.emoji}
            </span>
            <div className="min-w-0">
              <h2 className="font-serif text-xl md:text-2xl text-ink leading-tight">
                {info.displayName}
              </h2>
              <p className="text-[11px] text-ink/55 mt-1 tracking-[0.15em]">
                {info.traditionalName}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={onAboutToggle}
              aria-expanded={aboutExpanded}
              aria-controls={`${id}-about`}
              className="reveal-button text-xs px-3.5 py-2 rounded-full border border-border-hairline text-ink/75 hover:bg-mist cursor-pointer"
            >
              {aboutExpanded ? '閉じる' : '占いについて'}
            </button>
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={expanded}
              aria-controls={`${id}-body`}
              className="reveal-button btn-plum text-sm px-5 py-2 rounded-full shadow-card hover:shadow-pop cursor-pointer"
            >
              {expanded ? '閉じる' : '結果を見る'}
            </button>
          </div>
        </div>
        <p className="text-sm text-ink/75 leading-relaxed pl-14 md:pl-16">
          {info.description}
        </p>
      </div>
      {aboutExpanded && (
        <FortuneAboutPanel id={info.id} panelId={`${id}-about`} />
      )}
      {expanded && (
        <div id={`${id}-body`} className="reveal-block" aria-live="polite">
          {children}
        </div>
      )}
    </section>
  );
}
