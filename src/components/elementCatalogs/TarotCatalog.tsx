import { MAJOR_ARCANA, type Card } from '../../fortunes/tarot/cards';
import { MOTIFS } from '../tarotMotifs';

export function TarotCatalog() {
  return (
    <div>
      <p className="text-xs text-ink/55 mb-3 leading-relaxed">
        本サイトで使う大アルカナ 22 枚すべて。各カードには「正位置」「逆位置」の二通りの読み方があります。図像は当サイトのために描き起こした抽象シンボルです。
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MAJOR_ARCANA.map((card) => (
          <TarotCatalogCard key={card.num} card={card} />
        ))}
      </div>
    </div>
  );
}

function TarotCatalogCard({ card }: { card: Card }) {
  return (
    <article className="rounded-lg bg-mist/40 border border-amber-900/10 p-3 md:p-4 grid grid-cols-[auto_1fr] gap-3 md:gap-4">
      <CardFace card={card} />
      <div className="min-w-0">
        <header className="mb-2">
          <div className="text-[10px] tracking-widest text-ink/45">
            {String(card.num).padStart(2, '0')}
          </div>
          <h4 className="font-serif text-base md:text-lg text-ink leading-tight">{card.name}</h4>
          <div className="text-[10px] tracking-widest text-ink/55 uppercase">{card.alias}</div>
        </header>
        <Orientation
          label="正位置"
          keywords={card.upright.keywords}
          body={card.upright.body}
        />
        <Orientation
          label="逆位置"
          keywords={card.reversed.keywords}
          body={card.reversed.body}
          dim
        />
      </div>
    </article>
  );
}

function CardFace({ card }: { card: Card }) {
  return (
    <div
      className="w-20 h-32 md:w-24 md:h-40 rounded-lg border-2 border-amber-700/30 bg-gradient-to-b from-indigo-900 to-violet-950 text-amber-200 shadow-md flex flex-col items-center justify-between p-2 md:p-3 overflow-hidden relative shrink-0"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
      <div className="text-[8px] md:text-[10px] tracking-widest font-serif relative z-10">
        {String(card.num).padStart(2, '0')}
      </div>
      <div className="text-3xl md:text-4xl font-light leading-none relative z-10">
        {MOTIFS[card.num] ?? '✦'}
      </div>
      <div className="text-center relative z-10">
        <div className="font-serif text-[11px] md:text-xs leading-tight">{card.name}</div>
      </div>
    </div>
  );
}

function Orientation({
  label,
  keywords,
  body,
  dim = false,
}: {
  label: string;
  keywords: string[];
  body: string;
  dim?: boolean;
}) {
  return (
    <div className={`mb-2.5 last:mb-0 ${dim ? 'opacity-90' : ''}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className={`text-[10px] tracking-widest px-1.5 py-0.5 rounded ${
            dim
              ? 'bg-paper border border-amber-900/15 text-ink/60'
              : 'bg-plum/10 text-plum'
          }`}
        >
          {label}
        </span>
        <span className="text-[11px] text-ink/65">{keywords.join('・')}</span>
      </div>
      <p className="text-xs leading-relaxed text-ink/80">{body}</p>
    </div>
  );
}
