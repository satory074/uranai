# うらない百貨 — トンマナ (Design Language)

うらない百貨の見た目・動き・言葉遣いを 1 ファイルにまとめたものです。
このファイルは**現状の暗黙ルールを成文化**したものであり、新規仕様書ではありません。
実装の真実は次の場所にあります:

- **ビジュアル/モーションのトークン**: `src/index.css` の `@theme` ブロック
- **占いカタログ (色帯・絵文字・説明文)**: `src/fortunes/types.ts` の `FORTUNES`
- **声と語法のお手本**: `src/fortunes/*/data.ts` (各占いの本文)
- **著作権・商標の制約**: `CLAUDE.md` の "Copyright / trademark constraints" セクション

このファイルと上の 4 か所が食い違ったら、**コードを正**として本ドキュメントを更新してください。

---

## 0. ブランドの態度

3 行で言うと:

- **古典的だが厳粛すぎず**。和の紙質と少しの金で「占いらしさ」を演出するが、堅苦しくはしない。
- **詩的だが小難しくない**。比喩や情景描写は使うが、専門用語の解説や流派の権威を語らない。
- **結果は提案であって断定ではない**。「絶対」「必ず」「決して」は使わない。「傾向」「印象」「サイン」「気配」で軟化する。

このプロジェクトの売りは **解釈テキストがすべてオリジナル**であること。流派の専門用語・占い師名・既存デッキの構図に寄せず、独自の言葉で書き切ることがブランドの根幹です。

---

## 1. 色 (Color)

トークンの実体は `src/index.css` の `@theme` ブロックにあります。
**primitive (素の色)** と **semantic (役割名)** の 2 階層で持ち、`@theme` に書いた変数は Tailwind v4 が自動で utility クラスに変換します (例: `--color-plum` → `text-plum` `bg-plum` `border-plum`)。

### Primitive — コアパレット

| トークン           | 値        | 役割                                                  |
| ------------------ | --------- | ----------------------------------------------------- |
| `--color-ink`      | `#1f1b2e` | 主テキスト。深い紫黒。                                |
| `--color-paper`    | `#fdfaf3` | ベース背景。古紙色。                                  |
| `--color-mist`     | `#f4ecdc` | サブ背景・チップ・スコアバーの溝。                    |
| `--color-plum`     | `#6c2952` | ブランドカラー。見出し・主要ボタン・セクションタイトル。 |
| `--color-gold`     | `#b48a3a` | 装飾・shimmer・フォーカスリングのみ。                 |
| `--color-indigo`   | `#2a3960` | タロットカード裏面の濃い藍紫専用。                    |

### Semantic — 役割で名付ける層 (新規/改修コードはこちらを優先)

| トークン                    | 値                  | 用途                                       |
| --------------------------- | ------------------- | ------------------------------------------ |
| `--color-text-primary`      | `var(--color-ink)`  | 本文・見出しの主テキスト                   |
| `--color-text-secondary`    | `#3a3548`           | 補助テキスト (AA pass on paper)            |
| `--color-text-muted`        | `#5a5566`           | 低トーンの脇テキスト (AA pass on paper)    |
| `--color-text-on-plum`      | `var(--color-paper)`| plum 背景上のテキスト                       |
| `--color-surface-base`      | `var(--color-paper)`| ページ全体のベース面                        |
| `--color-surface-raised`    | `#ffffff`           | 主要カードの面 (FortuneResultView, Digest)  |
| `--color-surface-sunken`    | `#f9f1df`           | 内部パネルや凹んだ部分                       |
| `--color-border-hairline`   | `#e7dcc6`           | 標準のごく薄い罫線                          |
| `--color-border-default`    | `#d4c5a8`           | 区切りを明示したい時の通常罫線              |
| `--color-focus-ring`        | `var(--color-gold)` | `:focus-visible` の outline                 |

> **ルール**: 新しく書くコードでは `text-ink/60` のような opacity 表記より `text-text-muted` の semantic 名を優先する。既存の `text-ink/70` `border-amber-900/10` はそのまま保持してよい (差分を視覚に出さないため一括置換しない)。

### Accent — 占い別のグラデーション

7 占いそれぞれに 1 ペアの Tailwind gradient を割り当てています (`src/fortunes/types.ts`):

| id            | accent クラス                      | イメージ          |
| ------------- | ---------------------------------- | ----------------- |
| `omikuji`     | `from-rose-200 to-amber-200`       | 朝焼け            |
| `tarot-three` | `from-purple-200 to-pink-200`      | 黄昏              |
| `seimei`      | `from-emerald-200 to-teal-200`     | 若葉              |
| `astrology`   | `from-sky-200 to-blue-200`         | 晴天              |
| `kyusei`      | `from-amber-200 to-yellow-200`     | 月光              |
| `shichu`      | `from-lime-200 to-green-200`       | 苗                |
| `sanmei`      | `from-fuchsia-200 to-rose-200`     | 桜紫              |

これらは `<FortuneBlock>` ヘッダーの色帯 (`h-1.5 rounded-full bg-gradient-to-r ${info.accent}`) と `<FortuneDigest>` チップの左帯にしか使いません。本文や他の装飾には使わない。

### ペア規則 (やってよい / よくない)

- ✅ `text-ink` on `bg-paper` — 本文の基本
- ✅ `text-plum` on `bg-mist` — チップ
- ✅ `text-paper` on `bg-plum` — 主要ボタン
- ❌ `text-gold` on `bg-paper` — gold は文字色にしない (装飾とフォーカスのみ)
- ❌ `text-ink/40` 以下 — コントラスト不足

---

## 2. タイポグラフィ (Typography)

```
--font-sans:  "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, ...
--font-serif: "Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", serif
```

外部フォントは読み込まない。OS 標準 → Noto Sans/Serif JP のフォールバックで十分。

### 使い分け

- `font-serif` (明朝体) は **見出しと数値ラベルのみ**:
  - h1 の "7つの占いを、ひと所で。"
  - 各占いの `displayName`
  - スコア表示・"YOUR FORTUNES" などのラベル
- `font-sans` (ゴシック) が **本文の基本**。ボタン・フォーム・解釈文すべて。
- `tracking-[0.4em]` (大きな字間) は **短い装飾英字専用**。例: `URANAI HYAKKA`, `DIGEST`, `YOUR FORTUNES`。日本語に当てない。

### 改行 (`<br />`) の扱い

- ✅ h1 の見栄え調整: 「7つの占いを、<br />ひと所で。」
- ❌ 本文 (`data.ts`) には入れない。改行は段落区切り (`\n\n`) でのみ表現する。

---

## 3. 余白とスケール (Spacing)

Tailwind の標準スケール (4px ベース) に乗せる。独自値 (`mt-[13px]` 等) は原則使わない。

| 用途                       | クラス例                  |
| -------------------------- | ------------------------- |
| インライン要素間            | `gap-2` `gap-3`           |
| セクション内 (header→body) | `gap-4` `mb-5` `mb-6`     |
| 主要セクション間            | `mb-10`                   |
| カード内側パディング        | `p-4` (内部) / `p-6 md:p-8` (主要) |
| sticky digest と本文       | `scroll-mt-6 md:scroll-mt-56` (`<FortuneBlock>` に必須) |

---

## 4. 角丸とエレベーション (Radii & Shadow)

| 形状                   | 用途                                     |
| ---------------------- | ---------------------------------------- |
| `rounded-2xl`          | 主要カード (FortuneResultView, Digest)   |
| `rounded-lg`           | 内部パネル・SectionCard                   |
| `rounded-xl`           | TarotCard 専用                            |
| `rounded-full`         | チップ・pill 型ボタン・スコアバー         |
| `rounded`              | フォーム入力欄                            |

エレベーションは深く積まない。基本は `shadow-sm + border-amber-900/10` の組合せ (新規コードでは `shadow-card + border-border-hairline`)。`--shadow-pop` は意図的に強調したい一点のみ。

---

## 5. モーション (Motion)

トークン:

| 用途                  | 値                                    |
| --------------------- | ------------------------------------- |
| `--ease-emphasized`   | `cubic-bezier(0.2, 0, 0, 1)` — Material 系の標準展開 |
| `--ease-overshoot`    | `cubic-bezier(0.34, 1.56, 0.64, 1)` — ぴょこっと出現 |
| `--ease-anticipate`   | `cubic-bezier(0.36, 0, 0.66, -0.56)` — 引き戻して放つ |
| `--dur-windup`        | `200ms` — 押し込み                       |
| `--dur-flip`          | `700ms` — タロットめくり (実体は 940ms)   |
| `--dur-settle`        | `320ms` — 余韻                           |
| `--reveal-stagger`    | `80ms` — 子要素間のずれ                   |

### 既存アニメの役割

- `.reveal-block` — 「結果を見る」を押した瞬間、ブロック全体を fade-up + overshoot scale で立ち上げる
- `.reveal-child` — `FortuneResultView` 内の主要セクション (header / summary / lucky / sections / details) に乗り、`style={{ '--reveal-i': i }}` で stagger
- `.card-flip` — タロットカードの 3D めくり (`data-flipped="true"` を付けた瞬間に発火)
- `.shimmer-sweep` — 「結果を見る」「占う」ボタン押下時の金色サッ

### 新しいアニメを追加するとき

1. **既存の `--ease-*` / `--dur-*` を使い回す**。新トークンを増やさない。
2. `@media (prefers-reduced-motion: reduce)` で必ず `animation: none !important` を書く。位置の最終状態は `transform` を直接当てて静止させる (`card-flip` のリデュース版が良い参照例)。
3. アニメは「結果を漸進的に明かす」体験の一部であるべきで、装飾のための装飾は加えない。

---

## 6. アクセシビリティ (Accessibility)

### コントラスト

- 本文系は `--color-text-primary` / `--color-text-secondary` / `--color-text-muted` の 3 つのみを使う。これらは `--color-paper` 上で WCAG AA を通る。
- `text-ink/40` 以下は使わない。
- `border-amber-900/10` は意匠上 OK だが、新規コードでは `--color-border-hairline` を使う (色は近いが「不可視に近い」状態を避ける)。

### フォーカス

ベース層で全インタラクティブ要素に gold outline を敷いてある (`src/index.css` の `@layer base` 参照):

```css
:where(button, [role="button"], input, select, textarea, a):focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
  border-radius: inherit;
}
```

新しい操作要素を足す時、自分でフォーカスリングを書く必要はない。**消すのも禁止** (`outline: none` を当てるなら必ず代替の可視表現を)。

### 動きの抑制

`prefers-reduced-motion: reduce` のメディアクエリで全アニメを `animation: none` に落とす実装が `src/index.css` の最後に既にある。新しい `@keyframes` を足したら必ずこのブロックにも追記する。

### 新しい要素のチェックリスト

- [ ] テキストコントラストは AA (4.5:1 以上)
- [ ] キーボードで到達でき、`focus-visible` で gold ring が出る
- [ ] 必要なら `aria-label` `aria-expanded` `aria-controls` `aria-live` を付ける (既存の `<FortuneBlock>` `<TarotCard>` を参考に)
- [ ] アニメは reduced-motion で無効化される
- [ ] `aria-hidden` を付けるべき装飾要素 (絵文字・帯) を見落としていない

---

## 7. 声と語法 (Voice & Tone)

このプロジェクトのテキストは**実装の一部**です。CSS と同じくらいトンマナを左右します。

### 語法ルール

1. **「あなた」を主語にしない**。省略するか「〜タイプ」と言い切る。
2. **敬語 (です・ます調) は本文には使わない**。フォームのラベルやエラー文言は除く。
3. **命令形より勧奨形**。「〜してみて」「〜してみてください」「〜がお守りに」を多用する。
4. **断定語は禁止**。「絶対」「必ず」「決して」「間違いなく」は使わない。代わりに「傾向」「印象」「サイン」「気配」「日和」で軟化。
5. **絵文字は UI レイヤーのみ**。`FORTUNES` カタログの `emoji` フィールドだけ。`data.ts` 本文には絵文字を入れない。
6. **句読点で息継ぎを作る**。一文 30〜50 字を目安に「。」で切る。
7. **物 (もの) は具体的に**。`luckyItem` は "陶器のカップ" "一冊の本" "旅のしおり" のように画が浮かぶ言葉で。

### お手本 (`src/fortunes/*/data.ts` から)

```
大吉 — total:
  視界がぐんと開けるような、晴れ晴れとした流れの日。
  心の声に素直に従うと、思いがけない扉が見えてきそうです。

吉 — total:
  ゆるやかな追い風の日。焦らずに、いまできる一歩を踏み出してみましょう。

牡羊座 — catchphrase:
  最初の一歩を踏み出す勇気の人

牡羊座 — advice:
  迷ったら、まず一歩。

樹星 — summary:
  一本の樹のように、自分の世界を時間をかけて育てるタイプ。
  誰かに合わせるより、自分のペースで根を張ります。

樹星 — advice:
  今日も、自分のペースを守り抜く。
```

`advice` は俳句のように短く (10〜15 字)、`summary` は 2 文で気質を描く、`shadow` は否定せず「〜が顔を出すとき。」と現象として書く。

### UI コピー (フォーム・エラー・ボタン)

UI 文言は本文と違い**淡い敬体 OK**。長文化を避ける。

- ✅ 「占う」「結果を見る」「閉じる」「入力をやり直す」
- ✅ 「姓と名を両方入力すると、姓名判断とおみくじも結果に追加されます。」
- ❌ 「占ってみますか？」(疑問形は冗長)
- ❌ 「申し訳ございませんが、入力に誤りがあります」(過剰敬語)

---

## 8. 著作権・商標の制約 (Load-bearing)

`CLAUDE.md` の "Copyright / trademark constraints" の要約。**ここに書いた制約は破ると製品の根幹が崩れる**ので、新規データを書く前に必ず読む。

### 使ってはいけない名称

- **算命学十大主星名**: `貫索星 / 石門星 / 鳳閣星 / 調舒星 / 禄存星 / 司禄星 / 車騎星 / 牽牛星 / 龍高星 / 玉堂星`。`sanmei` は独自の `樹星 / 苑星 / 暁星 / 灯星 / 巌星 / 野星 / 鋒星 / 玉星 / 河星 / 露星` を使う。
- **流派名**: 「〇〇式」「〇〇流」「〇〇派」を冠さない。
- **占い師名**: 個人名・屋号・キャラクター名は出さない。

### コピー禁止

- ライダー版タロット (Rider-Waite) や他の出版済みデッキの**構図・配色・象徴**を真似ない。`src/components/TarotCard.tsx` の SVG モチーフは抽象的な幾何 (同心円・五芒星) のみで構成されている。
- 占いサイト・書籍の解釈テキストを**短い表現でも貼り付けない**。`data.ts` の本文はすべて自前で書く。

---

## 9. やってはいけない 10 個 (チェックリスト)

新規 PR を出す前に流し読み:

1. ❌ 本文に断定語 (「絶対」「必ず」「決して」「間違いなく」) を書く
2. ❌ 算命学十大主星名・流派名・占い師名・「〇〇式」を出す
3. ❌ 既存デッキ (Rider-Waite 等) の構図・色・象徴を `TarotCard` に持ち込む
4. ❌ `tracking-[0.4em]` などの大きな字間装飾を**日本語**に当てる
5. ❌ `text-ink/40` 以下のコントラストを使う
6. ❌ 操作要素から `:focus-visible` の outline を消す (代替なしで)
7. ❌ `data.ts` の本文に絵文字を入れる
8. ❌ 外部フォントを読み込む / 独自フォントを bundle する
9. ❌ 新しい色を `@theme` 外に書く (HEX 直書き)。新色を入れたい時はまず本ドキュメントを更新してから
10. ❌ 新しいアニメを足したのに `prefers-reduced-motion` ブロックを更新し忘れる

---

## 10. 新しい占いを足すときの手順

1. `src/fortunes/<id>/` を作り `data.ts` (or `signs.ts` / `stars.ts` 等) と `engine.ts` を置く
2. `engine.ts` は `(input) => FortuneResult` の純粋関数 (`src/fortunes/types.ts`)
3. 本文を本ドキュメント §7「声と語法」のルールで書く
4. `src/fortunes/types.ts` の `FortuneId` と `FORTUNES` カタログにエントリを追加 (id / displayName / traditionalName / description / emoji / accent の 6 つすべて必須)
5. `src/pages/Home.tsx` に `<FortuneBlock>` を追加 (既存ブロックをコピーすれば自然に reveal アニメに乗る)
6. **3 か所のハードコード箇所を更新する** (CLAUDE.md にも記載):
   - `src/components/Layout.tsx` のフッター文の件数
   - `src/pages/Home.tsx` のフォーム見出し「7つの占いを、…」
   - `index.html` の `<title>`
7. `npm run build` (TS strict + 0 warning) → `npm run lint` を通す

---

## 改訂履歴

このファイル自体を直す時は本表に行を足す:

| 日付       | 内容                                                       |
| ---------- | ---------------------------------------------------------- |
| 2026-05-10 | 初版。既存トンマナの成文化と semantic token 層・focus 規約・OG meta の追加。 |
