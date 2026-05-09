import type { FortuneResult, FortuneId } from '../fortunes/types';

export function deriveHeadline(r: FortuneResult, id: FortuneId): string[] {
  if (id === 'tarot-three') {
    const kw = r.sections[0]?.body.split('\n\n')[0] ?? '';
    const chips = kw.split('、').map((s) => s.trim()).filter(Boolean);
    if (chips.length > 0) return chips.slice(0, 4);
  }
  const parts = r.title.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) return parts;
  return [r.title];
}

export function deriveOneLiner(r: FortuneResult, id: FortuneId): string {
  if (id === 'omikuji') return r.title;
  if (id === 'tarot-three') return r.subtitle ?? r.title;
  if (id === 'seimei') {
    if (typeof r.score === 'number') {
      const tail = r.sections[0]?.title.split('—')[1]?.trim();
      return tail ? `${r.score}点・${tail}` : `${r.score}点`;
    }
    return r.title;
  }
  return r.title.replace(/\s{2,}/, ' — ');
}
