export type FortuneSection = {
  title: string;
  body: string;
};

export type FortuneResult = {
  title: string;
  subtitle?: string;
  score?: number;
  summary: string;
  sections: FortuneSection[];
  luckyColor?: string;
  luckyItem?: string;
  advice?: string;
  meta?: Record<string, string>;
};

export type FortuneId =
  | 'omikuji'
  | 'tarot-three'
  | 'seimei'
  | 'astrology'
  | 'kyusei'
  | 'shichu'
  | 'sanmei';

export type FortuneInfo = {
  id: FortuneId;
  displayName: string;
  traditionalName: string;
  description: string;
  emoji: string;
  accent: string;
};

export const FORTUNES: FortuneInfo[] = [
  {
    id: 'omikuji',
    displayName: '今日のおみくじ',
    traditionalName: 'おみくじ',
    description:
      'お名前と今日の日付をもとに、6段階のランクと5つの運勢（恋愛・仕事・学業・金運・健康）を一度に引く、おみくじ風の占いです。',
    emoji: '🎋',
    accent: 'from-rose-200 to-amber-200',
  },
  {
    id: 'tarot-three',
    displayName: '悩み別タロット',
    traditionalName: 'タロット占い・3枚引き',
    description:
      'タロット22枚から「過去・現在・未来」を1枚ずつ引く3枚引きです。今のあなたを取り巻く流れを、3つの視点で眺めます。',
    emoji: '🔮',
    accent: 'from-purple-200 to-pink-200',
  },
  {
    id: 'seimei',
    displayName: '名前運勢診断',
    traditionalName: '姓名判断・簡易版',
    description:
      'お名前の漢字の画数から、5つの格（天格・人格・地格・外格・総格）を導く姓名判断の簡易版。名前から見える印象や傾向を言葉にします。',
    emoji: '🖋️',
    accent: 'from-emerald-200 to-teal-200',
  },
  {
    id: 'astrology',
    displayName: '星読み診断',
    traditionalName: '西洋占星術・今日の星読み',
    description:
      'あなたの太陽星座をレンズに、今日の月の星座と組み合わせて「今日の星読み」を返します。全体・恋愛・仕事・健康の 4 つの場面と、ラッキーカラー・ラッキーアイテムを日替わりでお届けします。',
    emoji: '✨',
    accent: 'from-sky-200 to-blue-200',
  },
  {
    id: 'kyusei',
    displayName: '九星タイプ診断',
    traditionalName: '九星気学・本命星',
    description:
      '九星気学の「本命星」9タイプを生まれ年から導きます。生まれ持った気質や行動の傾向が分かります。立春（2月4日）を区切りに年を判定します。',
    emoji: '🌙',
    accent: 'from-amber-200 to-yellow-200',
  },
  {
    id: 'shichu',
    displayName: '十干タイプ診断',
    traditionalName: '四柱推命・日干',
    description:
      '四柱推命で用いる「十干（じっかん）」のうち、生年月日から導く「日干（にっかん）」で、あなたの素材タイプを10通りに診断します。',
    emoji: '🌳',
    accent: 'from-lime-200 to-green-200',
  },
  {
    id: 'sanmei',
    displayName: '東洋命式タイプ診断',
    traditionalName: '算命学風・独自10星',
    description:
      '東洋の命式占いを参考にした、独自10星タイプ診断です。生年から導かれるタイプで、あなたの個性や傾向を眺めます。立春（2月4日）を区切りに年を判定します。',
    emoji: '⭐',
    accent: 'from-fuchsia-200 to-rose-200',
  },
];
