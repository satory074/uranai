import { useState, type ReactNode } from 'react';
import { FORTUNES, type FortuneId, type FortuneInfo, type FortuneResult } from '../fortunes/types';
import { FortuneResultView } from '../components/FortuneResultView';
import { FortuneDigest, type DigestItem } from '../components/FortuneDigest';
import { deriveHeadline, deriveOneLiner } from '../components/resultDerive';
import { TarotCard } from '../components/TarotCard';
import { readSunSign } from '../fortunes/astrology/engine';
import { readKyusei } from '../fortunes/kyusei/engine';
import { readSanmei } from '../fortunes/sanmei/engine';
import { readShichu } from '../fortunes/shichu/engine';
import { readSeimei } from '../fortunes/seimei/engine';
import { drawOmikuji } from '../fortunes/omikuji/engine';
import { drawThree } from '../fortunes/tarot/engine';

const FORTUNE_MAP = Object.fromEntries(
  FORTUNES.map((f) => [f.id, f]),
) as Record<FortuneInfo['id'], FortuneInfo>;

const TAROT_POSITIONS = ['過去', '現在', '未来'] as const;

export function Home() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear() - 30);
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [sei, setSei] = useState('');
  const [mei, setMei] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expanded, setExpanded] = useState<Partial<Record<FortuneId, boolean>>>({});

  const toggle = (id: FortuneId) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const reveal = (id: FortuneId) => {
    setExpanded((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    requestAnimationFrame(() => {
      document.getElementById(`fortune-${id}`)?.scrollIntoView({ block: 'start' });
    });
  };

  if (!submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
        <section className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] text-plum mb-3">URANAI HYAKKA</p>
          <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight">
            7つの占いを、<br className="md:hidden" />ひと所で。
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

  const omikujiResult = hasName ? drawOmikuji({ name: fullName }) : null;
  const tarotThree = drawThree({ seedHint: `${seedHint}|three` });
  const seimeiResult = hasName ? readSeimei({ sei: trimmedSei, mei: trimmedMei }) : null;
  const astrologyResult = readSunSign(birthDate);
  const kyuseiResult = readKyusei(birthDate);
  const shichuResult = readShichu(birthDate);
  const sanmeiResult = readSanmei(birthDate);

  type Entry = { id: FortuneId; result: FortuneResult };
  const entries: Entry[] = [
    omikujiResult ? { id: 'omikuji', result: omikujiResult } : null,
    { id: 'tarot-three', result: tarotThree.result },
    seimeiResult ? { id: 'seimei', result: seimeiResult } : null,
    { id: 'astrology', result: astrologyResult },
    { id: 'kyusei', result: kyuseiResult },
    { id: 'shichu', result: shichuResult },
    { id: 'sanmei', result: sanmeiResult },
  ].filter((e): e is Entry => e !== null);

  const digestItems: DigestItem[] = entries.map(({ id, result }) => {
    const info = FORTUNE_MAP[id];
    return {
      id,
      emoji: info.emoji,
      displayName: info.displayName,
      oneLiner: deriveOneLiner(result, id),
      accent: info.accent,
    };
  });

  const headlineFor = (id: FortuneId, result: FortuneResult) => deriveHeadline(result, id);

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

      <FortuneDigest items={digestItems} onJump={reveal} />

      {omikujiResult && (
        <FortuneBlock
          id="fortune-omikuji"
          info={FORTUNE_MAP['omikuji']}
          expanded={!!expanded['omikuji']}
          onToggle={() => toggle('omikuji')}
        >
          <FortuneResultView
            id="result-omikuji"
            result={omikujiResult}
            headline={headlineFor('omikuji', omikujiResult)}
          />
        </FortuneBlock>
      )}

      <FortuneBlock
        id="fortune-tarot-three"
        info={FORTUNE_MAP['tarot-three']}
        expanded={!!expanded['tarot-three']}
        onToggle={() => toggle('tarot-three')}
      >
        <FortuneResultView
          id="result-tarot-three"
          result={tarotThree.result}
          headline={headlineFor('tarot-three', tarotThree.result)}
          sectionPrefix={(i) => {
            const d = tarotThree.drawn[i];
            return d ? (
              <TarotCard
                card={d.card}
                reversed={d.reversed}
                size="sm"
                revealIndex={i}
                position={TAROT_POSITIONS[i]}
              />
            ) : null;
          }}
        />
      </FortuneBlock>

      {seimeiResult && (
        <FortuneBlock
          id="fortune-seimei"
          info={FORTUNE_MAP['seimei']}
          expanded={!!expanded['seimei']}
          onToggle={() => toggle('seimei')}
        >
          <FortuneResultView
            id="result-seimei"
            result={seimeiResult}
            headline={headlineFor('seimei', seimeiResult)}
          />
        </FortuneBlock>
      )}

      <FortuneBlock
        id="fortune-astrology"
        info={FORTUNE_MAP['astrology']}
        expanded={!!expanded['astrology']}
        onToggle={() => toggle('astrology')}
      >
        <FortuneResultView
          id="result-astrology"
          result={astrologyResult}
          headline={headlineFor('astrology', astrologyResult)}
        />
      </FortuneBlock>

      <FortuneBlock
        id="fortune-kyusei"
        info={FORTUNE_MAP['kyusei']}
        expanded={!!expanded['kyusei']}
        onToggle={() => toggle('kyusei')}
      >
        <FortuneResultView
          id="result-kyusei"
          result={kyuseiResult}
          headline={headlineFor('kyusei', kyuseiResult)}
        />
      </FortuneBlock>

      <FortuneBlock
        id="fortune-shichu"
        info={FORTUNE_MAP['shichu']}
        expanded={!!expanded['shichu']}
        onToggle={() => toggle('shichu')}
      >
        <FortuneResultView
          id="result-shichu"
          result={shichuResult}
          headline={headlineFor('shichu', shichuResult)}
        />
      </FortuneBlock>

      <FortuneBlock
        id="fortune-sanmei"
        info={FORTUNE_MAP['sanmei']}
        expanded={!!expanded['sanmei']}
        onToggle={() => toggle('sanmei')}
      >
        <FortuneResultView
          id="result-sanmei"
          result={sanmeiResult}
          headline={headlineFor('sanmei', sanmeiResult)}
        />
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

function FortuneBlock({
  id,
  info,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  info: FortuneInfo;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-6 md:scroll-mt-56">
      <div className={`h-1.5 rounded-full bg-gradient-to-r ${info.accent} mb-4`} />
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl" aria-hidden>{info.emoji}</span>
          <div className="min-w-0">
            <h2 className="font-serif text-lg text-ink leading-tight truncate">{info.displayName}</h2>
            <p className="text-[11px] text-ink/50 mt-0.5">{info.traditionalName}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`${id}-body`}
          className="reveal-button shrink-0 text-sm px-4 py-1.5 rounded-full border border-plum/40 text-plum hover:bg-plum hover:text-paper cursor-pointer"
        >
          {expanded ? '閉じる' : '結果を見る'}
        </button>
      </div>
      <p className="text-xs md:text-sm text-ink/70 leading-relaxed mb-3 ml-11">
        {info.description}
      </p>
      {expanded && (
        <div id={`${id}-body`} className="reveal-block" aria-live="polite">
          {children}
        </div>
      )}
    </section>
  );
}
