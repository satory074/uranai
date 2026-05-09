import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { DateInput } from '../components/DateInput';
import { FortuneResultView } from '../components/FortuneResultView';
import { readKyusei } from '../fortunes/kyusei/engine';
import type { FortuneResult } from '../fortunes/types';

export function KyuseiPage() {
  const [result, setResult] = useState<FortuneResult | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="🌙"
        title="九星タイプ診断"
        subtitle="九星気学の本命星から、9つのタイプであなたの傾向を眺めます（立春切り替え対応）。"
      >
        <DateInput
          onSubmit={(v) => setResult(readKyusei(v))}
          buttonLabel="本命星を見る"
          hint="1月1日〜2月3日生まれの方は前年扱いで計算されます。"
        />
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
