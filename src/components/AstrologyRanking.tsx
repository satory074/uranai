import type { RankingEntry } from '../fortunes/astrology/engine';

type Props = {
  ranking: RankingEntry[];
  natalAlias: string;          // ユーザー本来の星座 (alias)
  selectedAlias: string;       // 現在画面に表示している星座 (alias)
  onSelect: (alias: string) => void;
};

/**
 * 今日の 12 星座ランキング兼サインピッカー。
 * グリッドの各セルはクリック可能で、押すと astrology 結果がその星座のものに切り替わる。
 * ユーザーの本来の星座には★マーク、現在表示中の星座には強調背景が付く。
 */
export function AstrologyRanking({ ranking, natalAlias, selectedAlias, onSelect }: Props) {
  return (
    <div className="mb-5">
      <p className="text-xs text-plum/80 mb-2 leading-relaxed">
        今日の 12 星座ランキング（タップで他の星座の結果も見られます）
      </p>
      <ol className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {ranking.map(({ sign, total, rank }) => {
          const isNatal = sign.alias === natalAlias;
          const isSelected = sign.alias === selectedAlias;
          return (
            <li key={sign.alias} className="contents">
              <button
                type="button"
                onClick={() => onSelect(sign.alias)}
                aria-pressed={isSelected}
                aria-label={`${rank}位 ${sign.name} 合計${total}/20${isNatal ? ' (あなたの星座)' : ''}`}
                title={`${rank}位 ${sign.name} ${total}/20`}
                className={
                  'flex flex-col items-center justify-center gap-0 rounded-lg border px-1 py-2 text-center transition cursor-pointer ' +
                  (isSelected
                    ? 'border-plum bg-plum text-paper shadow-pop ring-2 ring-plum/20'
                    : 'border-border-hairline bg-paper text-ink hover:bg-mist hover:border-border-default')
                }
              >
                <span className={`text-[10px] leading-none ${isSelected ? 'text-paper/80' : 'text-plum/70'}`}>
                  {rank}位
                </span>
                <span className="text-base leading-tight" aria-hidden="true">
                  {sign.symbol}
                </span>
                <span className="text-[10px] leading-tight">
                  {sign.name.replace('座', '')}
                </span>
                <span className={`text-[10px] leading-none ${isSelected ? 'text-paper/80' : 'text-ink/55'}`}>
                  {total}/20
                </span>
                {isNatal && (
                  <span
                    className={`text-[10px] leading-none ${isSelected ? 'text-amber-200' : 'text-amber-500'}`}
                    aria-hidden="true"
                  >
                    ★
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
