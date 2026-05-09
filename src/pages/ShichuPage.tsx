import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { DateInput } from '../components/DateInput';
import { FortuneResultView } from '../components/FortuneResultView';
import { readShichu } from '../fortunes/shichu/engine';
import type { FortuneResult } from '../fortunes/types';

export function ShichuPage() {
  const [result, setResult] = useState<FortuneResult | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="🌳"
        title="十干タイプ診断"
        subtitle="生年月日から日干を算出し、10種類の素材タイプであなたの傾向を眺めます。"
      >
        <DateInput
          onSubmit={(v) => setResult(readShichu(v))}
          buttonLabel="日干を見る"
          hint="出生時刻は不要（日付のみで判定します）。タイムゾーンはJST固定。"
        />
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
