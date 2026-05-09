# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # http://localhost:5173/uranai/  (basePath is /uranai/, not /)
npm run build    # tsc -b && vite build — TypeScript strict, must be 0 errors
npm run preview  # Serve dist/ locally to validate the production bundle
npm run lint     # ESLint flat config (eslint.config.js)
```

There are no automated tests. Verify changes by running `npm run build`, then exercising the affected fortune via the unified Home form in the browser.

## Deploy pipeline

Pushing to `main` triggers `.github/workflows/deploy.yml` (build → `actions/upload-pages-artifact@v3` → `actions/deploy-pages@v4`) and publishes to https://satory074.github.io/uranai/.

- `vite.config.ts` has `base: '/uranai/'` — if the repo is renamed, update both the `base` and the production URL together.
- HashRouter is intentional — it sidesteps the GitHub Pages SPA-refresh-404 problem entirely. Do not switch to BrowserRouter without also adding a 404.html fallback.

## Architecture

The entire app is a **single page**: `src/pages/Home.tsx` collects 生年月日 (必須) と 姓名 (任意) in one form, then renders results from all 8 fortunes inline. Routing is degenerate — only the `/` index route exists in `src/main.tsx`. HashRouter is kept in case a user reloads on a stale hash URL like `/#/astrology` from a pre-refactor bookmark.

Each fortune is a self-contained module under `src/fortunes/<id>/`:

- `data.ts` / `cards.ts` / `signs.ts` / `stems.ts` / `stars.ts` — static data (types, templates, lookup tables)
- `engine.ts` — pure function `(input) => FortuneResult` (the shared shape from `src/fortunes/types.ts`)
- `Home.tsx` calls each engine in order and renders each result through `FortuneResultView`. Tarot 1枚引きはカードを記事の上に大きく置き、タロット3枚スプレッドは `FortuneResultView` の `sectionPrefix` props を使い「1行 = 1時間軸（過去／現在／未来）」でカード左・解釈右に並べて視覚的に対応付ける。 The seedHint passed to `drawOne`/`drawThree` is derived from the user's input (`${year}-${month}-${day}|${sei}${mei}`) so the same person sees the same cards on every visit.

結果ページ最上部の `<FortuneDigest>`（`src/components/FortuneDigest.tsx`）は、各占いの絵文字・表示名・1行サマリを持つチップを 8 個並べたダイジェスト一覧。チップは `<button>` + `scrollIntoView` で対応する `id="fortune-<id>"` のブロックへジャンプする（HashRouter と衝突するためアンカー `href="#..."` は使わない）。チップに表示する 1 行サマリと、各占い結果のヘッドラインキーワードチップは `src/components/resultDerive.ts` の `deriveOneLiner` / `deriveHeadline` で各エンジン出力から派生させる（エンジン側は変更不要）。

姓名は任意。両方が空のときは姓名判断 (`seimei`) と `omikuji` をスキップする。タロットは姓名が空でも生年月日のみをシードに描画する。

To add or modify a fortune: edit the engine + data, add a `<FortuneBlock>` section to `Home.tsx`, and add an entry to the `FORTUNES` catalog in `src/fortunes/types.ts` (the catalog provides displayName / emoji / accent for each block header). The `FortuneInfo` type no longer carries a `path` — there are no per-fortune routes.

`src/components/DateInput.tsx` and `src/components/NameInput.tsx` are **currently unused** — `Home.tsx` builds its combined form inline. The files are still in the tree; do not import them by mistake when adding new UI.

`src/components/Layout.tsx` のフッターには占い名を列挙したハードコード文字列 (「8種類の占いをお楽しみいただけます — おみくじ・タロット（1枚／3枚）・名前運勢診断・…」) が直書きされている。占いを増減した際は `FORTUNES` カタログだけでなくこの一文も更新する (件数 `{FORTUNES.length}` 部分は自動追従)。

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
