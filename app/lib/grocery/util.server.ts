// Server-only helpers shared by the store adapters.

// fetch() with an abort-based timeout so a slow/blocking store can't stall the
// whole request. Default 7s keeps us comfortably under serverless limits even
// when querying 4 stores in parallel.
export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {},
): Promise<Response> {
  const { timeoutMs = 7000, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Turn AH's "prijs per kg €22.17" style description into a compact "€22.17/kg".
export function cleanUnitPrice(desc?: string | null): string | undefined {
  if (!desc) return undefined;
  const m = desc.match(/per\s+([\wÀ-ÿ.]+)\s*(€\s*[\d.,]+)/i);
  if (m) return `${m[2].replace(/\s+/g, '')}/${m[1]}`;
  return desc.trim() || undefined;
}

// The store search APIs are Dutch; map common English grocery words to Dutch so
// that "tomatoes" finds something. Unknown terms pass through unchanged.
const EN_TO_NL: Record<string, string> = {
  tomato: 'tomaten', tomatoes: 'tomaten',
  egg: 'eieren', eggs: 'eieren',
  milk: 'melk', bread: 'brood', cheese: 'kaas', butter: 'boter',
  chicken: 'kip', beef: 'rundvlees', pork: 'varkensvlees', fish: 'vis',
  apple: 'appel', apples: 'appels', banana: 'banaan', bananas: 'bananen',
  potato: 'aardappel', potatoes: 'aardappelen', onion: 'ui', onions: 'uien',
  carrot: 'wortel', carrots: 'wortels', cucumber: 'komkommer',
  orange: 'sinaasappel', oranges: 'sinaasappels', lemon: 'citroen',
  rice: 'rijst', pasta: 'pasta', flour: 'bloem', sugar: 'suiker',
  salt: 'zout', pepper: 'peper', water: 'water', coffee: 'koffie',
  tea: 'thee', yogurt: 'yoghurt', yoghurt: 'yoghurt',
};

export function toDutch(query: string): string {
  const key = query.trim().toLowerCase();
  return EN_TO_NL[key] ?? query.trim();
}
