import { SANMEI_STARS } from '../../fortunes/sanmei/stars';
import { NarrativeCard } from './NarrativeCard';

export function SanmeiCatalog() {
  return (
    <div>
      <p className="text-xs text-ink/55 mb-3 leading-relaxed">
        本サイト独自の 10 タイプ星すべて。生まれ年の十干（年干、立春前は前年扱い）から 1 つに決まります。
      </p>
      <div className="space-y-2.5">
        {SANMEI_STARS.map((s) => (
          <NarrativeCard
            key={s.stem}
            badge={s.stem}
            title={s.starName}
            alias={s.axis}
            catchphrase={s.catchphrase}
            summary={s.summary}
            general={s.general}
            love={s.love}
            work={s.work}
            growth={s.growth}
            shadow={s.shadow}
            luckyColor={s.luckyColor}
            luckyItem={s.luckyItem}
            advice={s.advice}
          />
        ))}
      </div>
    </div>
  );
}
