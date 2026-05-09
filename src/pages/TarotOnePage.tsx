import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { FortuneResultView } from '../components/FortuneResultView';
import { TarotCard } from '../components/TarotCard';
import { drawOne, type DrawnCard } from '../fortunes/tarot/engine';
import type { FortuneResult } from '../fortunes/types';

export function TarotOnePage() {
  const [drawn, setDrawn] = useState<DrawnCard | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);

  const handleDraw = () => {
    const r = drawOne();
    setDrawn(r.drawn);
    setResult(r.result);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="🃏"
        title="オリジナルタロット 1枚引き"
        subtitle="大アルカナ22枚から1枚を引き、今のあなたへのヒントを受け取ります。"
      >
        <div className="bg-white/80 rounded-2xl border border-amber-900/10 p-6 shadow-sm flex flex-col items-center gap-4">
          {drawn ? (
            <TarotCard card={drawn.card} reversed={drawn.reversed} size="lg" />
          ) : (
            <div className="w-48 h-72 rounded-xl border-2 border-amber-700/30 bg-gradient-to-b from-indigo-900 to-violet-950 text-amber-200/40 shadow-md flex items-center justify-center">
              <span className="font-serif">？</span>
            </div>
          )}
          <button
            type="button"
            onClick={handleDraw}
            className="px-8 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm"
          >
            {drawn ? 'もう一度引く' : 'カードを引く'}
          </button>
        </div>
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
