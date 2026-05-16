import type { FortuneResult } from '../types';
import { findSign } from './signs';
import { moonSignName, type MoonSignName } from '../../lib/moonSign';
import { createRng, pick } from '../../lib/seedRandom';
import {
  MOON_MOOD,
  RESONANCE,
  DAILY_ACTION,
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

export function readSunSign({ year, month, day }: AstrologyInput): FortuneResult {
  const sign = findSign(month, day);

  // 今日 (クライアントのローカル日付) を取得して月の星座を計算する。
  // 太陽星座の本質判断は生年月日から不変だが、月星座・合成文・ラッキー要素は日替わりで変わる。
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

  const moonBody = `${pick(rng, moonMood.open)}${pick(rng, moonMood.close)}`;
  const resonanceBody = `${pick(rng, resonance.open)}${pick(rng, resonance.close)}`;
  const dailyAdvice = `${pick(rng, DAILY_ACTION.open)}${pick(rng, DAILY_ACTION.close)}`;

  return {
    title: `${sign.name} ${sign.symbol}  ${sign.catchphrase}`,
    subtitle: `${year}年${month}月${day}日生まれ / 太陽星座 ${sign.alias} / 今日の月: ${moonName}`,
    summary: sign.summary,
    sections: [
      { title: '基本性質', body: sign.general },
      { title: '愛情・対人', body: sign.love },
      { title: '仕事・才能', body: sign.work },
      { title: '伸ばすヒント', body: sign.growth },
      { title: '気をつけたい瞬間', body: sign.shadow },
      { title: '今日の月空', body: moonBody },
      { title: '本質との響き', body: resonanceBody },
    ],
    luckyColor: pick(rng, DAILY_COLORS),
    luckyItem: pick(rng, DAILY_ITEMS),
    advice: dailyAdvice,
    meta: {
      星座: sign.name,
      期間: sign.range,
      エレメント: sign.element,
      支配星: sign.ruler,
      今日の月: moonName,
      本来のラッキーカラー: sign.luckyColor,
      本来のラッキーアイテム: sign.luckyItem,
    },
  };
}
