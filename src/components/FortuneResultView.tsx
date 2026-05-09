import type { FortuneResult } from '../fortunes/types';

export function FortuneResultView({ result }: { result: FortuneResult }) {
  return (
    <article className="bg-white/80 backdrop-blur rounded-2xl border border-amber-900/10 shadow-sm p-6 md:p-8 my-6">
      <header className="border-b border-amber-900/10 pb-4 mb-5">
        {result.subtitle && (
          <p className="text-xs text-plum tracking-widest mb-2">{result.subtitle}</p>
        )}
        <h2 className="font-serif text-2xl md:text-3xl text-ink leading-tight">{result.title}</h2>
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

      <p className="text-base leading-relaxed mb-5">{result.summary}</p>

      <div className="space-y-4">
        {result.sections.map((s, i) => (
          <section key={i} className="border-l-2 border-amber-300 pl-4">
            <h3 className="font-serif text-base text-plum mb-1">{s.title}</h3>
            <p className="text-sm leading-relaxed text-ink/80 whitespace-pre-wrap">{s.body}</p>
          </section>
        ))}
      </div>

      {(result.luckyColor || result.luckyItem || result.advice) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {result.luckyColor && (
            <Box label="ラッキーカラー" value={result.luckyColor} />
          )}
          {result.luckyItem && (
            <Box label="ラッキーアイテム" value={result.luckyItem} />
          )}
          {result.advice && (
            <Box label="今日のひとこと" value={result.advice} />
          )}
        </div>
      )}

      {result.meta && Object.keys(result.meta).length > 0 && (
        <details className="mt-6 text-xs text-ink/50">
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

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-mist/60 px-4 py-3">
      <div className="text-[10px] tracking-widest text-ink/50 mb-1">{label}</div>
      <div className="text-sm font-medium text-ink">{value}</div>
    </div>
  );
}
