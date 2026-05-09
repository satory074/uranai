import type { CSSProperties, ReactNode } from 'react';
import type { FortuneResult } from '../fortunes/types';

type Props = {
  result: FortuneResult;
  id?: string;
  headline?: string[];
  sectionPrefix?: (index: number) => ReactNode;
};

const stagger = (i: number): CSSProperties =>
  ({ ['--reveal-i']: i } as CSSProperties);

export function FortuneResultView({ result, id, headline, sectionPrefix }: Props) {
  const chips = headline?.filter(Boolean) ?? [];
  const hasLucky = Boolean(result.luckyColor || result.luckyItem || result.advice);

  return (
    <article
      id={id}
      className="bg-white/80 backdrop-blur rounded-2xl border border-amber-900/10 shadow-sm p-6 md:p-8 my-6"
    >
      <header className="reveal-child border-b border-amber-900/10 pb-4 mb-5" style={stagger(0)}>
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {chips.map((c) => (
              <span
                key={c}
                className="inline-block px-2.5 py-0.5 rounded-full bg-mist text-plum text-xs font-medium tracking-wide"
              >
                {c}
              </span>
            ))}
          </div>
        ) : (
          result.subtitle && (
            <p className="text-xs text-plum tracking-widest mb-2">{result.subtitle}</p>
          )
        )}
        <h2 className="font-serif text-2xl md:text-3xl text-ink leading-tight">{result.title}</h2>
        {chips.length > 0 && result.subtitle && (
          <p className="text-xs text-ink/55 mt-1.5">{result.subtitle}</p>
        )}
        {typeof result.score === 'number' && (
          <div className="mt-3 flex items-center gap-3">
            <div className="text-xs text-ink/60">総合スコア</div>
            <div className="flex-1 max-w-[200px] h-2 rounded-full bg-mist overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-rose-400"
                style={{ width: `${result.score}%` }}
              />
            </div>
            <div className="font-serif text-lg text-plum">{result.score}</div>
          </div>
        )}
      </header>

      <p className="reveal-child text-base md:text-lg leading-relaxed text-ink mb-5" style={stagger(1)}>{result.summary}</p>

      {hasLucky && (
        <div className="reveal-child mb-6 grid grid-cols-1 md:grid-cols-3 gap-2.5" style={stagger(2)}>
          {result.luckyColor && <Highlight label="ラッキーカラー" value={result.luckyColor} />}
          {result.luckyItem && <Highlight label="ラッキーアイテム" value={result.luckyItem} />}
          {result.advice && <Highlight label="今日のひとこと" value={result.advice} />}
        </div>
      )}

      <div className="reveal-child space-y-3" style={stagger(3)}>
        {result.sections.map((s, i) => (
          <SectionCard key={i} title={s.title} body={s.body} prefix={sectionPrefix?.(i)} />
        ))}
      </div>

      {result.meta && Object.keys(result.meta).length > 0 && (
        <details className="reveal-child mt-6 text-xs text-ink/50" style={stagger(4)}>
          <summary className="cursor-pointer hover:text-ink/70">計算データを見る</summary>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {Object.entries(result.meta).map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-ink/50">{k}</dt>
                <dd className="text-ink/80">{v}</dd>
              </div>
            ))}
          </dl>
        </details>
      )}
    </article>
  );
}

function SectionCard({
  title,
  body,
  prefix,
}: {
  title: string;
  body: string;
  prefix?: ReactNode;
}) {
  const idx = body.indexOf('\n\n');
  const hasSplit = idx >= 0;
  const lede = hasSplit ? body.slice(0, idx) : body;
  const detail = hasSplit ? body.slice(idx + 2) : '';

  const inner = (
    <div>
      <h3 className="font-serif text-base text-plum mb-1.5">{title}</h3>
      <p className="text-sm font-semibold text-ink leading-relaxed whitespace-pre-wrap">{lede}</p>
      {detail && (
        <p className="mt-2 text-sm text-ink/75 leading-relaxed whitespace-pre-wrap">{detail}</p>
      )}
    </div>
  );

  return (
    <section className="rounded-lg bg-mist/40 border border-amber-900/5 p-4">
      {prefix ? (
        <div className="md:grid md:grid-cols-[auto_1fr] md:gap-5 md:items-start">
          <div className="flex justify-center md:justify-start mb-3 md:mb-0">{prefix}</div>
          {inner}
        </div>
      ) : (
        inner
      )}
    </section>
  );
}

function Highlight({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="rounded-lg bg-paper border border-amber-900/15 px-4 py-3">
      <div className="text-[10px] tracking-widest text-plum/70 mb-1 uppercase">{label}</div>
      <div className="text-sm font-medium text-ink leading-snug">{value}</div>
    </div>
  );
}
