// 和色名 → hex の表示専用マップ。
// luckyColor の文字列を画面に色見本として描くためだけに使う。
// エンジン層は触らない (新色を data 側で増やしたらここにも追記)。

export const JAPANESE_COLORS: Record<string, string> = {
  // 赤系
  '緋色': '#d3381c',
  '朱色': '#eb6238',
  '朱赤': '#dc3023',
  '茜色': '#9e2a2b',
  '深紅': '#88141a',
  '珊瑚色': '#f88379',
  '桜色': '#fbe2e3',
  '撫子色': '#eea9b8',
  // 黄〜橙系
  '柚子色': '#dec361',
  '蜜柑色': '#f08300',
  '橙色': '#ee7800',
  '黄金色': '#e6b422',
  '金': '#e6b422',
  '黄土色': '#bb8141',
  'レモン色': '#fff44f',
  // 緑系
  '若草色': '#c3d825',
  '萌葱色': '#006e54',
  '常磐色': '#007b43',
  '深緑': '#13393b',
  '緑': '#3eb370',
  // 青系
  '空色': '#a0d8ef',
  '海色': '#1f6f8b',
  '瑠璃色': '#1e50a2',
  '紺青': '#192f60',
  '藍色': '#165e83',
  'ターコイズ': '#3eb1ad',
  // 紫系
  '藤色': '#a59aca',
  '桔梗色': '#6a4c9c',
  '紫紺': '#3a243b',
  // 茶〜土系
  '茶色': '#965042',
  '濃茶': '#564539',
  'ベージュ': '#e8d3a1',
  '土色': '#b1825b',
  // 白〜銀系
  '白': '#ffffff',
  '白銀': '#dcdddd',
  '銀色': '#dcdddd',
  '銀': '#c0c0c0',
  '銀鼠': '#a3a3a3',
};

// '白・銀' のような複合色は ・ で分割して 2 色に解決する。
// 解決できない名前は空配列を返す (UI 側で swatch 非表示の判定に使う)。
export function resolveColor(name: string): string[] {
  const parts = name.split('・').map((s) => s.trim()).filter(Boolean);
  const hexes = parts
    .map((p) => JAPANESE_COLORS[p])
    .filter((h): h is string => typeof h === 'string');
  return hexes.length === parts.length ? hexes : [];
}
