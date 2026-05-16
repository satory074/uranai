# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For the consolidated design language (color tokens, typography, motion, voice & tone, copyright constraints, do-not list), see [`docs/TONE_AND_MANNER.md`](docs/TONE_AND_MANNER.md). When CLAUDE.md and the design doc disagree, code is the tiebreaker.

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

### Fortune catalog (id → 入力 → 出力構造)

| id            | 入力                       | 出力の主要セクション         |
|---------------|----------------------------|-----------------------------|
| `omikuji`     | 姓名 (任意; 無ければ `'guest'` シード) | 6 ランク × 5 運勢のおみくじ |
| `tarot-three` | 生年月日 + 姓名 (シード)   | 過去 / 現在 / 未来 の 3 セクション (`drawn[]` も返す) |
| `seimei`      | 姓 + 名 (両方必要)         | 五格 (天/人/地/外/総) + 簡易解釈 |
| `astrology`   | 生年月日 + 今日の日付       | 太陽星座をラベルとして、今日のテーマ (summary) + 4 つの運勢 (全体/恋愛/仕事/健康) を日替わりで合成。性格判断パートは持たない |
| `kyusei`      | 生年月日 (立春切替)        | 本命星 1 セクション         |
| `shichu`      | 生年月日                   | 日干タイプ 1 セクション     |
| `sanmei`      | 生年月日 (立春切替)        | 独自10星 1 セクション       |

`FortuneResult` の共通形 (`src/fortunes/types.ts`):

```ts
type FortuneResult = {
  title: string;
  subtitle?: string;
  score?: number;             // 0–100、ヘッダーのバーに反映
  summary: string;            // 1〜2 文の総評
  sections: { title: string; body: string }[];  // body は \n\n でリード/詳細に分割される
  luckyColor?: string;
  luckyItem?: string;
  advice?: string;
  meta?: Record<string, string>;  // 「計算データを見る」<details> に表示
};
```

`Home.tsx` calls each engine in order and renders each result through `FortuneResultView`. For tarot-three, each `<TarotCard />` is passed via `FortuneResultView`'s `sectionPrefix` prop so each row pairs one card with its 過去/現在/未来 interpretation.

The seedHint passed to `drawThree` is derived from the user's input (`${year}-${month}-${day}|${sei}${mei}`) so the same person sees the same cards on every visit.

Each `<FortuneBlock>` のヘッダーには **2 つのトグルボタン** が並ぶ: 左に「占いについて」(占い解説 + 要素一覧パネル)、右に「結果を見る」(占いの結果)。両者は完全に独立した state で、開閉の順序は問わない。両方開いた場合は **about パネルが結果の上**に表示される。Per-block visibility は Home.tsx の `expanded` (結果) と `aboutExpanded` (解説) の 2 つに分かれ、どちらもフォーム再 submit 時に `{}` リセットされる。

姓名は任意。両方が空のときは姓名判断 (`seimei`) をスキップする。おみくじとタロットは姓名が空でも引ける ── タロットは生年月日をシードに、おみくじは今日の日付 (姓名なしの場合は `name='guest'` フォールバック) をシードに描画する。

To add or modify a fortune: edit the engine + data, add a `<FortuneBlock>` section to `Home.tsx`, and add an entry to the `FORTUNES` catalog in `src/fortunes/types.ts`. Every catalog entry needs `displayName` / `traditionalName` (subtitle) / `description` (1〜2 文の説明、折りたたみ時も常時表示される) / `emoji` / `accent` — all five are load-bearing in `FortuneBlock`'s header. The `FortuneInfo` type no longer carries a `path` — there are no per-fortune routes.

### Result presentation layer

- `src/components/resultDerive.ts` derives the keyword chips shown above each result title (`deriveHeadline`) from the existing `FortuneResult` fields. Engines return unchanged shapes; presentation choices live entirely in this helper.
- `<FortuneBlock>` のヘッダーは折りたたみ時も常時表示で、`emoji + displayName + traditionalName(小)` の見出し行の直下に `info.description` の段落 (`text-xs md:text-sm text-ink/70 ml-11`) を出して「これは何の占いか」を伝える。`{expanded && …}` の **外側**に置いてあるので折りたたみ・展開どちらでも見える。
- **ラッキーカラーには色見本を出す**: `<FortuneResultView>` の `Highlight` と `<NarrativeCard>` の `MiniHighlight` は `label === 'ラッキーカラー'` の枠だけ `<ColorSwatch name={value} />` (`src/components/ColorSwatch.tsx`) を文字の左に並べる。和色名 → hex のマップは `src/lib/japaneseColors.ts` (`JAPANESE_COLORS` + `resolveColor`)。複合色 (`'白・銀'` 等) は `・` で分割して半々のグラデーション円を描く。マップに無い名前は swatch 非表示で文字だけ残る (壊さない設計)。新しい色を data 側で増やしたら `JAPANESE_COLORS` に追記する。
- `FortuneResultView` の `sectionPrefix?: (index: number) => ReactNode` は各セクションの**左 (md+) / 上 (sm)** に挿し込まれる視覚要素のスロット。タロットでは `<TarotCard />` を返している。新しい占いに視覚要素を足すならここを使う。
- **タロットの `<TarotCard />` は controlled component**: 自身が `<button>` で、`flipped: boolean` + `onFlip?: () => void` を props で受け取る。`flipped` のソース・オブ・トゥルースは `Home.tsx` の `tarotFlipped: [boolean, boolean, boolean]` state。クリックで `onFlip` → Home が state 更新 → 再描画で `flipped=true` が降りてめくれる (`disabled={flipped}` で再クリック不可)。`Home.tsx` の `TAROT_POSITIONS = ['過去','現在','未来'] as const` を `position` prop に渡す。
- **逆位置の前面 180° 回転は静的**: `reversed` の場合 `.card-orient` に `data-reversed="true"` が付き、CSS が静的に `transform: rotateZ(180deg)` を当てる (アニメ化しない方針 — 逆さまは結果状態であって演出ではない)。位置バッジ (`過去`/`現在`/`未来`) は `.card-orient` の**外側**にあるので逆位置でも回転せず常に正向きで読める。
- **結果テキストはカード単位で gating** (`Home.tsx` の派生 `gatedTarotResult`): 未めくりセクションは `title` が `TAROT_POSITIONS[i]` だけ (例: 「過去」)、`body` が `'カードをタップして結果を見る'` のヒント文に置換。めくれたセクションだけ engine の本来の `title` (「過去 — 教皇（逆）」) + `body` (キーワード + 解釈) に切り替わる。
- **subtitle と headline も連動して gating**: `subtitle` (3 枚並列の "教皇逆 / 力 / 運命の輪") は 3 枚すべてめくれるまで `undefined` (`<FortuneResultView>` で非表示)。`headline` (キーワードチップ群) は `deriveHeadline` が `sections[0].body` から取るため 1 枚目がめくれるまで `undefined` でチップ非表示。
- **`tarotFlipped` のリセットはフォーム `onSubmit` で**: `setTarotFlipped([false, false, false])` を `setSubmitted(true)` の手前で呼ぶ。`useEffect` 内での setState は `react-hooks/set-state-in-effect` lint ルールで禁止されているため。`aboutExpanded` のリセット (`setAboutExpanded({})`) も同じ場所で並べて呼ぶ。

### About panels (占いの方法 + 要素一覧)

各 `<FortuneBlock>` には「占いについて」トグルがあり、押すと `<FortuneAboutPanel id={fortuneId} />` (`src/components/FortuneAboutPanel.tsx`) が結果の上に展開される。中身は 2 セクション:

1. **占いの背景** — 6 フィールド (`origin` / `inputUsed` / `howItWorks` / `simplified` / `ourTake` / `whenItChanges`) を順に表示。テキストは `src/fortunes/methodInfo.ts` の `METHOD_INFO: Record<FortuneId, MethodInfo>` に集約。書き下ろしオリジナル文のみで、流派名・占い師名・「〇〇式」・算命学十大主星名は使わない (著作権ガード — `methodInfo.ts` が単一ファイルなので diff レビューが容易)。最後の `whenItChanges` は「同じ人がもう一度占うと？」というラベルで、入力が変わらない限り結果が変わらない理由を占いごとに固有の表現で説明する (omikuji だけは「日付が変わるたびに変わる」と書く)。
2. **ぜんぶの要素** — 占いごとに見た目が違うため、占い別カタログコンポーネントに分離 (`src/components/elementCatalogs/`):
   - `OmikujiCatalog.tsx` — 6 ランクの表 (rank / 出現比率 / スコア帯)
   - `TarotCatalog.tsx` — 22 枚の大アルカナを 1〜2 列グリッドで。静的 `<TarotCatalogCard>` を内包 (`<TarotCard>` は flip インタラクション前提なので再利用しない)。SVG モチーフは `src/components/tarotMotifs.ts` に切り出した `MOTIFS` map を共有
   - `SeimeiCatalog.tsx` — 五格 (天/人/地/外/総) のローカル定数 `GOKAKU_INFO` で、about パネル用の格ごとの解説を持つ
   - **seimei の結果側のテキストは `seimei/judge.ts` の `HINTS: Record<Position, Record<Tone, string>>` に集約** (5 格 × 4 トーン = 20 ヒント)。`Position` は `'天' | '人' | '地' | '外' | '総'`、`Tone` は `'bright' | 'mild' | 'cool' | 'caution'` (画数 1〜81 を 4 トーンに分類)。`tonalLabelFor(position, strokes)` が `{ tone, label, hint }` を返し、`engine.ts` は section ごとに `hint` をそのまま `body` に置く (プレフィックスは付けない ── 各 hint は格名を本文に内包しているため)。新しいヒント表現を試したいときは 4 トーンの語彙を変えるのではなく、`HINTS` の格×トーンのテキストだけを書き換える。トーン分類 (`bright/mild/cool/caution` のセット) は古典の吉数/凶数を参考に決定済みで触らない
   - `AstrologyCatalog.tsx` / `KyuseiCatalog.tsx` / `ShichuCatalog.tsx` / `SanmeiCatalog.tsx` — それぞれ既存の `SIGNS` / `STARS` / `STEM_TYPES` / `SANMEI_STARS` を import し、共有の `<NarrativeCard>` (`elementCatalogs/NarrativeCard.tsx`) で 11 個の narrative フィールド + 3 つの lucky タイルを表示

`FortuneAboutPanel` は `panelId` を受け取り、`<article id={panelId}>` を出すことで、ヘッダボタンの `aria-controls` 参照と一致させている (disclosure pattern)。パネル全体に `.reveal-block` を 1 回だけ適用 (中身の各カードに `.reveal-child` でスタガーはかけない — 22 枚に当てると 1.7 秒かかって破綻するため)。

新しい占いを足す時は: (1) `methodInfo.ts` の `METHOD_INFO` に 6 フィールド追加、(2) `elementCatalogs/` に新カタログ作成、(3) `FortuneAboutPanel.tsx` の `CATALOG_TITLE` と `renderCatalog` switch にケース追加。

### Reveal animations (`src/index.css`)

「結果を見る」を押した瞬間の演出は **CSS アニメーションのみ**で実装している (motion/framer-motion は導入していない)。トークンとキーフレームは `src/index.css` に集約:

- `@theme` の `--ease-emphasized / --ease-overshoot / --ease-anticipate / --dur-windup / --dur-flip / --dur-settle / --reveal-stagger` がチューニング窓口。
- `.reveal-block` — `<FortuneBlock>` が展開された時に中身全体に乗せる fade-up + overshoot scale (Home.tsx)。
- `.reveal-child` — `FortuneResultView` 内の主要セクション (header / summary / lucky / sections / details) に乗せ、`style={{ '--reveal-i': i }}` でインデックスを渡してスタガーする (CSSProperties キャストが必要)。
- `.card-scene` / `.card-flipper` / `.card-orient` — `TarotCard` の 3D フリップは **クリック起点の state 駆動**。マウント直後に走る自動アニメ (旧 `card-wobble` / `orient-upright` / `orient-reversed`) は撤去済み:
  - `.card-scene` (`<button>`) はホバー/フォーカス時に `translateY(-3px)` + 軽い `drop-shadow` を出してクリック誘導する。`:disabled` (= めくり済み) ではポインタも昇降も止める。
  - `.card-flipper` (preserve-3d / backface-visibility hidden) は `data-flipped="true"` になった瞬間だけ `card-flip` キーフレーム (940ms, `--ease-emphasized`) を再生する。React の state 変化で属性が切り替わると CSS 側でアニメが点火される、というだけのシンプルな構造。
  - `.card-orient[data-reversed="true"]` には **静的な** `transform: rotateZ(180deg)` が常時かかっており、めくり終わると前面が逆さまで現れる (アニメ化しない方針 — 逆さまは結果状態であって演出ではない)。`backface-visibility: hidden` のおかげで裏向き中はこの回転は見えない。
- `.reveal-button` — `Home.tsx` の「結果を見る/閉じる」ボタンに付く wind-up。`:active` 中だけ scale 0.96 + 金色シマー (`shimmer-sweep` キーフレーム + `::before`) が走る。
- `@media (prefers-reduced-motion: reduce)` では `card-flip` を含む全アニメを `animation: none !important` にし、`.card-flipper[data-flipped="true"]` だけ `transform: rotateY(180deg)` 直結で前面静止 (= クリックすると瞬時に表向きになる)。`.card-orient[data-reversed="true"]` の rotateZ(180°) は静的なのでそのまま効き、逆位置カードは reduced-motion でも上下逆さまで現れる。`.card-scene` のホバー昇降も殺す。

新しい占いを足す時は、追加の `reveal-child` ラベルや stagger 番号は不要 — `FortuneBlock` の `.reveal-block` が自動で全体を包むので、子要素が `FortuneResultView` 経由なら既存スタガーに自然に乗る。

### Other component caveats

- `src/components/DateInput.tsx` and `src/components/NameInput.tsx` are **currently unused** — `Home.tsx` builds its combined form inline. Files remain in the tree; do not import them by mistake.
- 占いの **件数と名前** は 3 か所にハードコードされており、占いを増減した際は `FORTUNES` カタログ (`src/fortunes/types.ts`) と合わせて全て手動更新する必要がある:
  1. `src/components/Layout.tsx` のフッター文 (「7種類の占いをお楽しみいただけます — おみくじ・タロット（3枚引き）・…」) — 件数 `{FORTUNES.length}` 部分のみ自動追従。
  2. `src/pages/Home.tsx` の入力フォーム見出し (「7つの占いを、ひと所で。」)。
  3. `index.html` の `<title>` (「うらない百貨 — 7種類の占いを楽しむ」)。

### Shared utilities (`src/lib/`)

- `seedRandom.ts` — `createRng(seed)` returns a deterministic **64-bit** stream (FNV-1a 64-bit hash → splitmix64). Output entropy ceiling is 2^64 ≈ 1.8×10^19 ── 32-bit RNG だと「同じハッシュに偶然落ちる別入力」の頻度がボトルネックになるので、おみくじの出力空間 (~6.6×10^13) を活かすために 64-bit にしてある。Used by `omikuji` (date+name seed for "same day = same result") and `tarot` (per-draw seed for the shuffle).
- `julianDay.ts` — Gregorian → Julian Day Number (Fliegel–Van Flandern), then `dayStemBranch` / `yearStemBranch` derive the 60-cycle index. `risshunYear` applies the **Feb 4 cutoff** (Jan 1 – Feb 3 belongs to the previous year). All Eastern fortunes (`kyusei`, `shichu`, `sanmei`) must respect this cutoff.
- `moonSign.ts` — 月の黄経を簡易近似で計算 (`gregorianToJulianDay` を起点に Meeus 主要項のみ採用) → 30° で切って星座インデックス・名前 (`MoonSignName`) を返す。`astrology` engine の「今日の月の星座」判定に使用。出力は 12 星座の和名で `astrology/signs.ts` の `Sign.name` と一致。
- `kanjiStrokes.ts` — hiragana・katakana table と `strokeOf` / `strokesOfText` のロジック。漢字本体は `kanjiStrokes.data.ts` から import。Used only by `seimei`. Unknown chars are surfaced to the UI as "画数不明" rather than silently treated as 0.
- `kanjiStrokes.data.ts` — **自動生成**された **shinjitai** (新字体) stroke-count table for ~13,000 kanji。常用漢字 + 人名用漢字 + JIS X 0208 (第1+第2水準) + JIS X 0212/0213 を網羅。**手で編集しない**。再生成は `uv run python scripts/build_kanji_dict.py` (KANJIDIC2 を取得して書き換える)。スクリプト内の `MANUAL_OVERRIDES` で KANJIDIC2 に存在しない人名異体字 (例: `髙`) を補完。
- `japaneseColors.ts` — 和色名 → hex の表示専用マップ (`JAPANESE_COLORS`) と `resolveColor(name)` ヘルパー。`<ColorSwatch>` から呼ばれる。詳細は上の「Result presentation layer」のラッキーカラー節を参照。新しい `luckyColor` をデータ側に増やしたらこのマップにも追記。

### 結果本文の長さ規約

`signs.ts` / `data.ts` (kyusei) / `stems.ts` / `stars.ts` (sanmei) / `cards.ts` の主要本文フィールドは、項目ごとに以下の文字数を目安に書く (commit `cb51754` で全エントリを書き直した際の基準):

| フィールド | 目安 | ねらい |
|---|---|---|
| `summary` | 80〜120 字 (1〜2 文) | キャッチー一文 + 補足一文 |
| `general` | 130〜180 字 (2〜3 文) | 中核の性質 + 強みの具体像 + 内面の特徴 |
| `love` / `work` / `growth` / `shadow` | 各 80〜140 字 (2 文) | 状況描写 + 提案 |
| タロット `body` (正逆共通) | 100〜150 字 (2 文) | 比喩 + 行動のヒント (正逆で対比) |
| `catchphrase` / `advice` / `luckyColor` / `luckyItem` / タロット `keywords` | 短さに意味があるため**現状維持**で書く | タグライン・3 単語 |

トーン: 「長所と短所をペアで」「相反する特徴を併置」「具体名詞を多めに」がバーナム効果に流されすぎないコツ。

omikuji の `data.ts` はこの規約の対象外。**2 セグメント合成構造** ── 各 (rank, category) は `{ open: string[]; close: string[] }` を持ち、任意の open × 任意の close を連結して 1 文に仕立てる (`omikuji/engine.ts` の `compose()`)。これで出力空間が 6 × 64^5 × 32 × 32 × 30 ≈ **6.6×10^13 通り**まで広がり「未来永劫被らない」を達成している。新しい候補文を足す時は open と close の**両配列に互換性のある対**を加えること: open は情景・観察 (「〜日です。」「〜時です。」)、close は提案・行動 (「〜してみて。」「〜が吉。」)。任意の組み合わせで自然に読めることが不変条件。単一文として 1 つの配列に放り込むのは禁則 ── 連結された側がただ消えてしまう。COLORS/ITEMS は各 32、ACTIONS は 30 をプール (色は `lib/japaneseColors.ts` の `JAPANESE_COLORS` マップ範囲内から選ぶ)。

`astrology/dailyData.ts` も同じ規約の対象外で、同じ open/close 合成パターンを採用。出力は summary + 4 category sections + ラッキー*。プールは:
- `MOON_MOOD`: 12 月星座 × `{open: 8, close: 8}` → summary の前半に使用
- `RESONANCE`: 16 元素ペア (太陽 × 月) × `{open: 8, close: 8}` → summary の後半に使用
- `DAILY_CATEGORY`: 4 categories (`overall` / `love` / `work` / `health`) × `{open: 12, close: 12}` → 4 つの運勢セクション
- `DAILY_ACTION`: 共有 `{open: 24, close: 24}` → ひとことアドバイス
- `DAILY_COLORS` / `DAILY_ITEMS`: 各 32 のプール

1 入力 (太陽座, 月座, 日付) あたりの組み合わせ空間: summary 64 × 64 + 4 cat × 144 + advice 576 + color 32 × item 32 = 約 10^11、(12太陽 × 12月 × 365日) を掛けると **約 10^15 オーダー** (omikuji を 1〜2 桁上回る)。`engine.ts` は `astrology|${alias}|${moonName}|${todayIso}` をシードに `createRng` + `pick` で取り出す。性格判断系のテキストは出力しない (sign.general/love/work/growth/shadow/catchphrase は `AstrologyCatalog` の about パネルでのみ参照される)。新しい色を `DAILY_COLORS` に追加する場合は **必ず `lib/japaneseColors.ts` の `JAPANESE_COLORS` マップに存在する名前のみ** にすること (`<ColorSwatch>` の色見本表示が前提)。

### Calculation notes (intentionally simplified)

- This is an **entry-level "type diagnosis" tool**, not a serious命式. astrology は太陽星座 (本質) + 今日の月の星座 (日替わりの空気) の二層を扱う簡易版 (ASC・他惑星・ハウス・アスペクトはなし)。day stem only (no 月柱/時柱), 本命星 only (no 月命星/吉方位), year stem only for `sanmei`.
- 西洋占星術 boundaries are **fixed representative dates** (e.g. 牡羊座 = 3/21–4/19). The actual sun-longitude crossings shift by hours each year — we don't compute them.
- 月の星座は Meeus 低精度近似 (`src/lib/moonSign.ts` の `moonLongitude` = mean longitude + 主要な中心の式項のみ) で計算しており、精度は ±1〜2° 程度。境目の 1 日は前後どちらの星座にも揺らぐ可能性 (月は約 2.5 日ごとに次の星座へ移る)。methodInfo の `simplified` で明示。
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
