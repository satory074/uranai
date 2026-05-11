import type { FortuneResult } from '../types';
import type { Category } from './data';
import { createRng, pick, pickWeighted, todayIsoDate } from '../../lib/seedRandom';
import { RANKS, TEMPLATES, COLORS, ITEMS, ACTIONS } from './data';

export type OmikujiInput = {
  name?: string;
};

export function drawOmikuji({ name }: OmikujiInput = {}): FortuneResult {
  const today = todayIsoDate();
  const seed = `omikuji|${today}|${name ?? 'guest'}`;
  const rng = createRng(seed);

  const rank = pickWeighted(
    rng,
    RANKS.map((r) => ({ value: r, weight: r.weight })),
  );

  const [lo, hi] = rank.score;
  const score = Math.floor(lo + rng() * (hi - lo + 1));

  const t = TEMPLATES[rank.name];
  const compose = (cat: Category) => `${pick(rng, t[cat].open)}${pick(rng, t[cat].close)}`;

  const sections = [
    { title: '全体運', body: compose('total') },
    { title: '恋愛運', body: compose('love') },
    { title: '仕事運', body: compose('work') },
    { title: '金運',   body: compose('money') },
    { title: '健康運', body: compose('health') },
  ];

  return {
    title: rank.name,
    subtitle: `${today}${name ? ` / ${name}` : ''} のおみくじ`,
    score,
    summary: sections[0].body,
    sections: sections.slice(1),
    luckyColor: pick(rng, COLORS),
    luckyItem: pick(rng, ITEMS),
    advice: pick(rng, ACTIONS),
    meta: { 日付: today, 名前: name || '（未入力）' },
  };
}
