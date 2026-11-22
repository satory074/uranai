// dist/index.html の <div id="root"> に、入力前のホーム画面を事前描画した HTML を入れる。
// GPTBot / ClaudeBot などは JS を実行しないので、空の #root だと何のサイトか読めないため。
// 前提: `vite build` (dist/) と `vite build --ssr src/entry-server.tsx --outDir dist-ssr` が済んでいること。
// ブラウザ側は main.tsx の createRoot がこの HTML を丸ごと描き直す (hydrate はしない)。
import { readFileSync, writeFileSync } from 'node:fs';

const MARKER = '<!--app-html-->';
const htmlUrl = new URL('../dist/index.html', import.meta.url);
const { render } = await import(new URL('../dist-ssr/entry-server.js', import.meta.url).href);

const html = readFileSync(htmlUrl, 'utf8');
if (!html.includes(MARKER)) {
  console.error(`prerender: dist/index.html に ${MARKER} が無い (index.html の #root を確認)`);
  process.exit(1);
}

const app = render();
if (!app.includes('app-backlink-bar')) {
  console.error('prerender: 描画結果に app-backlink-bar が無い (Layout が描かれていない)');
  process.exit(1);
}

// 置換文字列に $ が混ざっても壊れないよう関数で渡す
writeFileSync(htmlUrl, html.replace(MARKER, () => app));
console.log(`prerender: dist/index.html に ${app.length} 文字の HTML を入れました`);
