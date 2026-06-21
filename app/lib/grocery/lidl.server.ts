// Lidl adapter — BEST-EFFORT / weekly offers only (per product decision).
// Lidl NL is mostly in-store: there is no reliable free product-price search
// API, and lidl.nl is a JS-rendered SPA (so static HTML scraping finds no
// prices). This adapter makes one best-effort attempt at Lidl's campaign/offers
// search JSON; when nothing usable comes back it returns [] and the store shows
// "no data". Expect partial coverage (items only appear when on offer).
//
// To make Lidl reliable later, wire a real source here (e.g. a paid scraper such
// as Apify/ShoppingScraper, or a reverse-engineered Lidl Plus offers endpoint)
// behind this same interface — nothing else in the app needs to change.
import type { ProductMatch, StoreAdapter } from './types';
import { fetchWithTimeout } from './util.server';

// Lidl's search-as-you-type campaign endpoint (NL). Unofficial and may change;
// any failure (non-200, non-JSON, shape drift) degrades to "no data".
const SEARCH = 'https://www.lidl.nl/q/api/search';

export const lidlAdapter: StoreAdapter = {
  id: 'lidl',
  async search(query, limit) {
    const url = `${SEARCH}?q=${encodeURIComponent(query)}&fetchsize=${limit}&assortmentEndpoint=true`;
    const res = await fetchWithTimeout(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'nl-NL,nl;q=0.9',
      },
    });
    if (!res.ok) throw new Error(`Lidl ${res.status}`);

    // Guard: if Lidl returns HTML (SPA shell) instead of JSON, bail to "no data".
    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return [];
    }

    const items: any[] = data?.items ?? data?.products ?? [];
    return items
      .map((p): ProductMatch => {
        const price = Number(
          p?.price?.price ?? p?.price?.amount ?? p?.gridbox?.price?.price ?? p?.price,
        );
        return {
          store: 'lidl',
          name: p?.fullTitle ?? p?.title ?? p?.keyfacts?.fullTitle ?? p?.name,
          price,
          size: p?.packaging ?? p?.keyfacts?.supplementalDescription,
          onOffer: true, // anything surfaced here is a current offer
          image: p?.image ?? p?.images?.[0],
          url: p?.canonicalUrl ?? p?.url,
        };
      })
      .filter((m) => m.name && Number.isFinite(m.price) && m.price > 0)
      .slice(0, limit);
  },
};
