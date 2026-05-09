import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { FortuneResultView } from '../components/FortuneResultView';
import { TarotCard } from '../components/TarotCard';
import { drawThree, type DrawnCard } from '../fortunes/tarot/engine';
import type { FortuneResult } from '../fortunes/types';

export function TarotThreePage() {
  const [drawn, setDrawn] = useState<DrawnCard[] | null>(null);
  const [result, setResult] = useState<FortuneResult | null>(null);

  const handleDraw = () => {
    const r = drawThree();
    setDrawn(r.drawn);
    setResult(r.result);
  };

  const labels = ['過去', '現在', '未来'];

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="🔮"
        title="悩み別タロット 3枚引き"
        subtitle="過去・現在・未来の3枚スプレッドで、流れを読み解きます。"
      >
        <div className="bg-white/80 rounded-2xl border border-amber-900/10 p-6 shadow-sm flex flex-col items-center gap-4">
          {drawn ? (
            <div className="flex flex-wrap justify-center gap-4">
              {drawn.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="text-xs text-ink/60 tracking-widest">{labels[i]}</div>
                  <TarotCard card={d.card} reversed={d.reversed} size="md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-32 h-52 rounded-xl border-2 border-amber-700/30 bg-gradient-to-b from-indigo-900 to-violet-950 text-amber-200/40 flex items-center justify-center"
                >
                  <span className="font-serif">？</span>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={handleDraw}
            className="px-8 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm"
          >
            {drawn ? 'もう一度引く' : '3枚を引く'}
          </button>
        </div>
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
