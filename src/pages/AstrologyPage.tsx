import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { DateInput } from '../components/DateInput';
import { FortuneResultView } from '../components/FortuneResultView';
import { readSunSign } from '../fortunes/astrology/engine';
import type { FortuneResult } from '../fortunes/types';

export function AstrologyPage() {
  const [result, setResult] = useState<FortuneResult | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="✨"
        title="星読み診断"
        subtitle="生年月日からあなたの太陽星座を読み解きます（簡易判定／ASC・月星座は含みません）。"
      >
        <DateInput onSubmit={(v) => setResult(readSunSign(v))} buttonLabel="星を読む" />
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
