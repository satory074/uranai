import type { FortuneResult } from '../types';
import { STARS, honmeiNumber } from './data';

export type KyuseiInput = { year: number; month: number; day: number };

export function readKyusei({ year, month, day }: KyuseiInput): FortuneResult {
  const num = honmeiNumber(year, month, day);
  const star = STARS[num - 1];

  const beforeRisshun = month === 1 || (month === 2 && day < 4);
  const useYear = beforeRisshun ? year - 1 : year;

  return {
    title: `${star.name}  ${star.catchphrase}`,
    subtitle: `${year}年${month}月${day}日生まれ / 本命星 ${star.name}`,
    summary: star.summary,
    sections: [
      { title: '基本性質', body: star.general },
      { title: '愛情・対人', body: star.love },
      { title: '仕事・才能', body: star.work },
      { title: '伸ばすヒント', body: star.growth },
      { title: '気をつけたい瞬間', body: star.shadow },
    ],
    luckyColor: star.luckyColor,
    luckyItem: star.luckyItem,
    advice: star.advice,
    meta: {
      本命星: star.name,
      五行: star.element,
      算出年: `${useYear}年${beforeRisshun ? '（立春前のため前年扱い）' : ''}`,
    },
  };
}
