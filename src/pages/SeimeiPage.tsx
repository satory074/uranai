import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { NameInput } from '../components/NameInput';
import { FortuneResultView } from '../components/FortuneResultView';
import { readSeimei } from '../fortunes/seimei/engine';
import type { FortuneResult } from '../fortunes/types';

export function SeimeiPage() {
  const [result, setResult] = useState<FortuneResult | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="🖋️"
        title="名前運勢診断"
        subtitle="姓と名の画数から五格を計算し、印象や傾向を眺めます（新字体・簡易判定）。"
      >
        <NameInput
          onSubmit={(v) => setResult(readSeimei(v))}
          buttonLabel="名前を診断する"
          hint="新字体ベースで計算します。画数辞書に未収録の漢字はエラーになります。"
        />
      </PageHero>
      {result && <FortuneResultView result={result} />}
    </div>
  );
}
