import type { FortuneResult } from '../types';
import { yearStemBranch } from '../../lib/julianDay';
import { SANMEI_STARS } from './stars';

export type SanmeiInput = { year: number; month: number; day: number };

export function readSanmei({ year, month, day }: SanmeiInput): FortuneResult {
  const { stem, branch, stemIndex } = yearStemBranch(year, month, day);
  const s = SANMEI_STARS[stemIndex];

  const beforeRisshun = month === 1 || (month === 2 && day < 4);

  return {
    title: `${s.starName}  ${s.catchphrase}`,
    subtitle: `${year}年${month}月${day}日生まれ / ${s.starName}（${s.axis}）`,
    summary: s.summary,
    sections: [
      { title: '基本性質', body: s.general },
      { title: '愛情・対人', body: s.love },
      { title: '仕事・才能', body: s.work },
      { title: '伸ばすヒント', body: s.growth },
      { title: '気をつけたい瞬間', body: s.shadow },
    ],
    luckyColor: s.luckyColor,
    luckyItem: s.luckyItem,
    advice: s.advice,
    meta: {
      タイプ: s.starName,
      軸: s.axis,
      年干: stem,
      年支: branch,
      備考: beforeRisshun ? '立春前のため前年扱いで算出' : '通常算出',
    },
  };
}
