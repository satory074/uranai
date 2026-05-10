// astrology / kyusei / shichu / sanmei が共有する一覧用カード。
// 11 個の narrative フィールド（catchphrase / summary / general / love / work /
// growth / shadow / luckyColor / luckyItem / advice）を縦に積んで表示する。

import { ColorSwatch } from '../ColorSwatch';

type Props = {
  badge?: string;        // 左肩のラベル（例: ♈ / 一白 / 甲 / 樹星）
  title: string;         // 見出し（例: 牡羊座）
  alias?: string;        // 英名・読み方（例: Aries / きのえ）
  meta?: string[];       // 追加メタ（例: ['火', '火星', '3/21〜4/19']）
  catchphrase: string;
  summary: string;
  general: string;
  love: string;
  work: string;
  growth: string;
  shadow: string;
  luckyColor: string;
  luckyItem: string;
  advice: string;
};

export function NarrativeCard(p: Props) {
  return (
    <article className="rounded-lg bg-mist/40 border border-amber-900/10 p-4 md:p-5">
      <header className="mb-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {p.badge && (
          <span className="inline-flex items-center justify-center min-w-7 px-2 py-0.5 rounded-full bg-paper border border-amber-900/15 text-plum font-serif text-sm">
            {p.badge}
          </span>
        )}
        <h4 className="font-serif text-base md:text-lg text-ink leading-tight">{p.title}</h4>
        {p.alias && <span className="text-[11px] tracking-widest text-ink/50">{p.alias}</span>}
      </header>
      {p.meta && p.meta.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {p.meta.map((m) => (
            <span
              key={m}
              className="inline-block px-2 py-0.5 rounded-full bg-paper text-ink/70 text-[11px] border border-amber-900/10"
            >
              {m}
            </span>
          ))}
        </div>
      )}
      <p className="text-sm font-semibold text-plum mb-2 leading-relaxed">{p.catchphrase}</p>
      <p className="text-sm text-ink/85 mb-3 leading-relaxed">{p.summary}</p>
      <dl className="text-xs text-ink/80 space-y-2">
        <Field label="ふだんの傾向" body={p.general} />
        <Field label="恋愛・関係" body={p.love} />
        <Field label="仕事・活躍場面" body={p.work} />
        <Field label="伸びしろ" body={p.growth} />
        <Field label="気をつけたい場面" body={p.shadow} />
      </dl>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <MiniHighlight label="ラッキーカラー" value={p.luckyColor} swatch />
        <MiniHighlight label="ラッキーアイテム" value={p.luckyItem} />
        <MiniHighlight label="ひとこと" value={p.advice} />
      </div>
    </article>
  );
}

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid grid-cols-[6.5em_1fr] gap-2">
      <dt className="text-ink/55 leading-relaxed">{label}</dt>
      <dd className="text-ink/85 leading-relaxed">{body}</dd>
    </div>
  );
}

function MiniHighlight({
  label,
  value,
  swatch,
}: {
  label: string;
  value: string;
  swatch?: boolean;
}) {
  return (
    <div className="rounded bg-paper border border-amber-900/10 px-3 py-2">
      <div className="text-[9px] tracking-widest text-plum/70 uppercase mb-0.5">{label}</div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-ink leading-snug">
        {swatch && <ColorSwatch name={value} size="sm" />}
        <span>{value}</span>
      </div>
    </div>
  );
}
