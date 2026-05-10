import { STEM_TYPES } from '../../fortunes/shichu/stems';
import { NarrativeCard } from './NarrativeCard';

export function ShichuCatalog() {
  return (
    <div>
      <p className="text-xs text-ink/55 mb-3 leading-relaxed">
        十干（甲〜癸）に対応する 10 種類の素材タイプすべて。生年月日から導かれる「日干」で 1 つに決まります。
      </p>
      <div className="space-y-2.5">
        {STEM_TYPES.map((s) => (
          <NarrativeCard
            key={s.stem}
            badge={s.stem}
            title={s.typeName}
            alias={s.stemKana}
            meta={[`陰陽 / ${s.yinYang}`, `五行 / ${s.element}`]}
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
