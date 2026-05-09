import type { FortuneId } from '../fortunes/types';

export type DigestItem = {
  id: FortuneId;
  emoji: string;
  displayName: string;
  oneLiner: string;
  accent: string;
};

export function FortuneDigest({ items }: { items: DigestItem[] }) {
  return (
    <aside
      aria-label="占い結果ダイジェスト"
      className="bg-white/85 backdrop-blur rounded-2xl border border-amber-900/10 shadow-sm p-4 md:p-5 mb-8 md:sticky md:top-2 md:z-10"
    >
      <div className="flex items-baseline justify-between mb-3">
        <p className="text-[11px] tracking-[0.4em] text-plum">DIGEST</p>
        <p className="text-[11px] text-ink/50">タップで該当占いへ</p>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {items.map((it) => (
          <li key={it.id}>
            <button
              type="button"
              onClick={() => {
                document.getElementById(`fortune-${it.id}`)?.scrollIntoView({ block: 'start' });
              }}
              className="flex w-full h-full text-left rounded-lg overflow-hidden bg-mist/40 hover:bg-mist transition border border-amber-900/10 cursor-pointer"
            >
              <div className={`w-1 shrink-0 bg-gradient-to-b ${it.accent}`} aria-hidden />
              <div className="flex-1 min-w-0 px-3 py-2">
                <div className="flex items-center gap-1.5 text-[11px] text-ink/70 mb-0.5">
                  <span aria-hidden>{it.emoji}</span>
                  <span className="truncate">{it.displayName}</span>
                </div>
                <div className="text-sm font-medium text-ink leading-snug line-clamp-2">
                  {it.oneLiner}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
