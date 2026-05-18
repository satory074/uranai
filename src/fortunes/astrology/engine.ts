import type { FortuneResult } from '../types';
import { findSign, SIGNS, type Sign } from './signs';
import { moonSignName, type MoonSignName } from '../../lib/moonSign';
import { createRng, pick, pickWeighted } from '../../lib/seedRandom';
import {
  MOON_MOOD,
  RESONANCE,
  DAILY_ACTION,
  DAILY_CATEGORY,
  DAILY_COLORS,
  DAILY_ITEMS,
  type Element,
  type ElementPair,
} from './dailyData';

export type AstrologyInput = { year: number; month: number; day: number };

export type AstrologyOptions = {
  /** 表示対象の星座を強制指定する。生まれた星座とは別の星座の今日の運勢を見たいときに使う。 */
  signOverride?: Sign;
};

const ELEMENT_BY_MOON_SIGN: Record<MoonSignName, Element> = {
  牡羊座: '火', 獅子座: '火', 射手座: '火',
  牡牛座: '土', 乙女座: '土', 山羊座: '土',
  双子座: '風', 天秤座: '風', 水瓶座: '風',
  蟹座: '水', 蠍座: '水', 魚座: '水',
};

// 5 段階評価の中央寄り加重 (1=7% / 2=20% / 3=33% / 4=27% / 5=13%)。
// 1〜5 一様より、テキストとの整合感が取りやすく「いい日/悪い日」の濃淡も穏やかになる。
const RATING_WEIGHTS = [
  { value: 1, weight: 1 },
  { value: 2, weight: 3 },
  { value: 3, weight: 5 },
  { value: 4, weight: 4 },
  { value: 5, weight: 2 },
] as const;

function todayParts(): { y: number; m: number; d: number; iso: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return { y, m, d, iso };
}

export function readSunSign(
  { year, month, day }: AstrologyInput,
  options?: AstrologyOptions,
): FortuneResult {
  const isOverride = options?.signOverride != null;
  const sign = options?.signOverride ?? findSign(month, day);

  // 今日 (クライアントのローカル日付) を取得して月の星座を計算する。
  // 太陽星座は不変の「あなたが何座か」というラベルだけに使い、
  // 結果テキストは月の星座と日付から日替わりで合成する。
  const { y: todayY, m: todayM, d: todayD, iso: todayIso } = todayParts();
  const moonName = moonSignName(todayY, todayM, todayD);
  const moonElement = ELEMENT_BY_MOON_SIGN[moonName];
  const sunElement: Element = sign.element;
  const pairKey: ElementPair = `${sunElement}-${moonElement}`;

  // 同一人物・同一日には同じ結果を返すための決定論シード。
  // 太陽座・月座・今日の日付の組み合わせを文字列化して 64bit ハッシュに通す。
  const seed = `astrology|${sign.alias}|${moonName}|${todayIso}`;
  const rng = createRng(seed);

  const moonMood = MOON_MOOD[moonName];
  const resonance = RESONANCE[pairKey];

  // 今日のテーマ (summary) は「月星座の空気 + 元素ペアの行動ヒント」を合成。
  // → MOON_MOOD と RESONANCE はラッキー要素と並び、本文の核として再利用する。
  const summary = `${pick(rng, moonMood.open)}${pick(rng, resonance.close)}`;

  const composeCategory = (cat: keyof typeof DAILY_CATEGORY) =>
    `${pick(rng, DAILY_CATEGORY[cat].open)}${pick(rng, DAILY_CATEGORY[cat].close)}`;

  // signOverride が指定されているときは、生年月日の併記を省く
  // (ユーザー本来の星座と異なる星座を覗いている状況なので、生年月日表示は文脈を混乱させるため)
  const subtitle = isOverride
    ? `太陽 ${sign.alias} × 月 ${moonName} / ${todayIso}`
    : `${year}年${month}月${day}日生まれ / 太陽 ${sign.alias} × 月 ${moonName} / ${todayIso}`;

  return {
    title: `${sign.name} ${sign.symbol}  今日の星読み`,
    subtitle,
    summary,
    sections: [
      { title: '全体運', body: composeCategory('overall'), rating: pickWeighted(rng, RATING_WEIGHTS) },
      { title: '恋愛運', body: composeCategory('love'),    rating: pickWeighted(rng, RATING_WEIGHTS) },
      { title: '仕事運', body: composeCategory('work'),    rating: pickWeighted(rng, RATING_WEIGHTS) },
      { title: '健康運', body: composeCategory('health'),  rating: pickWeighted(rng, RATING_WEIGHTS) },
    ],
    luckyColor: pick(rng, DAILY_COLORS),
    luckyItem: pick(rng, DAILY_ITEMS),
    advice: `${pick(rng, DAILY_ACTION.open)}${pick(rng, DAILY_ACTION.close)}`,
    meta: {
      太陽星座: sign.name,
      太陽の元素: sign.element,
      今日の月の星座: moonName,
      月の元素: moonElement,
      元素ペア: pairKey,
      占い日: todayIso,
    },
  };
}

export type RankingEntry = {
  sign: Sign;
  total: number; // 4 セクションの星評価 (各 1〜5) を足した 4〜20 の整数
  rank: number;  // 1〜12 (同点はランキング配列の順で先着順)
};

/**
 * 今日の 12 星座すべてに対して `readSunSign` を擬似的に呼んで星評価の合計を計算し、
 * 総合運+恋愛運+仕事運+健康運 (各 1〜5) の合計順で並べる。
 * 同点は SIGNS の宣言順 (=牡羊→魚) で先勝ち。
 *
 * 注: `readSunSign` をフルに 12 回呼ぶので合成テキストも作るが、
 *     計算量は微々たるもの (シード生成 + 配列インデックス計算のみ) なので問題なし。
 */
export function dailyRanking(birthHint?: AstrologyInput): RankingEntry[] {
  // birthHint は subtitle の生年月日表記用に渡しているが、ランキングの算出には使わない。
  // (rating は seed = `astrology|alias|moon|today` から決まり、birth date は seed に入らないため)
  const dummy: AstrologyInput = birthHint ?? { year: 2000, month: 1, day: 1 };
  const computed = SIGNS.map((sign) => {
    const r = readSunSign(dummy, { signOverride: sign });
    const total = r.sections.reduce((sum, s) => sum + (s.rating ?? 0), 0);
    return { sign, total };
  });
  computed.sort((a, b) => b.total - a.total);
  return computed.map((entry, i) => ({ ...entry, rank: i + 1 }));
}
