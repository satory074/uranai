// ビルド時の事前描画専用 (scripts/prerender.mjs が Node で呼ぶ)。ブラウザには載らない。
// 入力前のホーム画面をそのまま HTML にして、JS を実行しないクローラーにも本文が読めるようにする。
import { StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { AppRoutes } from './AppRoutes';
import { PrerenderContext } from './prerenderContext';

export function render(): string {
  // BASE_URL は vite.config.ts の base ('/uranai/')。ロゴのリンクが公開 URL のトップ (末尾 / 付き) を
  // 指すように basename にも末尾 / を残す (外すと '/uranai' になり GitHub Pages で 301 になる)。
  // ブラウザでは HashRouter が '#/' に描き直す。
  const base = import.meta.env.BASE_URL;
  return renderToStaticMarkup(
    <StrictMode>
      <PrerenderContext value={true}>
        <StaticRouter location={base} basename={base}>
          <AppRoutes />
        </StaticRouter>
      </PrerenderContext>
    </StrictMode>,
  );
}
