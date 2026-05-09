import { useState, type ReactNode } from 'react';
import { FORTUNES, type FortuneInfo } from '../fortunes/types';
import { FortuneResultView } from '../components/FortuneResultView';
import { TarotCard } from '../components/TarotCard';
import { readSunSign } from '../fortunes/astrology/engine';
import { readKyusei } from '../fortunes/kyusei/engine';
import { readSanmei } from '../fortunes/sanmei/engine';
import { readShichu } from '../fortunes/shichu/engine';
import { readSeimei } from '../fortunes/seimei/engine';
import { drawOmikuji } from '../fortunes/omikuji/engine';
import { drawOne, drawThree } from '../fortunes/tarot/engine';

const FORTUNE_MAP = Object.fromEntries(
  FORTUNES.map((f) => [f.id, f]),
) as Record<FortuneInfo['id'], FortuneInfo>;

export function Home() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear() - 30);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [sei, setSei] = useState('');
  const [mei, setMei] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <section className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] text-plum mb-3">URANAI HYAKKA</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight">
            8つの占いを、<br className="md:hidden" />ひと所で。
          </h1>
          <p className="text-sm md:text-base text-ink/70 max-w-xl mx-auto">
            生年月日と姓名を入力すると、おみくじから西洋占星術・命式タイプ診断・タロットまで、
            すべての占い結果がこのページに並びます。
          </p>
        </section>

        <form
          className="bg-white/80 rounded-2xl border border-amber-900/10 p-5 md:p-6 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="text-sm text-ink/70 mb-3">
            生年月日 <span className="text-plum">*</span>
          </div>
          <div className="flex flex-wrap items-end gap-3 mb-6">
            <Field label="年">
              <input
                type="number"
                min="1900"
                max="2100"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded border border-amber-900/20 bg-white"
              />
            </Field>
            <Field label="月">
              <input
                type="number"
                min="1"
                max="12"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded border border-amber-900/20 bg-white"
              />
            </Field>
            <Field label="日">
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-20 px-3 py-2 rounded border border-amber-900/20 bg-white"
              />
            </Field>
          </div>

          <div className="text-sm text-ink/70 mb-3">
            姓名 <span className="text-ink/50 text-xs">（任意）</span>
          </div>
          <div className="flex flex-wrap items-end gap-3 mb-2">
            <Field label="姓">
              <input
                type="text"
                value={sei}
                onChange={(e) => setSei(e.target.value)}
                placeholder="山田"
                className="w-32 px-3 py-2 rounded border border-amber-900/20 bg-white"
              />
            </Field>
            <Field label="名">
              <input
                type="text"
                value={mei}
                onChange={(e) => setMei(e.target.value)}
                placeholder="花子"
                className="w-32 px-3 py-2 rounded border border-amber-900/20 bg-white"
              />
            </Field>
          </div>
          <p className="text-xs text-ink/50 mb-6">
            姓と名を両方入力すると、姓名判断とおみくじも結果に追加されます。
          </p>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm"
            >
              占う
            </button>
          </div>
        </form>
      </div>
    );
  }

  const trimmedSei = sei.trim();
  const trimmedMei = mei.trim();
  const hasName = trimmedSei !== '' && trimmedMei !== '';
  const fullName = `${trimmedSei}${trimmedMei}`;
  const seedHint = `${year}-${month}-${day}|${fullName}`;
  const birthDate = { year, month, day };

  const tarotOne = drawOne({ seedHint: `${seedHint}|one` });
  const tarotThree = drawThree({ seedHint: `${seedHint}|three` });
  const labels = ['過去', '現在', '未来'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-3 mb-8 pb-4 border-b border-amber-900/10">
        <div>
          <p className="text-xs tracking-[0.4em] text-plum mb-1">YOUR FORTUNES</p>
          <h1 className="font-serif text-2xl md:text-3xl text-ink">
            {year}年{month}月{day}日
            {hasName && <span className="text-base ml-2 text-ink/70">／ {fullName}</span>}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm text-plum hover:underline"
        >
          ← 入力をやり直す
        </button>
      </header>

      {!hasName && (
        <p className="text-xs text-ink/60 bg-mist/60 rounded-lg px-4 py-3 mb-6">
          姓名を入力すると、姓名判断とおみくじも表示されます。
        </p>
      )}

      {hasName && (
        <FortuneBlock info={FORTUNE_MAP['omikuji']}>
          <FortuneResultView result={drawOmikuji({ name: fullName })} />
        </FortuneBlock>
      )}

      <FortuneBlock info={FORTUNE_MAP['tarot-one']}>
        <div className="bg-white/80 rounded-2xl border border-amber-900/10 p-6 shadow-sm flex justify-center mb-2">
          <TarotCard card={tarotOne.drawn.card} reversed={tarotOne.drawn.reversed} size="lg" />
        </div>
        <FortuneResultView result={tarotOne.result} />
      </FortuneBlock>

      <FortuneBlock info={FORTUNE_MAP['tarot-three']}>
        <div className="bg-white/80 rounded-2xl border border-amber-900/10 p-6 shadow-sm mb-2">
          <div className="flex flex-wrap justify-center gap-4">
            {tarotThree.drawn.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-xs text-ink/60 tracking-widest">{labels[i]}</div>
                <TarotCard card={d.card} reversed={d.reversed} size="md" />
              </div>
            ))}
          </div>
        </div>
        <FortuneResultView result={tarotThree.result} />
      </FortuneBlock>

      {hasName && (
        <FortuneBlock info={FORTUNE_MAP['seimei']}>
          <FortuneResultView result={readSeimei({ sei: trimmedSei, mei: trimmedMei })} />
        </FortuneBlock>
      )}

      <FortuneBlock info={FORTUNE_MAP['astrology']}>
        <FortuneResultView result={readSunSign(birthDate)} />
      </FortuneBlock>

      <FortuneBlock info={FORTUNE_MAP['kyusei']}>
        <FortuneResultView result={readKyusei(birthDate)} />
      </FortuneBlock>

      <FortuneBlock info={FORTUNE_MAP['shichu']}>
        <FortuneResultView result={readShichu(birthDate)} />
      </FortuneBlock>

      <FortuneBlock info={FORTUNE_MAP['sanmei']}>
        <FortuneResultView result={readSanmei(birthDate)} />
      </FortuneBlock>

      <div className="flex justify-center mt-10">
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-8 py-2 rounded-full bg-plum text-paper hover:bg-rose-800 transition shadow-sm"
        >
          入力をやり直す
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-ink/60">{label}</span>
      {children}
    </label>
  );
}

function FortuneBlock({ info, children }: { info: FortuneInfo; children: ReactNode }) {
  return (
    <section className="mb-10">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${info.accent} mb-4`} />
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl" aria-hidden>{info.emoji}</span>
        <div>
          <h2 className="font-serif text-lg text-ink leading-tight">{info.displayName}</h2>
          <p className="text-[11px] text-ink/50 mt-0.5">{info.traditionalName}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
