import { RANKS } from '../../fortunes/omikuji/data';

const TOTAL_WEIGHT = RANKS.reduce((s, r) => s + r.weight, 0);

export function OmikujiCatalog() {
  return (
    <div className="rounded-lg bg-mist/40 border border-amber-900/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-paper text-ink/60 text-xs">
          <tr>
            <th className="text-left px-4 py-2.5 font-medium">ランク</th>
            <th className="text-right px-4 py-2.5 font-medium">出現比率</th>
            <th className="text-right px-4 py-2.5 font-medium">スコア帯</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-amber-900/5">
          {RANKS.map((r) => (
            <tr key={r.name}>
              <td className="px-4 py-2.5 font-serif text-base text-plum">{r.name}</td>
              <td className="px-4 py-2.5 text-right text-ink/80 tabular-nums">
                {r.weight} / {TOTAL_WEIGHT}
                <span className="text-ink/50 text-xs ml-1.5">
                  （{Math.round((r.weight / TOTAL_WEIGHT) * 100)}%）
                </span>
              </td>
              <td className="px-4 py-2.5 text-right text-ink/80 tabular-nums">
                {r.score[0]}〜{r.score[1]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-3 text-[11px] text-ink/55 leading-relaxed border-t border-amber-900/10">
        重みは抽選時の出現しやすさを表す内部値です。スコア帯はランクごとに割り当てた点数の範囲。当サイトの配分はやや「吉」寄りに調整した独自設定です。
      </p>
    </div>
  );
}
