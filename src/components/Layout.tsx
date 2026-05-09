import { Link, Outlet, useLocation } from 'react-router';
import { FORTUNES } from '../fortunes/types';

export function Layout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-amber-900/10 bg-paper/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-3xl">🌸</span>
            <div className="leading-tight">
              <div className="font-serif text-xl text-plum group-hover:text-rose-700 transition">うらない百貨</div>
              <div className="text-[11px] text-ink/60 tracking-wider">URANAI HYAKKA</div>
            </div>
          </Link>
          {!isHome && (
            <Link
              to="/"
              className="text-sm text-plum hover:underline"
            >
              ← 一覧へ戻る
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-amber-900/10 mt-12 py-8">
        <div className="max-w-5xl mx-auto px-4 text-xs text-ink/60 leading-relaxed">
          <p className="mb-2">
            8種類の占いをお楽しみいただけます — おみくじ・タロット（1枚／3枚）・名前運勢診断・星読み診断・九星タイプ診断・十干タイプ診断・東洋命式タイプ診断。
          </p>
          <p>
            本サイトの占い結果はエンターテインメントであり、結果の正確性や効果を保証するものではありません。
            結果文・カード解釈・タイプ説明はすべてオリジナルのテンプレートです。
          </p>
          <p className="mt-2 text-[10px] text-ink/40">© うらない百貨 / 全 {FORTUNES.length} 種類</p>
        </div>
      </footer>
    </div>
  );
}
