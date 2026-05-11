// 64-bit deterministic PRNG.
// seed string → FNV-1a 64-bit → splitmix64 stream → float [0,1).
// 出力エントロピー上限は 2^64 ≈ 1.8×10^19 で、テンプレ拡張後の出力空間 (~6.6×10^13) を完全に上回る。

const MASK64 = 0xffffffffffffffffn;
const FNV_OFFSET = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const SM64_INC = 0x9e3779b97f4a7c15n;
const SM64_M1 = 0xbf58476d1ce4e5b9n;
const SM64_M2 = 0x94d049bb133111ebn;

function hashSeed64(str: string): bigint {
  let h = FNV_OFFSET;
  for (let i = 0; i < str.length; i++) {
    h ^= BigInt(str.charCodeAt(i));
    h = (h * FNV_PRIME) & MASK64;
  }
  return h;
}

function splitmix64(seed: bigint): () => number {
  let s = seed & MASK64;
  return () => {
    s = (s + SM64_INC) & MASK64;
    let z = s;
    z = ((z ^ (z >> 30n)) * SM64_M1) & MASK64;
    z = ((z ^ (z >> 27n)) * SM64_M2) & MASK64;
    z = (z ^ (z >> 31n)) & MASK64;
    return Number(z >> 11n) / 2 ** 53;
  };
}

export function createRng(seedStr: string): () => number {
  return splitmix64(hashSeed64(seedStr));
}

export function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)];
}

export function pickWeighted<T>(rng: () => number, list: readonly { value: T; weight: number }[]): T {
  const total = list.reduce((s, x) => s + x.weight, 0);
  let r = rng() * total;
  for (const item of list) {
    r -= item.weight;
    if (r <= 0) return item.value;
  }
  return list[list.length - 1].value;
}

export function shuffle<T>(rng: () => number, list: readonly T[]): T[] {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
