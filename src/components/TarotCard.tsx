import type { CSSProperties } from 'react';
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
  revealIndex = 0,
  flipped = true,
  position,
}: {
  card: Card;
  reversed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  revealIndex?: number;
  flipped?: boolean;
  position?: string;
}) {
  const dims =
    size === 'sm' ? 'w-24 h-40' : size === 'lg' ? 'w-48 h-72' : 'w-32 h-52';

  const sceneStyle = { ['--reveal-i']: revealIndex } as CSSProperties;
  const faceClass =
    'card-face rounded-xl border-2 border-amber-700/30 bg-gradient-to-b from-indigo-900 to-violet-950 text-amber-200 shadow-md flex flex-col items-center justify-between p-3 overflow-hidden';
  const keywords = (reversed ? card.reversed.keywords : card.upright.keywords).join('・');

  return (
    <div
      className={`card-scene ${dims} relative`}
      style={sceneStyle}
      aria-label={`${position ? position + ' — ' : ''}${card.name} ${reversed ? '逆位置' : '正位置'}`}
      role="img"
    >
      <div className="card-flipper" data-flipped={flipped ? 'true' : 'false'}>
        <div className={`${faceClass} card-face-back`} aria-hidden>
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="0.4" />
              <path
                d="M50 14 L58 42 L88 42 L63 60 L72 88 L50 70 L28 88 L37 60 L12 42 L42 42 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <div className="text-[10px] tracking-[0.4em] font-serif opacity-80">URANAI</div>
          <div className="text-4xl font-light leading-none opacity-90">✦</div>
          <div className="text-[8px] tracking-[0.4em] font-serif opacity-70">HYAKKA</div>
        </div>
        <div className={`${faceClass} card-face-front`}>
          {position && (
            <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-amber-200/15 text-amber-200/85 text-[8px] tracking-[0.2em] font-serif z-10 pointer-events-none">
              {position}
            </div>
          )}
          <div
            className="card-orient absolute inset-0 flex flex-col items-center justify-between p-3"
            data-reversed={reversed ? 'true' : 'false'}
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
              <div className="text-[8px] tracking-wider text-amber-200/70 mt-1 leading-tight">{keywords}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
