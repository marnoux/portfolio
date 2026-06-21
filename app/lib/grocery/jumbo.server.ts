// Jumbo adapter — implemented to the documented mobile API spec (v17 search,
// no auth). Confirmed unreachable from datacenter IPs during local testing
// (empty response), so it may need a residential/edge IP — VERIFY ON DEPLOY.
// Parsing is defensive so shape drift degrades to "no data" rather than crashes.
import type { ProductMatch, StoreAdapter } from './types';
import { fetchWithTimeout } from './util.server';

const BASE = 'https://mobileapi.jumbo.com/v17';
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0',
  Accept: 'application/json',
};

function formatUnit(unitPrice: any): string | undefined {
  const amount = unitPrice?.price?.amount;
  const unit = unitPrice?.unit;
  if (typeof amount !== 'number' || !unit) return undefined;
  return `€${(amount / 100).toFixed(2)}/${unit}`;
}

export const jumboAdapter: StoreAdapter = {
  id: 'jumbo',
  async search(query, limit) {
    const url = `${BASE}/search?offset=0&limit=${limit}&q=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(url, { headers: HEADERS });
    if (!res.ok) throw new Error(`Jumbo ${res.status}`);
    const data = (await res.json()) as any;
    const items: any[] = data?.products?.data ?? [];
    return items
      .map((p): ProductMatch => {
        const amount = p?.prices?.price?.amount; // cents
        const img = p?.imageInfo?.primaryView?.[0]?.url ?? p?.image;
        return {
          store: 'jumbo',
          name: p?.title,
          price: typeof amount === 'number' ? amount / 100 : NaN,
          size: p?.quantity,
          unitPrice: formatUnit(p?.prices?.unitPrice),
          onOffer: !!p?.promotion,
          image: img,
          url: p?.id ? `https://www.jumbo.com/producten/${p.id}` : undefined,
        };
      })
      .filter((m) => m.name && Number.isFinite(m.price))
      .slice(0, limit);
  },
};
