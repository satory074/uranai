# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # http://localhost:5173/uranai/  (basePath is /uranai/, not /)
npm run build    # tsc -b && vite build — TypeScript strict, must be 0 errors
npm run preview  # Serve dist/ locally to validate the production bundle
npm run lint     # ESLint flat config (eslint.config.js)
```

There are no automated tests. Verify changes by running `npm run build`, then exercising each affected fortune via the unified Home form in the browser.

## Deploy pipeline

Pushing to `main` triggers `.github/workflows/deploy.yml` (build → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`) and publishes to https://satory074.github.io/uranai/.

- `vite.config.ts` has `base: '/uranai/'` — if the repo is renamed, update both the `base` and the production URL together.
- HashRouter is intentional — it sidesteps the GitHub Pages SPA-refresh-404 problem entirely. Do not switch to BrowserRouter without also adding a 404.html fallback.

## Architecture

The entire app is a **single page**. `src/pages/Home.tsx` collects 生年月日 (必須) と 姓名 (任意) in one form, then renders results from all 7 fortunes inline. Routing is degenerate — only the `/` index route exists in `src/main.tsx`. HashRouter is kept in case a user reloads on a stale hash URL like `/#/astrology` from a pre-refactor bookmark.

`src/pages/` contains only `Home.tsx`. Older per-fortune pages were merged into Home and removed. **`README.md` is stale** — it still lists 8 fortunes (including the removed `tarot-one`), shows per-fortune `pages/` files, and references a non-existent `PageHero` component. Treat CLAUDE.md as the source of truth and do not sync edits back to README without rewriting it.

Each fortune is a self-contained module under `src/fortunes/<id>/`:

- `data.ts` / `cards.ts` / `signs.ts` / `stems.ts` / `stars.ts` — static data (types, templates, lookup tables)
- `engine.ts` — pure function `(input) => FortuneResult` (the shared shape from `src/fortunes/types.ts`)

`Home.tsx` calls each engine in order and renders each result through `FortuneResultView`. For tarot-three, each `<TarotCard />` is passed via `FortuneResultView`'s `sectionPrefix` prop so each row pairs one card with its 過去/現在/未来 interpretation.

The seedHint passed to `drawThree` is derived from the user's input (`${year}-${month}-${day}|${sei}${mei}`) so the same person sees the same cards on every visit.

Each `<FortuneBlock>` is **collapsed by default** with a「結果を見る」/「閉じる」button in its header. Per-block visibility is held in `expanded` state on `Home.tsx`. Clicking a `<FortuneDigest>` chip calls `reveal(id)` which both sets `expanded[id]=true` and `requestAnimationFrame`-defers a `scrollIntoView` so the section is mounted before the scroll.

姓名は任意。両方が空のときは姓名判断 (`seimei`) と `omikuji` をスキップする。タロットは姓名が空でも生年月日のみをシードに描画する。

To add or modify a fortune: edit the engine + data, add a `<FortuneBlock>` section to `Home.tsx`, and add an entry to the `FORTUNES` catalog in `src/fortunes/types.ts` (the catalog provides displayName / emoji / accent for each block header). The `FortuneInfo` type no longer carries a `path` — there are no per-fortune routes.

### Result presentation layer

- `<FortuneDigest>` (`src/components/FortuneDigest.tsx`) sits at the top of the results page. It renders one chip per fortune (emoji + displayName + 1-line summary) and jumps to the corresponding `id="fortune-<id>"` block.
- **Use buttons + `scrollIntoView`, not anchor `href="#fortune-..."`**: HashRouter consumes URL hashes and would unmount the page.
- `src/components/resultDerive.ts` derives both the digest's 1-line summary (`deriveOneLiner`) and the keyword chips shown above each result title (`deriveHeadline`) from the existing `FortuneResult` fields. Engines return unchanged shapes; presentation choices live entirely in this helper.
- `<FortuneBlock>` in `Home.tsx` carries `scroll-mt-6 md:scroll-mt-56` so the sticky digest does not occlude jumped-to blocks on desktop.

### Reveal animations (`src/index.css`)

「結果を見る」を押した瞬間の演出は **CSS アニメーションのみ**で実装している (motion/framer-motion は導入していない)。トークンとキーフレームは `src/index.css` に集約:

- `@theme` の `--ease-emphasized / --ease-overshoot / --ease-anticipate / --dur-windup / --dur-flip / --dur-settle / --reveal-stagger` がチューニング窓口。
- `.reveal-block` — `<FortuneBlock>` が展開された時に中身全体に乗せる fade-up + overshoot scale (Home.tsx)。
- `.reveal-child` — `FortuneResultView` 内の主要セクション (header / summary / lucky / sections / details) に乗せ、`style={{ '--reveal-i': i }}` でインデックスを渡してスタガーする (CSSProperties キャストが必要)。
- `.card-scene` / `.card-flipper` / `.card-orient` — `TarotCard` の 3D フリップは **3 レイヤー × 3 アニメ** で「ためらいの揺れ → ドラマチックなめくり → 着地後に正/逆を遅れて確定」のドキドキ演出を作る:
  - `.card-scene` (`perspective: 1400px`) に `card-wobble` (600ms) — フリップ前にカードが ±1.5°/-2px で 1 回だけ揺れる。perspective プロパティと transform プロパティは別軸なので衝突しない。
  - `.card-flipper` (`transform-style: preserve-3d`、`backface-visibility: hidden`) に `card-flip` (940ms / `--ease-emphasized`) — `rotateY(-12deg)` でためる → ピーク 96° / `translateZ(3em)` で高くめくり上げ → 198° まで行きすぎてから 180° に戻る、5 ポイントのキーフレーム。
  - `.card-face-front` 内側の `.card-orient` ラッパーに `orient-upright` (600ms / `--ease-emphasized`) または `orient-reversed` (700ms / `--ease-overshoot`) — フリップ着地から 200ms ホールドした後、正位置は微ジッターで 0° に落ち着き、逆位置は冒頭で −8° に逡巡してから 192° → 180° へオーバーシュートで確定する。
  - `revealIndex` で 0/360/720ms スタガー。`reversed` は `.card-orient` の `data-reversed="true|false"` 属性で切り分け、フリップ軸と独立にアニメ化する (静的な inline rotate は廃止)。総再生時間は 3 枚で約 3.1 秒。
- `.reveal-button` — `Home.tsx` の「結果を見る/閉じる」ボタンに付く wind-up。`:active` 中だけ scale 0.96 + 金色シマー (`shimmer-sweep` キーフレーム + `::before`) が走る。
- `@media (prefers-reduced-motion: reduce)` で全アニメを `animation: none !important` にし、カードは `transform: rotateY(180deg)` 直結で前面静止。コンテンツは常に DOM に残るので非表示事故は起きない。

新しい占いを足す時は、追加の `reveal-child` ラベルや stagger 番号は不要 — `FortuneBlock` の `.reveal-block` が自動で全体を包むので、子要素が `FortuneResultView` 経由なら既存スタガーに自然に乗る。

### Other component caveats

- `src/components/DateInput.tsx` and `src/components/NameInput.tsx` are **currently unused** — `Home.tsx` builds its combined form inline. Files remain in the tree; do not import them by mistake.
- 占いの **件数と名前** は 3 か所にハードコードされており、占いを増減した際は `FORTUNES` カタログ (`src/fortunes/types.ts`) と合わせて全て手動更新する必要がある:
  1. `src/components/Layout.tsx` のフッター文 (「7種類の占いをお楽しみいただけます — おみくじ・タロット（3枚引き）・…」) — 件数 `{FORTUNES.length}` 部分のみ自動追従。
  2. `src/pages/Home.tsx` の入力フォーム見出し (「7つの占いを、ひと所で。」)。
  3. `index.html` の `<title>` (「うらない百貨 — 7種類の占いを楽しむ」)。

### Shared utilities (`src/lib/`)

- `seedRandom.ts` — `createRng(seed)` returns a deterministic mulberry32. Used by `omikuji` (date+name seed for "same day = same result") and `tarot` (per-draw seed for the shuffle).
- `julianDay.ts` — Gregorian → Julian Day Number (Fliegel–Van Flandern), then `dayStemBranch` / `yearStemBranch` derive the 60-cycle index. `risshunYear` applies the **Feb 4 cutoff** (Jan 1 – Feb 3 belongs to the previous year). All Eastern fortunes (`kyusei`, `shichu`, `sanmei`) must respect this cutoff.
- `kanjiStrokes.ts` — hardcoded **shinjitai** (新字体) stroke-count table for ~1600 common kanji + kana. Used only by `seimei`. Unknown chars are surfaced to the UI as "画数不明" rather than silently treated as 0.

### Calculation notes (intentionally simplified)

- This is an **entry-level "type diagnosis" tool**, not a serious命式. We deliberately stop at sun sign (no ASC/月星座), day stem only (no 月柱/時柱), 本命星 only (no 月命星/吉方位), year stem only for `sanmei`.
- 西洋占星術 boundaries are **fixed representative dates** (e.g. 牡羊座 = 3/21–4/19). The actual sun-longitude crossings shift by hours each year — we don't compute them.
- Stroke-count 流派 differences exist; we use shinjitai only and say so in the UI. Don't add per-school toggles without a clear product reason.

## Copyright / trademark constraints (load-bearing)

The project's selling point is that **all interpretive text is original** and avoids registered/流派-specific names. When editing data files:

- **Never** use the 算命学 十大主星 names: `貫索星 / 石門星 / 鳳閣星 / 調舒星 / 禄存星 / 司禄星 / 車騎星 / 牽牛星 / 龍高星 / 玉堂星`. The `sanmei` fortune uses a parallel-but-disjoint set: `樹星 / 苑星 / 暁星 / 灯星 / 巌星 / 野星 / 鋒星 / 玉星 / 河星 / 露星`.
- Tarot card images are inline SVG with abstract motifs in `src/components/TarotCard.tsx`. Do not copy Rider-Waite or any other published deck's composition, color palette, or symbolism.
- Result/interpretation text in `data.ts` files is hand-written for this project. Don't paste from fortune sites or books — even short phrases. Keep tone soft ("傾向"/"印象"), avoid 断定 ("絶対に"/"必ず").
- Do not add specific 流派 names, 占い師 names, or "〇〇式" framings.

## Tooling notes

- **Tailwind v4** uses `@tailwindcss/vite`. There is no `tailwind.config.{js,ts}` — theme tokens live in `@theme { ... }` inside `src/index.css`. The custom palette (`--color-ink/paper/mist/plum/gold/indigo`) is referenced through generated utility classes like `bg-paper`, `text-plum`, `bg-mist`.
- Package manager is **npm** for this project (the user's global rule prefers `uv` for Python; this repo is JS/TS, so npm applies).
- **TS strict gotchas** (errors at `npm run build`, silent at `npm run dev`):
  - `noUnusedLocals` / `noUnusedParameters` — unused imports/variables fail the build. Vite dev server doesn't enforce these, so always run `npm run build` before pushing.
  - `verbatimModuleSyntax` — type-only imports must use `import type { ... }`. Mixing values and types in one `import` requires the `type` modifier per specifier.
