# うらない百貨 (Uranai Hyakka)

8 種類の占いをまとめて楽しめる、無料の静的占いサイト。GitHub Pages で動作します。

## 占い一覧

| # | 表示名 | 内部キー | 入力 |
|---|---|---|---|
| 1 | 今日のおみくじ（おみくじ） | `omikuji` | 名前（任意） |
| 2 | オリジナルタロット 1枚引き（タロット占い） | `tarot-one` | — |
| 3 | 悩み別タロット 3枚引き（タロット占い） | `tarot-three` | — |
| 4 | 名前運勢診断（姓名判断・簡易版） | `seimei` | 姓・名 |
| 5 | 星読み診断（西洋占星術・太陽星座） | `astrology` | 生年月日 |
| 6 | 九星タイプ診断（九星気学・本命星） | `kyusei` | 生年月日 |
| 7 | 十干タイプ診断（四柱推命・日干） | `shichu` | 生年月日 |
| 8 | 東洋命式タイプ診断（算命学風・独自10星） | `sanmei` | 生年月日 |

すべての結果文・解説文・カード解釈はオリジナルテンプレートです。特定流派・特定占い師・既存サービスの命名は採用していません。

## 技術スタック

- **Vite 8** + **React 19** + **TypeScript 6**
- **Tailwind CSS v4** (`@tailwindcss/vite` 公式プラグイン)
- **React Router v7** (HashRouter)
- **GitHub Actions** + `actions/deploy-pages@v4`

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド (TypeScript 型チェック含む)
npm run preview  # ビルド結果のローカルプレビュー
```

開発サーバーは `http://localhost:5173/uranai/` で起動します（basePath が `/uranai/` のため）。

## デプロイ手順（GitHub Pages）

1. このリポジトリを GitHub の `satory074/uranai` として push する
2. GitHub の **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に切り替える
3. `main` ブランチへ push すると `.github/workflows/deploy.yml` が自動実行され、`https://satory074.github.io/uranai/` に公開される

ローカルとのパス整合のため、`vite.config.ts` の `base` および `index.html` 内のパス指定はすべて `/uranai/` 前提です。リポジトリ名を変更する場合は `vite.config.ts` の `base` も合わせて更新してください。

## ディレクトリ構成

```
src/
├── main.tsx                  # HashRouter ルート定義
├── index.css                 # Tailwind v4 + テーマ変数
├── components/               # Layout, FortuneResultView, DateInput, NameInput, TarotCard, PageHero
├── pages/                    # 8 占いの画面 + Home
├── fortunes/                 # 占いごとのデータ + エンジン
│   ├── types.ts              # FortuneResult 共通型 + 占いカタログ
│   ├── omikuji/, tarot/, seimei/, astrology/, kyusei/, shichu/, sanmei/
└── lib/                      # seedRandom (mulberry32), julianDay, kanjiStrokes
```

## 算出アルゴリズム概要

- **おみくじ**: `(日付 + 名前)` をシードに mulberry32 で重み付き抽選 → 6ランク × 5運勢
- **タロット**: 大アルカナ22枚から Fisher-Yates でシャッフル、正/逆位置を独立抽選
- **姓名判断**: 新字体ベースの画数辞書から五格を計算、1文字姓・1文字名は霊数1で補完
- **星読み診断**: 12星座を固定の代表境界値で判定（簡易判定／月星座・ASC は対象外）
- **九星タイプ診断**: 西暦のデジタルルートを11から減算、1月1日〜2月3日生まれは前年扱い（立春切替）
- **十干タイプ診断**: ユリウス通日 → 干支インデックス → 日干（甲〜癸）→ 独自タイプ名
- **東洋命式タイプ診断**: 立春切替の年干 → 完全独自命名10星

## 注意事項

- 占い結果はエンターテインメントです。結果の正確性・効果を保証するものではありません。
- 結果文・カード解釈・タイプ説明は本サイトのオリジナル表現です。
- 姓名判断の画数判定は新字体ベースの簡易計算です。流派により差異があります。
- 西洋占星術は太陽星座のみの簡易判定です（ASC・月星座・ホロスコープチャートは未対応）。
- 九星気学・四柱推命・算命学風タイプ診断は、本格命式ではなく入門的な「タイプ診断」です。

## ライセンス

ソースコードのライセンスは未指定です（必要に応じて追加してください）。
画数辞書とテンプレート文章は本リポジトリのオリジナルです。
