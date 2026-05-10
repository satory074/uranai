import { STARS } from '../../fortunes/kyusei/data';
import { NarrativeCard } from './NarrativeCard';

export function KyuseiCatalog() {
  return (
    <div>
      <p className="text-xs text-ink/55 mb-3 leading-relaxed">
        九星気学の本命星 9 種類すべて。生まれ年（立春前は前年扱い）から 1 つに決まります。
      </p>
      <div className="space-y-2.5">
        {STARS.map((s) => (
          <NarrativeCard
            key={s.number}
            badge={String(s.number)}
            title={s.name}
            alias={s.shortName}
            meta={[`五行 / ${s.element}`]}
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
