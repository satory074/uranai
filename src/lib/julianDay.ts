export function gregorianToJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export type Stem = (typeof STEMS)[number];
export type Branch = (typeof BRANCHES)[number];

export function dayStemBranch(year: number, month: number, day: number): {
  stem: Stem;
  branch: Branch;
  stemIndex: number;
  branchIndex: number;
} {
  const jd = gregorianToJulianDay(year, month, day);
  const sexagenary = (((jd + 49) % 60) + 60) % 60;
  const stemIndex = sexagenary % 10;
  const branchIndex = sexagenary % 12;
  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[branchIndex],
    stemIndex,
    branchIndex,
  };
}

/** Apply Risshun cutoff: dates Jan 1 – Feb 3 belong to the previous year for Eastern divination. */
export function risshunYear(year: number, month: number, day: number): number {
  if (month === 1) return year - 1;
  if (month === 2 && day < 4) return year - 1;
  return year;
}

export function yearStemBranch(year: number, month: number, day: number): {
  stem: Stem;
  branch: Branch;
  stemIndex: number;
  branchIndex: number;
} {
  const y = risshunYear(year, month, day);
  // 西暦4年が「甲子」(stem=0, branch=0)
  const idx = (((y - 4) % 60) + 60) % 60;
  const stemIndex = idx % 10;
  const branchIndex = idx % 12;
  return {
    stem: STEMS[stemIndex],
    branch: BRANCHES[branchIndex],
    stemIndex,
    branchIndex,
  };
}

export { STEMS, BRANCHES };
