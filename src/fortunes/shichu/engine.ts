import type { FortuneResult } from '../types';
import { dayStemBranch } from '../../lib/julianDay';
import { STEM_TYPES } from './stems';

export type ShichuInput = { year: number; month: number; day: number };

export function readShichu({ year, month, day }: ShichuInput): FortuneResult {
  const { stem, branch, stemIndex } = dayStemBranch(year, month, day);
  const t = STEM_TYPES[stemIndex];

  return {
    title: `${t.typeName}  ${t.catchphrase}`,
    subtitle: `${year}年${month}月${day}日生まれ / 日干 ${stem}（${t.stemKana}）`,
    summary: t.summary,
    sections: [
      { title: '基本性質', body: t.general },
      { title: '愛情・対人', body: t.love },
      { title: '仕事・才能', body: t.work },
      { title: '伸ばすヒント', body: t.growth },
      { title: '気をつけたい瞬間', body: t.shadow },
    ],
    luckyColor: t.luckyColor,
    luckyItem: t.luckyItem,
    advice: t.advice,
    meta: {
      日干: `${stem}（${t.stemKana}）`,
      日支: branch,
      陰陽: t.yinYang,
      五行: t.element,
      タイプ: t.typeName,
    },
  };
}
