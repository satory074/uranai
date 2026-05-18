import { useState, type ReactNode } from 'react';
import { FORTUNES, type FortuneId, type FortuneInfo, type FortuneResult } from '../fortunes/types';
import { FortuneResultView } from '../components/FortuneResultView';
import { AstrologyRanking } from '../components/AstrologyRanking';
import { FortuneCard } from '../components/FortuneCard';
import { HeroDecoration } from '../components/HeroDecoration';
import { SummaryCard } from '../components/SummaryCard';
import { deriveHeadline } from '../components/resultDerive';
import { TarotCard } from '../components/TarotCard';
import { readSunSign, dailyRanking } from '../fortunes/astrology/engine';
import { SIGNS, findSign } from '../fortunes/astrology/signs';
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
  const [aboutExpanded, setAboutExpanded] = useState<Partial<Record<FortuneId, boolean>>>({});
  const [tarotFlipped, setTarotFlipped] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [astroSelectedAlias, setAstroSelectedAlias] = useState<string | null>(null);

  const toggle = (id: FortuneId) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleAbout = (id: FortuneId) =>
    setAboutExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  if (!submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <section className="relative mb-10 md:mb-14">
          <HeroDecoration className="hidden md:block absolute -top-6 -right-2 w-56 h-56 pointer-events-none" />
          <HeroDecoration className="md:hidden absolute -top-2 -right-2 w-32 h-32 opacity-80 pointer-events-none" />
          <div className="relative">
            <p className="type-eyebrow mb-4">URANAI HYAKKA</p>
            <h1 className="type-display text-ink mb-5">
              7つの占いを、<br />ひと所で。
            </h1>
            <p className="text-base md:text-lg text-ink/75 max-w-lg leading-relaxed">
              生年月日と姓名を入力すると、おみくじから西洋占星術・命式タイプ診断・タロットまで、
              すべての占い結果がこのページに並びます。
            </p>
          </div>
        </section>

        <form
          className="surface-card-strong p-6 md:p-10"
          onSubmit={(e) => {
            e.preventDefault();
            setTarotFlipped([false, false, false]);
            setAboutExpanded({});
            setAstroSelectedAlias(null);
            setSubmitted(true);
          }}
        >
          <StepLabel index="01" title="生年月日" required />
          <div className="flex flex-wrap items-end gap-3 md:gap-4 mb-8">
            <Field label="年">
              <input
                type="number"
                min="1900"
                max="2100"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-28 md:w-32 h-12 px-4 rounded-lg border border-border-default bg-surface-base text-lg font-serif tabular-nums focus:border-plum focus:outline-none"
              />
            </Field>
            <Field label="月">
              <input
                type="number"
                min="1"
                max="12"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-20 md:w-24 h-12 px-4 rounded-lg border border-border-default bg-surface-base text-lg font-serif tabular-nums focus:border-plum focus:outline-none"
              />
            </Field>
            <Field label="日">
              <input
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-20 md:w-24 h-12 px-4 rounded-lg border border-border-default bg-surface-base text-lg font-serif tabular-nums focus:border-plum focus:outline-none"
              />
            </Field>
          </div>

          <StepLabel index="02" title="姓名" optional />
          <div className="flex flex-wrap items-end gap-3 md:gap-4 mb-2">
            <Field label="姓">
              <input
                type="text"
                value={sei}
                onChange={(e) => setSei(e.target.value)}
                placeholder="山田"
                className="w-32 md:w-36 h-12 px-4 rounded-lg border border-border-default bg-surface-base text-lg font-serif focus:border-plum focus:outline-none"
              />
            </Field>
            <Field label="名">
              <input
                type="text"
                value={mei}
                onChange={(e) => setMei(e.target.value)}
                placeholder="花子"
                className="w-32 md:w-36 h-12 px-4 rounded-lg border border-border-default bg-surface-base text-lg font-serif focus:border-plum focus:outline-none"
              />
            </Field>
          </div>
          <p className="text-sm text-ink/70 mb-8">
            姓と名を両方入力すると、姓名判断も結果に追加されます。
          </p>

          <button
            type="submit"
            className="reveal-button btn-plum w-full h-14 rounded-2xl font-serif text-lg shadow-card hover:shadow-pop active:scale-[0.98] inline-flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>占う</span>
            <span aria-hidden className="text-gold text-base">✦</span>
          </button>

          <div className="mt-8 pt-6 border-t border-border-hairline">
            <p className="type-eyebrow mb-3">結果に並ぶ占い</p>
            <ul className="flex flex-wrap gap-x-3 gap-y-2 text-sm text-ink/75">
              {FORTUNES.map((f, i) => (
                <li key={f.id} className="inline-flex items-center gap-1.5">
                  <span aria-hidden>{f.emoji}</span>
                  <span>{f.displayName}</span>
                  {i < FORTUNES.length - 1 && (
                    <span className="text-ink/30 ml-1" aria-hidden>
                      ・
                    </span>
                  )}
                </li>
              ))}
            </ul>
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

  const omikujiResult = drawOmikuji(hasName ? { name: fullName } : {});
  const tarotThree = drawThree({ seedHint: `${seedHint}|three` });
  const seimeiResult = hasName ? readSeimei({ sei: trimmedSei, mei: trimmedMei }) : null;
  const natalSign = findSign(month, day);
  const selectedSign = astroSelectedAlias
    ? SIGNS.find((s) => s.alias === astroSelectedAlias) ?? null
    : null;
  const astrologyResult = readSunSign(
    birthDate,
    selectedSign ? { signOverride: selectedSign } : undefined,
  );
  const astrologyRanking = dailyRanking(birthDate);
  const kyuseiResult = readKyusei(birthDate);
  const shichuResult = readShichu(birthDate);
  const sanmeiResult = readSanmei(birthDate);

  const allTarotFlipped = tarotFlipped.every(Boolean);
  const gatedTarotResult: FortuneResult = {
    ...tarotThree.result,
    subtitle: allTarotFlipped ? tarotThree.result.subtitle : undefined,
    sections: tarotThree.result.sections.map((s, i) =>
      tarotFlipped[i]
        ? s
        : { title: TAROT_POSITIONS[i], body: 'カードをタップして結果を見る' },
    ),
  };
  const flipTarotAt = (i: number) =>
    setTarotFlipped((prev) => {
      const next = [...prev] as [boolean, boolean, boolean];
      next[i] = true;
      return next;
    });

  const headlineFor = (id: FortuneId, result: FortuneResult) => deriveHeadline(result, id);

  const summaryResults: { id: FortuneId; result: FortuneResult }[] = [
    { id: 'omikuji', result: omikujiResult },
    { id: 'tarot-three', result: tarotThree.result },
    { id: 'astrology', result: astrologyResult },
    ...(seimeiResult ? [{ id: 'seimei' as FortuneId, result: seimeiResult }] : []),
    { id: 'kyusei', result: kyuseiResult },
    { id: 'shichu', result: shichuResult },
    { id: 'sanmei', result: sanmeiResult },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-3 mb-6 pb-4 border-b border-border-hairline">
        <div>
          <p className="type-eyebrow mb-2">YOUR FORTUNES</p>
          <h1 className="type-headline text-ink">
            {year}年{month}月{day}日
            {hasName && <span className="text-base ml-2 text-ink/70 font-sans">／ {fullName}</span>}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm text-plum hover:underline cursor-pointer"
        >
          ← 入力をやり直す
        </button>
      </header>

      <SummaryCard items={summaryResults} headlineFor={headlineFor} />

      {!hasName && (
        <p className="text-sm text-ink/70 bg-surface-sunken rounded-lg px-4 py-3 mb-6 border border-border-hairline">
          姓名を入力すると、姓名判断も表示されます。
        </p>
      )}

      <FortuneGroupHeader
        eyebrow="TODAY'S FLOW"
        title="今日の運勢"
        description="日付が変わると、新しい結果に引き直されます。"
        icon="🌙"
      />

      <FortuneCard
        id="fortune-omikuji"
        info={FORTUNE_MAP['omikuji']}
        expanded={!!expanded['omikuji']}
        onToggle={() => toggle('omikuji')}
        aboutExpanded={!!aboutExpanded['omikuji']}
        onAboutToggle={() => toggleAbout('omikuji')}
      >
        <FortuneResultView
          id="result-omikuji"
          result={omikujiResult}
          headline={headlineFor('omikuji', omikujiResult)}
        />
      </FortuneCard>

      <FortuneCard
        id="fortune-tarot-three"
        info={FORTUNE_MAP['tarot-three']}
        expanded={!!expanded['tarot-three']}
        onToggle={() => toggle('tarot-three')}
        aboutExpanded={!!aboutExpanded['tarot-three']}
        onAboutToggle={() => toggleAbout('tarot-three')}
      >
        <FortuneResultView
          id="result-tarot-three"
          result={gatedTarotResult}
          headline={tarotFlipped[0] ? headlineFor('tarot-three', tarotThree.result) : undefined}
          sectionPrefix={(i) => {
            const d = tarotThree.drawn[i];
            return d ? (
              <TarotCard
                card={d.card}
                reversed={d.reversed}
                size="sm"
                revealIndex={i}
                position={TAROT_POSITIONS[i]}
                flipped={tarotFlipped[i]}
                onFlip={() => flipTarotAt(i)}
              />
            ) : null;
          }}
        />
      </FortuneCard>

      <FortuneCard
        id="fortune-astrology"
        info={FORTUNE_MAP['astrology']}
        expanded={!!expanded['astrology']}
        onToggle={() => toggle('astrology')}
        aboutExpanded={!!aboutExpanded['astrology']}
        onAboutToggle={() => toggleAbout('astrology')}
      >
        <AstrologyRanking
          ranking={astrologyRanking}
          natalAlias={natalSign.alias}
          selectedAlias={selectedSign?.alias ?? natalSign.alias}
          onSelect={(alias) =>
            setAstroSelectedAlias(alias === natalSign.alias ? null : alias)
          }
        />
        <FortuneResultView
          id="result-astrology"
          result={astrologyResult}
          headline={headlineFor('astrology', astrologyResult)}
        />
      </FortuneCard>

      <FortuneGroupHeader
        eyebrow="YOUR PROFILE"
        title="あなたのタイプ"
        description="生年月日から決まる、変わらないあなたの素材。"
        icon="🌳"
      />

      {seimeiResult && (
        <FortuneCard
          id="fortune-seimei"
          info={FORTUNE_MAP['seimei']}
          expanded={!!expanded['seimei']}
          onToggle={() => toggle('seimei')}
          aboutExpanded={!!aboutExpanded['seimei']}
          onAboutToggle={() => toggleAbout('seimei')}
        >
          <FortuneResultView
            id="result-seimei"
            result={seimeiResult}
            headline={headlineFor('seimei', seimeiResult)}
          />
        </FortuneCard>
      )}

      <FortuneCard
        id="fortune-kyusei"
        info={FORTUNE_MAP['kyusei']}
        expanded={!!expanded['kyusei']}
        onToggle={() => toggle('kyusei')}
        aboutExpanded={!!aboutExpanded['kyusei']}
        onAboutToggle={() => toggleAbout('kyusei')}
      >
        <FortuneResultView
          id="result-kyusei"
          result={kyuseiResult}
          headline={headlineFor('kyusei', kyuseiResult)}
        />
      </FortuneCard>

      <FortuneCard
        id="fortune-shichu"
        info={FORTUNE_MAP['shichu']}
        expanded={!!expanded['shichu']}
        onToggle={() => toggle('shichu')}
        aboutExpanded={!!aboutExpanded['shichu']}
        onAboutToggle={() => toggleAbout('shichu')}
      >
        <FortuneResultView
          id="result-shichu"
          result={shichuResult}
          headline={headlineFor('shichu', shichuResult)}
        />
      </FortuneCard>

      <FortuneCard
        id="fortune-sanmei"
        info={FORTUNE_MAP['sanmei']}
        expanded={!!expanded['sanmei']}
        onToggle={() => toggle('sanmei')}
        aboutExpanded={!!aboutExpanded['sanmei']}
        onAboutToggle={() => toggleAbout('sanmei')}
      >
        <FortuneResultView
          id="result-sanmei"
          result={sanmeiResult}
          headline={headlineFor('sanmei', sanmeiResult)}
        />
      </FortuneCard>

      <div className="flex justify-center mt-12">
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="btn-plum px-10 h-12 rounded-full font-serif text-base shadow-card hover:shadow-pop cursor-pointer"
        >
          入力をやり直す
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-ink/65 tracking-wide">{label}</span>
      {children}
    </label>
  );
}

function StepLabel({
  index,
  title,
  required,
  optional,
}: {
  index: string;
  title: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="type-eyebrow text-plum/80">STEP {index}</span>
      <span className="font-serif text-lg text-ink">{title}</span>
      {required && <span className="text-plum text-sm" aria-label="必須">*</span>}
      {optional && <span className="text-xs text-ink/55">（任意）</span>}
    </div>
  );
}

function FortuneGroupHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <header className="mb-5 mt-4 md:mt-6 pl-1">
      <p className="type-eyebrow mb-2">{eyebrow}</p>
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <h2 className="font-serif text-xl md:text-2xl text-ink leading-tight">{title}</h2>
      </div>
      <p className="text-sm text-ink/65 leading-relaxed pl-8">{description}</p>
    </header>
  );
}
