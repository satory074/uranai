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

