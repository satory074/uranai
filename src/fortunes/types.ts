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
  | 'tarot-one'
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
  tagline: string;
  emoji: string;
  accent: string;
};

export const FORTUNES: FortuneInfo[] = [
  {
    id: 'omikuji',
    displayName: '今日のおみくじ',
    traditionalName: 'おみくじ',
    tagline: '今日のあなたへ、ささやかな指針を一枚。',
    emoji: '🎋',
    accent: 'from-rose-200 to-amber-200',
  },
  {
    id: 'tarot-one',
    displayName: 'オリジナルタロット',
    traditionalName: 'タロット占い・1枚引き',
    tagline: '大アルカナから一枚を引き、今のヒントを得る。',
    emoji: '🃏',
    accent: 'from-violet-200 to-indigo-200',
  },
  {
    id: 'tarot-three',
    displayName: '悩み別タロット',
    traditionalName: 'タロット占い・3枚引き',
    tagline: '過去・現在・未来を3枚で読み解く。',
    emoji: '🔮',
    accent: 'from-purple-200 to-pink-200',
  },
  {
    id: 'seimei',
    displayName: '名前運勢診断',
    traditionalName: '姓名判断・簡易版',
    tagline: '名前の画数から、印象と傾向を眺める。',
    emoji: '🖋️',
    accent: 'from-emerald-200 to-teal-200',
  },
  {
    id: 'astrology',
    displayName: '星読み診断',
    traditionalName: '西洋占星術・太陽星座',
    tagline: '12星座のあなたらしさを言葉にする。',
    emoji: '✨',
    accent: 'from-sky-200 to-blue-200',
  },
  {
    id: 'kyusei',
    displayName: '九星タイプ診断',
    traditionalName: '九星気学・本命星',
    tagline: '生まれ年から導く9つの本命タイプ。',
    emoji: '🌙',
    accent: 'from-amber-200 to-yellow-200',
  },
  {
    id: 'shichu',
    displayName: '十干タイプ診断',
    traditionalName: '四柱推命・日干',
    tagline: '日干から見る、あなたの素材タイプ。',
    emoji: '🌳',
    accent: 'from-lime-200 to-green-200',
  },
  {
    id: 'sanmei',
    displayName: '東洋命式タイプ診断',
    traditionalName: '算命学風・独自10星',
    tagline: '生年から導く独自10星のタイプ。',
    emoji: '⭐',
    accent: 'from-fuchsia-200 to-rose-200',
  },
];
