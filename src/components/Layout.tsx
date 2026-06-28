import { Link, Outlet } from 'react-router';
import { FORTUNES } from '../fortunes/types';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col pb-12">
      <header className="border-b border-border-hairline bg-paper/85 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-3xl" aria-hidden>🌸</span>
            <div className="leading-tight">
              <div className="font-serif text-xl text-plum group-hover:text-ink transition">うらない百貨</div>
              <div className="type-eyebrow text-ink/60">URANAI HYAKKA</div>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-hairline mt-16 py-10 bg-surface-sunken/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 md:gap-12 mb-6">
            <div>
              <p className="type-eyebrow mb-3">CATALOG</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-ink/75">
                {FORTUNES.map((f) => (
                  <li key={f.id} className="inline-flex items-center gap-1">
                    <span aria-hidden>{f.emoji}</span>
                    <span>{f.displayName}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="type-eyebrow mb-3">NOTICE</p>
              <p className="text-xs text-ink/70 leading-relaxed">
                本サイトの占い結果はエンターテインメントであり、結果の正確性や効果を保証するものではありません。
                結果文・カード解釈・タイプ説明はすべてオリジナルです。
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-border-hairline text-[11px] text-ink/55 flex flex-wrap items-baseline justify-between gap-2">
            <span>© うらない百貨</span>
            <span>全 {FORTUNES.length} 種類の占い</span>
          </div>
        </div>
      </footer>

      {/* サイト間ナビ: 画面下端に常駐する控えめな逆リンクバー（→ satory074.com/apps） */}
      <nav
        aria-label="サイト間ナビゲーション"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border-hairline bg-paper/90 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-9 max-w-5xl items-center justify-center px-4">
          <a
            href="https://satory074.com/apps/"
            target="_blank"
            rel="noopener"
            aria-label="satory074 のほかのアプリ一覧を新しいタブで開く"
            className="inline-flex items-center gap-1 text-xs text-ink/70 transition-colors hover:text-plum"
          >
            satory074 のほかのアプリ <span aria-hidden>↗</span>
          </a>
        </div>
      </nav>
    </div>
  );
}
