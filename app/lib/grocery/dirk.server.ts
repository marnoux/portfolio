// Dirk adapter — best-effort against the Detailresult GraphQL gateway that
// powers dirk.nl. The gateway api key + clientId + storeId below were read from
// the dirk.nl frontend config; the `ListProducts` query shape is a best guess
// from the bundle's operation names and is UNVERIFIED (the gateway host was
// unreachable from datacenter IPs during local testing). Parsing is defensive
// and any failure degrades this store to "no data" — VERIFY ON DEPLOY.
import type { ProductMatch, StoreAdapter } from './types';
import { fetchWithTimeout } from './util.server';

const GATEWAY = 'https://web-dirk-gateway.detailresult.nl/graphql';
const API_KEY = '6d3a42a3-6d93-4f98-838d-bcc0ab2307fd'; // public key from dirk.nl frontend
const STORE_ID = 66; // default store used by dirk.nl

const QUERY = `
  query ListProducts($searchString: String, $storeId: Int) {
    listProducts(searchString: $searchString, storeId: $storeId) {
      products {
        productId
        headerText
        subText
        packaging
        image
        normalPrice
        offerPrice
      }
    }
  }
`;

function pickPrice(p: any): number {
  const offer = Number(p?.offerPrice);
  const normal = Number(p?.normalPrice);
  if (Number.isFinite(offer) && offer > 0) return offer;
  return normal;
}

export const dirkAdapter: StoreAdapter = {
  id: 'dirk',
  async search(query, limit) {
    const res = await fetchWithTimeout(GATEWAY, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: API_KEY,
        'user-agent': 'okhttp/4.9.1',
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { searchString: query, storeId: STORE_ID },
      }),
    });
    if (!res.ok) throw new Error(`Dirk ${res.status}`);
    const json = (await res.json()) as any;
    if (json?.errors?.length) throw new Error(`Dirk gql: ${json.errors[0]?.message ?? 'error'}`);
    const products: any[] = json?.data?.listProducts?.products ?? [];
    return products
      .map((p): ProductMatch => {
        const price = pickPrice(p);
        const name = [p?.headerText, p?.subText].filter(Boolean).join(' ');
        const img: string | undefined = p?.image
          ? p.image.startsWith('http')
            ? p.image
            : `https://d3r3h30p75xj6a.cloudfront.net/${p.image}`
          : undefined;
        return {
          store: 'dirk',
          name,
          price,
          size: p?.packaging,
          onOffer: Number(p?.offerPrice) > 0 && Number(p?.offerPrice) < Number(p?.normalPrice),
          image: img,
        };
      })
      .filter((m) => m.name && Number.isFinite(m.price) && m.price > 0)
      .slice(0, limit);
  },
};
