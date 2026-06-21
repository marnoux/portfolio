// Albert Heijn adapter — VERIFIED working (June 2026).
// Flow: POST an anonymous token, then GET the mobile product search.
// The `x-application: AHWEBSHOP` header is required or the API 500s with
// "Can not find application: 'null'".
import type { ProductMatch, StoreAdapter } from './types';
import { cleanUnitPrice, fetchWithTimeout } from './util.server';

const BASE = 'https://api.ah.nl';
const HEADERS = {
  'x-application': 'AHWEBSHOP',
  'user-agent': 'Appie/8.8.2 Model/phone Android/7.0-API24',
  'content-type': 'application/json; charset=UTF-8',
};

// Cache the anonymous token across requests on a warm instance.
let tokenCache: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 30_000) return tokenCache.token;
  const res = await fetchWithTimeout(`${BASE}/mobile-auth/v1/auth/token/anonymous`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ clientId: 'appie' }),
  });
  if (!res.ok) throw new Error(`AH token ${res.status}`);
  const data = (await res.json()) as { access_token: string; expires_in?: number };
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 7200) * 1000,
  };
  return data.access_token;
}

interface AhProduct {
  title: string;
  webshopId?: number;
  salesUnitSize?: string;
  unitPriceDescription?: string;
  currentPrice?: number | null; // bonus/discounted price, null when not on bonus
  priceBeforeBonus?: number; // regular price
  isBonus?: boolean;
  images?: { url: string }[];
}

export const ahAdapter: StoreAdapter = {
  id: 'ah',
  async search(query, limit) {
    const token = await getToken();
    const url =
      `${BASE}/mobile-services/product/search/v2` +
      `?sortOn=RELEVANCE&page=0&size=${limit}&query=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(url, {
      headers: { ...HEADERS, Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`AH search ${res.status}`);
    const data = (await res.json()) as { products?: AhProduct[] };
    return (data.products ?? [])
      .map((p): ProductMatch => {
        const price = typeof p.currentPrice === 'number' ? p.currentPrice : p.priceBeforeBonus;
        const img = p.images?.length ? p.images[p.images.length - 1].url : undefined;
        return {
          store: 'ah',
          name: p.title,
          price: price as number,
          size: p.salesUnitSize,
          unitPrice: cleanUnitPrice(p.unitPriceDescription),
          onOffer: !!p.isBonus,
          image: img,
          url: p.webshopId ? `https://www.ah.nl/producten/product/wi${p.webshopId}` : undefined,
        };
      })
      .filter((m) => typeof m.price === 'number' && Number.isFinite(m.price))
      .slice(0, limit);
  },
};
