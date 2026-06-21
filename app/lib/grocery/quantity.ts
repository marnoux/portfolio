// Pure helpers (client + server safe) for normalizing pack sizes and choosing,
// per item, a set of similarly-sized products across stores so the default
// comparison is apples-to-apples rather than "180 g vs 1 kg".
import type { ItemResult, StoreId } from './types';

export type QtyFamily = 'weight' | 'volume' | 'count';
export interface Quantity {
  value: number; // normalized to base unit: grams / millilitres / pieces
  family: QtyFamily;
}

// Map a raw unit token to its family and a factor to the base unit.
function classifyUnit(u: string): { family: QtyFamily; factor: number } | null {
  switch (u) {
    case 'kg':
    case 'kilo':
    case 'kilogram':
      return { family: 'weight', factor: 1000 };
    case 'g':
    case 'gr':
    case 'gram':
      return { family: 'weight', factor: 1 };
    case 'l':
    case 'lt':
    case 'ltr':
    case 'liter':
      return { family: 'volume', factor: 1000 };
    case 'cl':
      return { family: 'volume', factor: 10 };
    case 'ml':
      return { family: 'volume', factor: 1 };
    case 'st':
    case 'stk':
    case 'stuk':
    case 'stuks':
    case 'piece':
    case 'pieces':
      return { family: 'count', factor: 1 };
    default:
      return null;
  }
}

// Parse a size string like "180 g", "1 kg (ca. 10 stuks)", "6 x 1,5 l", "5 stuks".
// Prefers weight > volume > count when several appear (e.g. "1 kg (10 stuks)").
export function parseQuantity(size?: string): Quantity | null {
  if (!size) return null;
  const s = size.toLowerCase().replace(/ca\.?/g, ' ').replace(',', '.');

  // "a x b unit" → a*b unit (multipacks)
  const mult = s.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*([a-z]+)/);
  if (mult) {
    const cu = classifyUnit(mult[3]);
    if (cu) {
      return { value: parseFloat(mult[1]) * parseFloat(mult[2]) * cu.factor, family: cu.family };
    }
  }

  const found: Quantity[] = [];
  const re = /(\d+(?:\.\d+)?)\s*([a-z]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    const cu = classifyUnit(m[2]);
    if (cu) found.push({ value: parseFloat(m[1]) * cu.factor, family: cu.family });
  }
  if (!found.length) return null;

  const order: QtyFamily[] = ['weight', 'volume', 'count'];
  found.sort((a, b) => order.indexOf(a.family) - order.indexOf(b.family));
  return found[0];
}

function median(nums: number[]): number {
  const s = [...nums].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
}

// For one item, choose each store's default match index: the product whose size
// is closest to the cross-store reference size, breaking near-ties by price.
// Falls back to the cheapest match when sizes can't be parsed.
export function defaultSelectionsForItem(item: ItemResult): Record<StoreId, number> {
  const result = {} as Record<StoreId, number>;
  const parsed: Record<string, (Quantity | null)[]> = {};
  for (const sr of item.stores) parsed[sr.store] = sr.matches.map((m) => parseQuantity(m.size));

  const cheapest = (store: StoreId): number => {
    const ms = item.stores.find((s) => s.store === store)?.matches ?? [];
    let bi = 0;
    for (let i = 1; i < ms.length; i++) if (ms[i].price < ms[bi].price) bi = i;
    return bi;
  };

  // Dominant unit family = the one most stores can express (via their best match).
  const familyCount: Record<QtyFamily, number> = { weight: 0, volume: 0, count: 0 };
  for (const sr of item.stores) {
    const q = parsed[sr.store].find((x): x is Quantity => !!x);
    if (q) familyCount[q.family]++;
  }
  const ranked = (Object.entries(familyCount) as [QtyFamily, number][])
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);

  if (!ranked.length) {
    for (const sr of item.stores) result[sr.store] = cheapest(sr.store);
    return result;
  }

  const domFamily = ranked[0][0];
  // Reference size = median of each store's best in-family quantity.
  const reps: number[] = [];
  for (const sr of item.stores) {
    const q = parsed[sr.store].find((x): x is Quantity => !!x && x.family === domFamily);
    if (q) reps.push(q.value);
  }
  const ref = reps.length ? median(reps) : 0;

  for (const sr of item.stores) {
    const cands = sr.matches
      .map((m, i) => ({ i, q: parsed[sr.store][i], price: m.price }))
      .filter((c): c is { i: number; q: Quantity; price: number } => !!c.q && c.q.family === domFamily)
      .map((c) => ({ ...c, dist: ref > 0 ? Math.abs(Math.log(c.q.value / ref)) : 0 }));

    if (!cands.length) {
      result[sr.store] = cheapest(sr.store);
      continue;
    }
    const minDist = Math.min(...cands.map((c) => c.dist));
    // Among products within ~20% of the closest size, take the cheapest.
    const near = cands.filter((c) => c.dist <= minDist + 0.18).sort((a, b) => a.price - b.price);
    result[sr.store] = near[0].i;
  }
  return result;
}
