import type { FortuneResult } from '../types';
import { createRng, pick, pickWeighted, todayIsoDate } from '../../lib/seedRandom';
import { RANKS, TEMPLATES, COLORS, ITEMS, ACTIONS } from './data';

export type OmikujiInput = {
  name?: string;
  date?: string;
};

export function drawOmikuji({ name, date }: OmikujiInput = {}): FortuneResult {
  const today = date ?? todayIsoDate();
  const seed = `omikuji|${today}|${name ?? 'guest'}`;
  const rng = createRng(seed);

  const rank = pickWeighted(
    rng,
    RANKS.map((r) => ({ value: r, weight: r.weight })),
  );

  const [lo, hi] = rank.score;
  const score = Math.floor(lo + rng() * (hi - lo + 1));

  const t = TEMPLATES[rank.name];
  const sections = [
    { title: '全体運', body: pick(rng, t.total) },
    { title: '恋愛運', body: pick(rng, t.love) },
    { title: '仕事運', body: pick(rng, t.work) },
    { title: '金運',   body: pick(rng, t.money) },
    { title: '健康運', body: pick(rng, t.health) },
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
