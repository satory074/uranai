import { useState } from 'react';
import { PageHero } from '../components/PageHero';
import { FortuneResultView } from '../components/FortuneResultView';
import { drawOmikuji } from '../fortunes/omikuji/engine';
import type { FortuneResult } from '../fortunes/types';

export function OmikujiPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<FortuneResult | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 pb-10">
      <PageHero
        emoji="🎋"
        title="今日のおみくじ"
        subtitle="同じ日・同じ名前なら同じ結果が出ます。明日になったら、また引いてみてください。"
      >
        <form
          className="bg-white/80 rounded-2xl border border-amber-900/10 p-5 md:p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setResult(drawOmikuji({ name: name.trim() || undefined }));
          }}
        >
          <label className="flex flex-col gap-1 mb-3">
            <span className="text-xs text-ink/60">名前（任意・空欄でも引けます）</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 花子"
              className="w-full px-3 py-2 rounded border border-amber-900/20 bg-white"
            />
          </label>
          <button
            type="submit"
            className="w-full md:w-auto md:ml-auto md:block px-8 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm"
          >
            おみくじを引く
          </button>
        </form>
      </PageHero>

      {result && <FortuneResultView result={result} />}
    </div>
  );
}
