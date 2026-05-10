import { SIGNS } from '../../fortunes/astrology/signs';
import { NarrativeCard } from './NarrativeCard';

export function AstrologyCatalog() {
  return (
    <div>
      <p className="text-xs text-ink/55 mb-3 leading-relaxed">
        西洋占星術の 12 星座すべて。生まれた日に太陽がどの星座にあったかで、ひとつのタイプに分かれます。
      </p>
      <div className="space-y-2.5">
        {SIGNS.map((s) => (
          <NarrativeCard
            key={s.name}
            badge={s.symbol}
            title={s.name}
            alias={s.alias}
            meta={[s.range, `元素 / ${s.element}`, `支配星 / ${s.ruler}`]}
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
