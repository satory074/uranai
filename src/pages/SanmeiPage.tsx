import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { DateInput } from '../components/DateInput';
import { FortuneResultView } from '../components/FortuneResultView';
import { readSanmei } from '../fortunes/sanmei/engine';
import type { FortuneResult } from '../fortunes/types';

export function SanmeiPage() {
  const [result, setResult] = useState<FortuneResult | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="⭐"
        title="東洋命式タイプ診断"
        subtitle="生年月日から年干を導き、独自10星のタイプであなたの傾向を眺めます。"
      >
        <DateInput
          onSubmit={(v) => setResult(readSanmei(v))}
          buttonLabel="星を見る"
          hint="星の名称はオリジナルで、特定流派の命名は使用していません。"
        />
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
