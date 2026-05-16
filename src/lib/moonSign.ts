// 月の黄経を簡易計算し、30 度ごとに切って星座インデックス (0=牡羊..11=魚) を返す。
// Meeus "Astronomical Algorithms" の低精度近似で、平均運動 + 平均近点角の主要等式項のみ採用。
// 精度はおよそ ±1〜2° 程度。星座 (30° 幅) の判定には実用上十分だが、切り替わる境目の 1 日は前後どちらの星座にも揺らぐことがある。
// methodInfo の simplified でこの旨を明示している。

import { gregorianToJulianDay } from './julianDay';

const DEG = Math.PI / 180;

const SIGN_NAMES = [
  '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
  '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座',
] as const;

export type MoonSignName = (typeof SIGN_NAMES)[number];

export function moonLongitude(year: number, month: number, day: number): number {
  const jd = gregorianToJulianDay(year, month, day);
  const d = jd - 2451545.0; // days since J2000.0 (noon UT, 2000-01-01)
  const L = 218.316 + 13.176396 * d;          // 月の平均黄経
  const M = 134.963 + 13.064993 * d;          // 月の平均近点角
  const lambda = L + 6.289 * Math.sin(M * DEG); // 中心の式の主要項のみ
  return ((lambda % 360) + 360) % 360;
}

export function moonSignIndex(year: number, month: number, day: number): number {
  return Math.floor(moonLongitude(year, month, day) / 30);
}

export function moonSignName(year: number, month: number, day: number): MoonSignName {
  return SIGN_NAMES[moonSignIndex(year, month, day)];
}

export { SIGN_NAMES };
