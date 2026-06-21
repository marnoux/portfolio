// Dirk adapter — VERIFIED working (June 2026).
// Uses the Detailresult GraphQL gateway that powers dirk.nl. The api key and
// default storeId were read from the dirk.nl frontend config. Price lives in the
// nested `productAssortment` (offerPrice is 0 when not on offer).
import type { ProductMatch, StoreAdapter } from './types';
import { fetchWithTimeout } from './util.server';

const GATEWAY = 'https://web-gateway.dirk.nl/graphql';
const API_KEY = '6d3a42a3-6d93-4f98-838d-bcc0ab2307fd'; // public key from dirk.nl frontend
const STORE_ID = 66; // default store used by dirk.nl
const IMAGE_BASE = 'https://web-fileserver.dirk.nl/artikelen/';

const QUERY = `
  query Search($search: String!, $limit: Int, $storeId: Int!) {
    searchProducts(search: $search, limit: $limit) {
      products {
        product {
          productId
          brand
          headerText
          subText
          packaging
          image
          productAssortment(storeId: $storeId) { normalPrice offerPrice }
        }
      }
    }
  }
`;

interface DirkProduct {
  productId?: number;
  brand?: string;
  headerText?: string;
  subText?: string;
  packaging?: string;
  image?: string;
  productAssortment?: { normalPrice?: number; offerPrice?: number } | null;
}

export const dirkAdapter: StoreAdapter = {
  id: 'dirk',
  async search(query, limit) {
    const res = await fetchWithTimeout(GATEWAY, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: API_KEY,
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { search: query, limit, storeId: STORE_ID },
      }),
    });
    if (!res.ok) throw new Error(`Dirk ${res.status}`);
    const json = (await res.json()) as any;
    if (json?.errors?.length) throw new Error(`Dirk gql: ${json.errors[0]?.message ?? 'error'}`);
    const rows: { product: DirkProduct }[] = json?.data?.searchProducts?.products ?? [];

    return rows
      .map(({ product: p }): ProductMatch => {
        const normal = Number(p.productAssortment?.normalPrice);
        const offer = Number(p.productAssortment?.offerPrice);
        const onOffer = Number.isFinite(offer) && offer > 0 && offer < normal;
        const price = onOffer ? offer : normal;
        const name = [p.headerText, p.subText].filter(Boolean).join(' ').trim() || p.brand || '';
        const image = p.image
          ? p.image.startsWith('http')
            ? p.image
            : IMAGE_BASE + p.image
          : undefined;
        return {
          store: 'dirk',
          name,
          price,
          size: p.packaging,
          onOffer,
          image,
          url: p.productId ? `https://www.dirk.nl/zoeken/${p.productId}` : undefined,
        };
      })
      .filter((m) => m.name && Number.isFinite(m.price) && m.price > 0)
      .slice(0, limit);
  },
};
