import type { FortuneResult } from '../types';
import { findSign } from './signs';

export type AstrologyInput = { year: number; month: number; day: number };

export function readSunSign({ year, month, day }: AstrologyInput): FortuneResult {
  const sign = findSign(month, day);
  return {
    title: `${sign.name} ${sign.symbol}  ${sign.catchphrase}`,
    subtitle: `${year}年${month}月${day}日生まれ / 太陽星座 ${sign.alias}`,
    summary: sign.summary,
    sections: [
      { title: '基本性質', body: sign.general },
      { title: '愛情・対人', body: sign.love },
      { title: '仕事・才能', body: sign.work },
      { title: '伸ばすヒント', body: sign.growth },
      { title: '気をつけたい瞬間', body: sign.shadow },
    ],
    luckyColor: sign.luckyColor,
    luckyItem: sign.luckyItem,
    advice: sign.advice,
    meta: {
      星座: sign.name,
      期間: sign.range,
      エレメント: sign.element,
      支配星: sign.ruler,
    },
  };
}
