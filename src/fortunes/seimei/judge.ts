// 1〜81の画数に対する判定。古典の「吉数／凶数」を参考にしつつ、
// 表現は柔らかい印象語に置き換え、断定を避ける。
export type Tone = 'bright' | 'mild' | 'cool' | 'caution';

export const STROKE_TONES: Record<number, { tone: Tone; label: string; hint: string }> = (() => {
  const map: Record<number, { tone: Tone; label: string; hint: string }> = {};
  // 古典で吉とされる代表数
  const bright = new Set([1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 58, 61, 63, 65, 67, 68, 81]);
  // 中立的（「半吉」相当）
  const mild = new Set([6, 7, 17, 18, 27, 30, 38, 51, 55, 58, 71, 73, 75, 77, 78]);
  // 一般に注意とされる代表数
  const caution = new Set([2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 28, 34, 36, 40, 42, 43, 44, 46, 49, 50, 53, 54, 56, 59, 60, 62, 64, 66, 69, 70, 72, 74, 76, 79, 80]);

  for (let n = 1; n <= 81; n++) {
    if (bright.has(n)) {
      map[n] = { tone: 'bright', label: '伸びやか', hint: '前向きなエネルギーが流れやすい印象。' };
    } else if (mild.has(n)) {
      map[n] = { tone: 'mild', label: '穏やか', hint: '安定的でバランスの良い傾向。' };
    } else if (caution.has(n)) {
      map[n] = { tone: 'caution', label: '内省的', hint: '慎重さが武器になる印象。背伸びせず歩むと吉。' };
    } else {
      map[n] = { tone: 'cool', label: '静か', hint: '落ち着きと深さを感じさせる印象。' };
    }
  }
  return map;
})();

export function tonalLabel(strokes: number): { tone: Tone; label: string; hint: string } {
  const reduced = ((strokes - 1) % 81) + 1;
  return STROKE_TONES[reduced] ?? { tone: 'cool', label: '静か', hint: '落ち着いた印象。' };
}
