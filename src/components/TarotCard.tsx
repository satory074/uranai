import type { Card } from '../fortunes/tarot/cards';

const MOTIFS: Record<number, string> = {
  0: '○',  1: '☉',  2: '☾',  3: '✿',  4: '♛',  5: '☥',
  6: '♡',  7: '⚔',  8: '∞',  9: '✦', 10: '◯', 11: '⚖',
  12: '✟', 13: '✦', 14: '∞', 15: '☥', 16: '⚡', 17: '★',
  18: '☾', 19: '☀', 20: '✩', 21: '✧',
};

export function TarotCard({
  card,
  reversed = false,
  size = 'md',
}: {
  card: Card;
  reversed?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims =
    size === 'sm' ? 'w-24 h-40' : size === 'lg' ? 'w-48 h-72' : 'w-32 h-52';

  return (
    <div
      className={`${dims} rounded-xl border-2 border-amber-700/30 bg-gradient-to-b from-indigo-900 to-violet-950 text-amber-200 shadow-md flex flex-col items-center justify-between p-3 relative overflow-hidden`}
      style={{ transform: reversed ? 'rotate(180deg)' : undefined }}
      aria-label={`${card.name}${reversed ? '逆位置' : '正位置'}`}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="text-[10px] tracking-widest font-serif">{String(card.num).padStart(2, '0')}</div>
      <div className="text-5xl font-light leading-none">{MOTIFS[card.num] ?? '✦'}</div>
      <div className="text-center">
        <div className="font-serif text-sm leading-tight">{card.name}</div>
        <div className="text-[8px] tracking-widest text-amber-200/60 mt-0.5">{card.alias.toUpperCase()}</div>
      </div>
    </div>
  );
}
