import type { FortuneResult } from '../types';
import { findSign } from './signs';
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

export function readSunSign({ year, month, day }: AstrologyInput): FortuneResult {
  const sign = findSign(month, day);

  // 今日 (クライアントのローカル日付) を取得して月の星座を計算する。
  // 太陽星座は不変の「あなたが何座か」というラベルだけに使い、
  // 結果テキストは月の星座と日付から日替わりで合成する。
  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = now.getMonth() + 1;
  const todayD = now.getDate();
  const todayIso = `${todayY}-${String(todayM).padStart(2, '0')}-${String(todayD).padStart(2, '0')}`;
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

  return {
    title: `${sign.name} ${sign.symbol}  今日の星読み`,
    subtitle: `${year}年${month}月${day}日生まれ / 太陽 ${sign.alias} × 月 ${moonName} / ${todayIso}`,
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
