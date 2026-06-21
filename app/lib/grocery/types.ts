// Shared types for the grocery price-comparison feature (/groceries).
// One adapter per store turns a search term into a ranked list of ProductMatch.

export type StoreId = 'ah' | 'jumbo' | 'dirk';

export const STORES: { id: StoreId; label: string; color: string }[] = [
  { id: 'ah', label: 'Albert Heijn', color: '#00ade6' },
  { id: 'jumbo', label: 'Jumbo', color: '#eeb200' },
  { id: 'dirk', label: 'Dirk', color: '#e1001a' },
];

export const STORE_LABEL: Record<StoreId, string> = Object.fromEntries(
  STORES.map((s) => [s.id, s.label]),
) as Record<StoreId, string>;

export interface ProductMatch {
  store: StoreId;
  name: string;
  price: number; // euros
  size?: string; // e.g. "180 g"
  unitPrice?: string; // e.g. "€22.17/kg"
  onOffer?: boolean;
  image?: string;
  url?: string;
}

// Result of one store for one search term. Empty matches => "no data".
export interface StoreItemResult {
  store: StoreId;
  matches: ProductMatch[]; // ranked best-first (best match + alternatives)
  error?: string; // set when the adapter threw/failed
}

export interface ItemResult {
  query: string; // what the user typed
  translated?: string; // dutch term actually sent to the stores, if different
  stores: StoreItemResult[]; // one per store, in STORES order
}

export interface SearchResponse {
  items: ItemResult[];
  generatedAt: string;
}

export interface StoreAdapter {
  id: StoreId;
  // Return up to `limit` matches, ranked best-first. Throw on failure;
  // the orchestrator catches and degrades that store to "no data".
  search(query: string, limit: number): Promise<ProductMatch[]>;
}
