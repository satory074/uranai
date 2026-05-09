import type { FortuneResult } from '../types';
import { createRng, shuffle, todayIsoDate } from '../../lib/seedRandom';
import { MAJOR_ARCANA, type Card } from './cards';

export type DrawnCard = {
  card: Card;
  reversed: boolean;
};

export type DrawOptions = {
  seedHint?: string;
};

export function drawOne(opts: DrawOptions = {}): { drawn: DrawnCard; result: FortuneResult } {
  const seed = `tarot1|${opts.seedHint ?? `${todayIsoDate()}|${Date.now()}|${Math.random()}`}`;
  const rng = createRng(seed);
  const card = shuffle(rng, MAJOR_ARCANA)[0];
  const reversed = rng() < 0.5;
  const drawn: DrawnCard = { card, reversed };

  const meaning = reversed ? card.reversed : card.upright;

  return {
    drawn,
    result: {
      title: `${card.name} ${reversed ? '（逆位置）' : '（正位置）'}`,
      subtitle: `1枚引き / ${card.alias}`,
      summary: meaning.body,
      sections: [
        { title: 'キーワード', body: meaning.keywords.join('、') },
        { title: 'メッセージ', body: meaning.body },
      ],
      meta: {
        カード: card.name,
        英名: card.alias,
        位置: reversed ? '逆位置' : '正位置',
        番号: String(card.num),
      },
    },
  };
}

export function drawThree(opts: DrawOptions = {}): { drawn: DrawnCard[]; result: FortuneResult } {
  const seed = `tarot3|${opts.seedHint ?? `${todayIsoDate()}|${Date.now()}|${Math.random()}`}`;
  const rng = createRng(seed);
  const picked = shuffle(rng, MAJOR_ARCANA).slice(0, 3);
  const drawn: DrawnCard[] = picked.map((card) => ({ card, reversed: rng() < 0.5 }));

  const labels = ['過去', '現在', '未来'];
  const sections = drawn.map((d, i) => {
    const m = d.reversed ? d.card.reversed : d.card.upright;
    return {
      title: `${labels[i]} — ${d.card.name}${d.reversed ? '（逆）' : '（正）'}`,
      body: `${m.keywords.join('、')}\n\n${m.body}`,
    };
  });

  return {
    drawn,
    result: {
      title: '過去・現在・未来 3枚スプレッド',
      subtitle: drawn.map((d) => `${d.card.name}${d.reversed ? '逆' : ''}`).join(' / '),
      summary: '3枚のカードがそれぞれの時間軸からのメッセージを伝えています。一枚ずつ、じっくり受け取ってみてください。',
      sections,
      meta: {
        過去: `${drawn[0].card.name}（${drawn[0].reversed ? '逆位置' : '正位置'}）`,
        現在: `${drawn[1].card.name}（${drawn[1].reversed ? '逆位置' : '正位置'}）`,
        未来: `${drawn[2].card.name}（${drawn[2].reversed ? '逆位置' : '正位置'}）`,
      },
    },
  };
}
