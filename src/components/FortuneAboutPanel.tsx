import type { ReactNode } from 'react';
import { METHOD_INFO, type MethodInfo } from '../fortunes/methodInfo';
import type { FortuneId } from '../fortunes/types';
import { OmikujiCatalog } from './elementCatalogs/OmikujiCatalog';
import { TarotCatalog } from './elementCatalogs/TarotCatalog';
import { SeimeiCatalog } from './elementCatalogs/SeimeiCatalog';
import { AstrologyCatalog } from './elementCatalogs/AstrologyCatalog';
import { KyuseiCatalog } from './elementCatalogs/KyuseiCatalog';
import { ShichuCatalog } from './elementCatalogs/ShichuCatalog';
import { SanmeiCatalog } from './elementCatalogs/SanmeiCatalog';

const FIELD_LABELS: { key: keyof MethodInfo; label: string }[] = [
  { key: 'origin', label: 'どんな占い？' },
  { key: 'inputUsed', label: '使う情報' },
  { key: 'howItWorks', label: '導き方' },
  { key: 'simplified', label: '本サイトで簡略化していること' },
  { key: 'ourTake', label: '本サイトでの位置づけ' },
  { key: 'whenItChanges', label: '同じ人がもう一度占うと？' },
];

const CATALOG_TITLE: Record<FortuneId, string> = {
  omikuji: 'ぜんぶのランク',
  'tarot-three': 'ぜんぶのカード（大アルカナ22枚）',
  seimei: 'ぜんぶの格（五格）',
  astrology: 'ぜんぶの星座（12星座）',
  kyusei: 'ぜんぶの本命星（9星）',
  shichu: 'ぜんぶの十干タイプ（10種）',
  sanmei: 'ぜんぶのタイプ星（独自10星）',
};

function renderCatalog(id: FortuneId): ReactNode {
  switch (id) {
    case 'omikuji': return <OmikujiCatalog />;
    case 'tarot-three': return <TarotCatalog />;
    case 'seimei': return <SeimeiCatalog />;
    case 'astrology': return <AstrologyCatalog />;
    case 'kyusei': return <KyuseiCatalog />;
    case 'shichu': return <ShichuCatalog />;
    case 'sanmei': return <SanmeiCatalog />;
  }
}

export function FortuneAboutPanel({ id, panelId }: { id: FortuneId; panelId?: string }) {
  const info = METHOD_INFO[id];
  return (
    <article
      id={panelId}
      role="region"
      aria-label="この占いについて"
      className="reveal-block bg-white/80 backdrop-blur rounded-2xl border border-amber-900/10 shadow-sm p-6 md:p-8 my-6"
    >
      <section>
        <h3 className="font-serif text-lg text-plum mb-3">占いの背景</h3>
        <dl className="space-y-3">
          {FIELD_LABELS.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-[11px] tracking-widest text-plum/70 uppercase mb-1">{label}</dt>
              <dd className="text-sm text-ink/85 leading-relaxed">{info[key]}</dd>
            </div>
          ))}
        </dl>
      </section>
      <hr className="my-6 border-amber-900/10" />
      <section>
        <h3 className="font-serif text-lg text-plum mb-3">{CATALOG_TITLE[id]}</h3>
        {renderCatalog(id)}
      </section>
    </article>
  );
}
