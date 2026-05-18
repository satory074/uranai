import type { FortuneId, FortuneResult } from '../fortunes/types';

type Item = { id: FortuneId; result: FortuneResult };

type Props = {
  items: Item[];
  headlineFor: (id: FortuneId, result: FortuneResult) => string[];
};

const KEYWORD_PRIORITY: FortuneId[] = ['astrology', 'omikuji', 'kyusei', 'shichu', 'sanmei', 'seimei'];

export function SummaryCard({ items, headlineFor }: Props) {
  const scored = items
    .map((it) => it.result.score)
    .filter((s): s is number => typeof s === 'number');
  const avgScore = scored.length > 0
    ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
    : null;

  const byId = new Map(items.map((it) => [it.id, it.result]));
  const keywords: string[] = [];
  for (const id of KEYWORD_PRIORITY) {
    if (keywords.length >= 3) break;
    const r = byId.get(id);
    if (!r) continue;
    const heads = headlineFor(id, r);
    const first = heads.find((h) => h && !keywords.includes(h));
    if (first) keywords.push(first);
  }

  return (
    <section
      className="surface-card-strong px-6 py-6 md:px-8 md:py-7 mb-8"
      style={{ background: 'var(--color-surface-sunken)' }}
      aria-label="今日のまとめ"
    >
      <p className="type-eyebrow mb-3">今日の空気</p>
      <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
        {avgScore !== null && (
          <div className="flex items-baseline gap-3">
            <span className="type-display text-plum leading-none">{avgScore}</span>
            <span className="text-sm text-ink/65 font-serif">/ 100</span>
          </div>
        )}
        {keywords.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <li
                key={k}
                className="inline-block px-3 py-1 rounded-full bg-paper border border-border-hairline text-sm text-ink"
              >
                {k}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-ink/60 mt-4 leading-relaxed">
        ※ スコアは複数の占いの平均、キーワードは主要な占いから1つずつ抽出した今日の手触りです。
      </p>
    </section>
  );
}
