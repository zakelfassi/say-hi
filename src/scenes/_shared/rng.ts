export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function sessionSeed(namespace: string): number {
  if (typeof window === "undefined") return hashString(namespace);
  const params = new URLSearchParams(window.location.search);
  const explicit = params.get("seed");
  if (explicit) return hashString(`${namespace}:${explicit}`);
  const key = `sayhi:seed:${namespace}`;
  let stored = sessionStorage.getItem(key);
  if (!stored) {
    stored = String(Math.floor(Math.random() * 2 ** 32));
    sessionStorage.setItem(key, stored);
  }
  return hashString(`${namespace}:${stored}`);
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

export function pickN<T>(rng: Rng, arr: readonly T[], n: number): T[] {
  const copy = arr.slice();
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]!);
  }
  return out;
}

export function range(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function chance(rng: Rng, p: number): boolean {
  return rng() < p;
}
