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

Node 20.x (`.github/workflows/deploy.yml` の `actions/setup-node` 指定が真実の所在；`package.json` に `engines` 指定はない)。

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

ただしタロットだけ `id='tarot-three'` に対してディレクトリ名は `tarot/` (歴史的経緯)。他の 6 占いは id とディレクトリ名が一致。`grep tarot-three src/fortunes/` で何も出ないので注意。

### Fortune catalog (id → 入力 → 出力構造)

| id            | 入力                       | 出力の主要セクション         |
|---------------|----------------------------|-----------------------------|
| `omikuji`     | 姓名 (任意; 無ければ `'guest'` シード) | 6 ランク × 5 運勢のおみくじ |
| `tarot-three` | 生年月日 + 姓名 (シード)   | 過去 / 現在 / 未来 の 3 セクション (`drawn[]` も返す) |
| `seimei`      | 姓 + 名 (両方必要)         | 五格 (天/人/地/外/総) + 簡易解釈 |
| `astrology`   | 生年月日 + 今日の日付       | 太陽星座ラベル + 今日のテーマ + 4 運勢 (全体/恋愛/仕事/健康) × 各 ⭐ 1〜5 評価 + 12 星座ランキング兼ピッカー (詳細は下の **Astrology UX** 節)。性格判断パートは持たない |
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

結果ページの 7 ブロックは `<FortuneGroupHeader>` (Home.tsx 内ローカル) で **2 セクションに分割**して描画する:
- **「今日の運勢」(TODAY'S FLOW)** — `omikuji` → `tarot-three` → `astrology` の順 (日付が変わると引き直される 3 占い)
- **「あなたのタイプ」(YOUR PROFILE)** — `seimei` (条件付き) → `kyusei` → `shichu` → `sanmei` の順 (生年月日から決まる固定 4 占い)

この区切りは `methodInfo.ts` の `whenItChanges` フィールドと**同じ意味分類**: 「日付が変わると新しい結果」 vs 「同じ入力なら一生同じ」。新しい占いを足すときは、どちらのセクションに属するかを `whenItChanges` の文言と合わせて判断し、Home.tsx の対応するセクション内に `<FortuneCard>` を追加する。astrology が `tarot-three` の後に来ているのはこの再構成によるもので、`FORTUNES` カタログの宣言順 (omikuji → tarot → seimei → astrology → kyusei → shichu → sanmei) とは**意図的にズレている**。

各占いブロックは `<FortuneCard>` (`src/components/FortuneCard.tsx`) でラップされる。これは旧 `<FortuneBlock>` (Home.tsx 内ローカル) を 2026-05 のデザイン磨き込みで独立コンポーネントへ切り出したもの。`<FortuneCard>` は「閉じた本」のメタファで:
- 外枠は `.surface-card-strong` (opaque white + `--color-border-hairline` + `--shadow-pop`)
- accent gradient はカードの**左帯** (`w-1.5 bg-gradient-to-b ${info.accent}`)。旧実装の `h-1.5` 上帯は廃止。
- emoji は丸プレート (`w-12 h-12 rounded-full bg-surface-sunken`) でアンカー化
- 「結果を見る」は `.btn-plum` filled primary、「占いについて」は hairline-border secondary

The seedHint passed to `drawThree` is derived from the user's input (`${year}-${month}-${day}|${sei}${mei}`), but the engine itself folds in `todayIsoDate()` (`tarot/engine.ts:15`) so cards rotate daily like omikuji and astrology — same person × same day → same 3 枚 (consistent within the day so `tarotFlipped` state stays meaningful), but a different day yields a new draw. About-panel copy in `methodInfo.ts` (`'tarot-three'` entry) reflects this; if the seed structure changes, the `inputUsed` / `howItWorks` / `whenItChanges` fields must be updated together.

Each `<FortuneCard>` のヘッダーには **2 つのトグルボタン** が並ぶ: 左に「占いについて」(占い解説 + 要素一覧パネル)、右に「結果を見る」(占いの結果)。両者は完全に独立した state で、開閉の順序は問わない。両方開いた場合は **about パネルが結果の上**に表示される。Per-block visibility は Home.tsx の `expanded` (結果) と `aboutExpanded` (解説) の 2 つに分かれ、どちらもフォーム再 submit 時に `{}` リセットされる。

姓名は任意。両方が空のときは姓名判断 (`seimei`) をスキップする。おみくじとタロットは姓名が空でも引ける ── タロットは生年月日をシードに、おみくじは今日の日付 (姓名なしの場合は `name='guest'` フォールバック) をシードに描画する。

To add or modify a fortune: edit the engine + data, add a `<FortuneCard>` section to `Home.tsx`, and add an entry to the `FORTUNES` catalog in `src/fortunes/types.ts`. Every catalog entry needs `displayName` / `traditionalName` (subtitle) / `description` (1〜2 文の説明、折りたたみ時も常時表示される) / `emoji` / `accent` — all five are load-bearing in `FortuneCard`'s header. The `FortuneInfo` type no longer carries a `path` — there are no per-fortune routes.

### Result presentation layer

- `src/components/SummaryCard.tsx` — 結果ページの先頭、最初の `<FortuneGroupHeader>` の手前に出る「今日の空気」カード。`score` を持つ占い (現状 `omikuji` / `astrology` / `seimei`) の平均を 0–100 で表示し、`KEYWORD_PRIORITY: FortuneId[] = ['astrology', 'omikuji', 'kyusei', 'shichu', 'sanmei', 'seimei']` の順に `deriveHeadline(r, id)[0]` を 3 つだけ採取してチップで並べる。`.surface-card-strong` の上に `style={{ background: 'var(--color-surface-sunken)' }}` でベージュ寄せ。タロットは `tarotFlipped` 前に keyword が undefined になる仕様上、SummaryCard の priority に `tarot-three` を**意図的に入れていない** (めくる前から「過去・現在・未来」が混ざると驚きが減るため)。
- `src/components/resultDerive.ts` derives the keyword chips shown above each result title (`deriveHeadline`) from the existing `FortuneResult` fields. Engines return unchanged shapes; presentation choices live entirely in this helper.
- **セクションごとの ⭐ 5 段階評価**: `FortuneSection` の optional `rating?: number` (1〜5) が設定されていると、`SectionCard` の title 行に `<RatingStars>` (`FortuneResultView.tsx` 内ローカル) が `⭐️…☆… (N/5)` 形式で描画される。`aria-label="5段階中N"` 付き。値は engine 側で `pickWeighted(rng, RATING_WEIGHTS)` で決定論的に抽選。現状 astrology の 4 セクションだけで使用。タロットの `sectionPrefix` (左挿しカード) と層が分かれているため共存可能。
- `<FortuneCard>` のヘッダーは折りたたみ時も常時表示で、`emoji + displayName + traditionalName(小)` の見出し行の直下に `info.description` の段落 (`text-xs md:text-sm text-ink/70 ml-11`) を出して「これは何の占いか」を伝える。`{expanded && …}` の **外側**に置いてあるので折りたたみ・展開どちらでも見える。
- **ラッキーカラーには色見本を出す**: `<FortuneResultView>` の `Highlight` と `<NarrativeCard>` の `MiniHighlight` は `label === 'ラッキーカラー'` の枠だけ `<ColorSwatch name={value} />` (`src/components/ColorSwatch.tsx`) を文字の左に並べる。和色名 → hex のマップは `src/lib/japaneseColors.ts` (`JAPANESE_COLORS` + `resolveColor`)。複合色 (`'白・銀'` 等) は `・` で分割して半々のグラデーション円を描く。マップに無い名前は swatch 非表示で文字だけ残る (壊さない設計)。新しい色を data 側で増やしたら `JAPANESE_COLORS` に追記する。
- `FortuneResultView` の `sectionPrefix?: (index: number) => ReactNode` は各セクションの**左 (md+) / 上 (sm)** に挿し込まれる視覚要素のスロット。タロットでは `<TarotCard />` を返している。新しい占いに視覚要素を足すならここを使う。
- **タロットの `<TarotCard />` は controlled component**: 自身が `<button>` で、`flipped: boolean` + `onFlip?: () => void` を props で受け取る。`flipped` のソース・オブ・トゥルースは `Home.tsx` の `tarotFlipped: [boolean, boolean, boolean]` state。クリックで `onFlip` → Home が state 更新 → 再描画で `flipped=true` が降りてめくれる (`disabled={flipped}` で再クリック不可)。`Home.tsx` の `TAROT_POSITIONS = ['過去','現在','未来'] as const` を `position` prop に渡す。
- **逆位置の前面 180° 回転は静的**: `reversed` の場合 `.card-orient` に `data-reversed="true"` が付き、CSS が静的に `transform: rotateZ(180deg)` を当てる (アニメ化しない方針 — 逆さまは結果状態であって演出ではない)。位置バッジ (`過去`/`現在`/`未来`) は `.card-orient` の**外側**にあるので逆位置でも回転せず常に正向きで読める。
- **結果テキストはカード単位で gating** (`Home.tsx` の派生 `gatedTarotResult`): 未めくりセクションは `title` が `TAROT_POSITIONS[i]` だけ (例: 「過去」)、`body` が `'カードをタップして結果を見る'` のヒント文に置換。めくれたセクションだけ engine の本来の `title` (「過去 — 教皇（逆）」) + `body` (キーワード + 解釈) に切り替わる。
- **subtitle と headline も連動して gating**: `subtitle` (3 枚並列の "教皇逆 / 力 / 運命の輪") は 3 枚すべてめくれるまで `undefined` (`<FortuneResultView>` で非表示)。`headline` (キーワードチップ群) は `deriveHeadline` が `sections[0].body` から取るため 1 枚目がめくれるまで `undefined` でチップ非表示。
- **`tarotFlipped` のリセットはフォーム `onSubmit` で**: `setTarotFlipped([false, false, false])` を `setSubmitted(true)` の手前で呼ぶ。`useEffect` 内での setState は `react-hooks/set-state-in-effect` lint ルールで禁止されているため。`aboutExpanded` のリセット (`setAboutExpanded({})`) も同じ場所で並べて呼ぶ。

### Astrology UX (ranking + sign picker)

astrology だけが持つ「12 星座ランキング兼サインピッカー」の構造は以下:

- **`dailyRanking()`** (`src/fortunes/astrology/engine.ts`): `SIGNS` の 12 星座すべてに対して `readSunSign(_, { signOverride })` を擬似実行 → `sections[].rating` (1〜5) の合計 (4〜20) で降順ソート → `RankingEntry[]` (`{ sign, total, rank }`) を返す。同点は `SIGNS` の宣言順 (= 牡羊 → 魚) で先勝ち。
- **`<AstrologyRanking>`** (`src/components/AstrologyRanking.tsx`): 12 セルの button グリッド (sm 以上で 12 列、モバイルは 6 列 × 2 行)。各セル: 順位・symbol・略称・合計 (N/20)・★ (natal sign)。選択中は plum 背景でハイライト。`aria-pressed` 付き。
- **配置**: `Home.tsx` 内、`<FortuneCard id="fortune-astrology">` の直下、`<FortuneResultView>` の手前に常時表示。
- **state**: `Home.tsx` の `astroSelectedAlias: string | null`。タップで `setAstroSelectedAlias(alias)`、natal 星座を再タップすると `null` に戻して override 解除。フォーム再 submit でも `null` リセット (他の state リセット群と並べて `onSubmit` ハンドラ内で実行)。
- **`signOverride` の挙動**: `readSunSign` の第 2 引数で `{ signOverride: Sign }` を渡すと、その星座の今日の運勢を計算する。指定時は subtitle から「`${year}年${month}月${day}日生まれ`」の prefix が消える (本来の星座と異なる星座を覗いている文脈なので、生年月日表示は混乱を招くため)。
- **seed の独立性**: 各星座の rating は `astrology|${sign.alias}|${moonName}|${todayIso}` を seed にして決定論的に算出されるので、ランキングと結果表示は常に整合する。

### About panels (占いの方法 + 要素一覧)

各 `<FortuneCard>` には「占いについて」トグルがあり、押すと `<FortuneAboutPanel id={fortuneId} />` (`src/components/FortuneAboutPanel.tsx`) が結果の上に展開される。中身は 2 セクション:

1. **占いの背景** — 6 フィールド (`origin` / `inputUsed` / `howItWorks` / `simplified` / `ourTake` / `whenItChanges`) を順に表示。テキストは `src/fortunes/methodInfo.ts` の `METHOD_INFO: Record<FortuneId, MethodInfo>` に集約。書き下ろしオリジナル文のみで、流派名・占い師名・「〇〇式」・算命学十大主星名は使わない (著作権ガード — `methodInfo.ts` が単一ファイルなので diff レビューが容易)。最後の `whenItChanges` は「同じ人がもう一度占うと？」というラベルで、占いごとに「結果が変わる条件」を固有の表現で説明する。日替わりグループ (`omikuji` / `tarot-three` / `astrology`) は「日付が変わると新しい結果」、生年月日固定グループ (`seimei` / `kyusei` / `shichu` / `sanmei`) は「同じ入力なら一生同じ」と書き分ける。
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
- `.reveal-block` — `<FortuneCard>` が展開された時に中身全体に乗せる fade-up + overshoot scale (Home.tsx)。
- `.reveal-child` — `FortuneResultView` 内の主要セクション (header / summary / lucky / sections / details) に乗せ、`style={{ '--reveal-i': i }}` でインデックスを渡してスタガーする (CSSProperties キャストが必要)。
- `.card-scene` / `.card-flipper` / `.card-orient` — `TarotCard` の 3D フリップは **クリック起点の state 駆動**。マウント直後に走る自動アニメ (旧 `card-wobble` / `orient-upright` / `orient-reversed`) は撤去済み:
  - `.card-scene` (`<button>`) はホバー/フォーカス時に `translateY(-3px)` + 軽い `drop-shadow` を出してクリック誘導する。`:disabled` (= めくり済み) ではポインタも昇降も止める。
  - `.card-flipper` (preserve-3d / backface-visibility hidden) は `data-flipped="true"` になった瞬間だけ `card-flip` キーフレーム (940ms, `--ease-emphasized`) を再生する。React の state 変化で属性が切り替わると CSS 側でアニメが点火される、というだけのシンプルな構造。
  - `.card-orient[data-reversed="true"]` には **静的な** `transform: rotateZ(180deg)` が常時かかっており、めくり終わると前面が逆さまで現れる (アニメ化しない方針 — 逆さまは結果状態であって演出ではない)。`backface-visibility: hidden` のおかげで裏向き中はこの回転は見えない。
- `.reveal-button` — `Home.tsx` の「結果を見る/閉じる」ボタンに付く wind-up。`:active` 中だけ scale 0.96 + 金色シマー (`shimmer-sweep` キーフレーム + `::before`) が走る。
- `@media (prefers-reduced-motion: reduce)` では `card-flip` を含む全アニメを `animation: none !important` にし、`.card-flipper[data-flipped="true"]` だけ `transform: rotateY(180deg)` 直結で前面静止 (= クリックすると瞬時に表向きになる)。`.card-orient[data-reversed="true"]` の rotateZ(180°) は静的なのでそのまま効き、逆位置カードは reduced-motion でも上下逆さまで現れる。`.card-scene` のホバー昇降も殺す。

新しい占いを足す時は、追加の `reveal-child` ラベルや stagger 番号は不要 — `FortuneCard` の `.reveal-block` が自動で全体を包むので、子要素が `FortuneResultView` 経由なら既存スタガーに自然に乗る。

### Other component caveats

- `src/components/HeroDecoration.tsx` は **フォーム画面のヒーロー右上に出る装飾 SVG** (月相 + 散らした 7 つの小さな星)。`text-gold` で塗り、月のグループ `<g className="float-soft">` にだけアニメを当てて 6 秒周期でゆらゆらする。常に `aria-hidden="true"` + `role="presentation"`。`prefers-reduced-motion: reduce` で `float-soft` は止まる (`src/index.css` の reduced-motion ブロックに含まれている)。Home.tsx 側で mobile は `w-32 h-32`、md+ は `w-56 h-56` を 2 個並べる (mobile 用 / desktop 用) `absolute` 配置で出し分ける。新しい装飾 SVG を足すならここを参考に。
- `src/pages/Home.tsx` には **3 つの inline helper コンポーネント**が末尾 (`function Home()` の外側) に置かれている。Home.tsx 専用なので別ファイルに切り出していない:
  - `Field({ label, children })` — フォーム入力 1 つ分の `<label>` ラッパ。年月日 / 姓名どちらにも使う。
  - `StepLabel({ index, title, required?, optional? })` — フォームの「STEP 01 ─ 生年月日 *」「STEP 02 ─ 姓名 (任意)」見出し。`type-eyebrow` + `font-serif` の組合せ。
  - `FortuneGroupHeader({ eyebrow, title, description, icon })` — 結果ページの「TODAY'S FLOW / 🌙 今日の運勢」「YOUR PROFILE / 🌳 あなたのタイプ」セクションヘッダ。`<FortuneCard>` 群を 2 グループに分割するために 2 回呼ばれる。

  新しい helper を足すなら同じ末尾に並べる。複数ファイルから使うようになったら初めて `src/components/` へ昇格させる。
- フォーム末尾には「結果に並ぶ占い」chip list があり、`FORTUNES` を `map` して 7 占いの emoji + displayName を 1 行で並べる。**`FORTUNES` を増減すると自動追従するので、ここは下の「ハードコード 3 か所」の例外**。
- `src/components/DateInput.tsx` and `src/components/NameInput.tsx` are **currently unused** — `Home.tsx` builds its combined form inline. Files remain in the tree; do not import them by mistake.
- 占いの **件数 (数字)** は 2 か所にハードコードされており、占いを増減した際は `FORTUNES` カタログ (`src/fortunes/types.ts`) と合わせて手動更新する必要がある:
  1. `src/pages/Home.tsx` の入力フォーム見出し (「7つの占いを、ひと所で。」) — 数字も文言も手動。
  2. `index.html` の `<title>` (「うらない百貨 — 7種類の占いを楽しむ」) — 同上、手動。

  なお `src/components/Layout.tsx` のフッターと Home.tsx のフォーム末尾「結果に並ぶ占い」chip list、フッター末尾「全 N 種類の占い」表記はすべて `FORTUNES.map` / `FORTUNES.length` で**自動追従**するので手動更新不要。

### Shared utilities (`src/lib/`)

- `seedRandom.ts` — `createRng(seed)` returns a deterministic **64-bit** stream (FNV-1a 64-bit hash → splitmix64). Output entropy ceiling is 2^64 ≈ 1.8×10^19 ── 32-bit RNG だと「同じハッシュに偶然落ちる別入力」の頻度がボトルネックになるので、おみくじの出力空間 (~6.6×10^13) を活かすために 64-bit にしてある。日替わり 3 占いすべてが利用: `omikuji` (`omikuji|${today}|${name}`) / `tarot-three` (`tarot3|${today}|${birth+name}`) / `astrology` (`astrology|${alias}|${moonName}|${todayIso}`)。共通して「同じ入力 × 同じ日 → 同じ結果」の決定性を担保。同ファイルの `pick(rng, list)` (一様抽選) / `pickWeighted(rng, [{value, weight}])` (加重抽選 — omikuji の rank / astrology の ⭐ 評価で使用) / `shuffle(rng, list)` (Fisher-Yates) / `todayIsoDate()` (ローカル日付 ISO 文字列) も一緒に提供している。
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

The project's selling point is that **all interpretive text is original** and avoids registered/流派-specific names. より詳しい do-not list と voice & tone のガイドは [`docs/TONE_AND_MANNER.md`](docs/TONE_AND_MANNER.md) も参照。When editing data files:

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
