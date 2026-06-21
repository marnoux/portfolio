// Orchestrator: fans each search term out to every store in parallel and
// degrades any failing/slow store to "no data" without failing the request.
import { ahAdapter } from './ah.server';
import { jumboAdapter } from './jumbo.server';
import { dirkAdapter } from './dirk.server';
import { toDutch } from './util.server';
import { STORES } from './types';
import type { ItemResult, SearchResponse, StoreAdapter, StoreItemResult } from './types';

const ADAPTERS: StoreAdapter[] = [ahAdapter, jumboAdapter, dirkAdapter];

const MAX_ITEMS = 20;
// Fetch a wider pool of candidates so the "similar quantity" defaulting has
// enough sizes to choose a comparable product across stores (the dropdown then
// lists these as alternatives, ranked by relevance).
const ALT_LIMIT = 15;

// Parse the free-text input (newline- and/or comma-separated) into a clean,
// de-duplicated, capped list of search terms.
export function parseItems(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[\n,]+/)) {
    const term = part.trim();
    if (!term) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

export async function searchAllStores(items: string[]): Promise<SearchResponse> {
  const results = await Promise.all(
    items.map(async (query): Promise<ItemResult> => {
      const dutch = toDutch(query);
      const perStore = await Promise.all(
        ADAPTERS.map(async (adapter): Promise<StoreItemResult> => {
          try {
            const matches = await adapter.search(dutch, ALT_LIMIT);
            return { store: adapter.id, matches };
          } catch (err) {
            return {
              store: adapter.id,
              matches: [],
              error: err instanceof Error ? err.message : 'failed',
            };
          }
        }),
      );
      // Keep stores in a stable display order.
      const ordered = STORES.map(
        (s) => perStore.find((p) => p.store === s.id) ?? { store: s.id, matches: [] },
      );
      return { query, translated: dutch !== query ? dutch : undefined, stores: ordered };
    }),
  );

  return { items: results, generatedAt: new Date().toISOString() };
}
