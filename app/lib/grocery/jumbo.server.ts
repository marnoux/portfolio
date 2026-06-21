// Jumbo adapter — VERIFIED working (June 2026).
// The mobile API (mobileapi.jumbo.com) is Akamai-protected and resets non-app
// clients, so we use the website's Apollo GraphQL gateway instead. It requires
// the `apollographql-client-name/-version` headers (otherwise 401 "No client
// headers set") and `searchType: "keyword"` (otherwise the downstream 400s).
import type { ProductMatch, StoreAdapter } from './types';
import { fetchWithTimeout } from './util.server';

const ENDPOINT = 'https://www.jumbo.com/api/graphql';
const HEADERS = {
  'content-type': 'application/json',
  // Values read from the jumbo.com frontend config; the version may drift over
  // time but Jumbo only checks the headers are present, not the exact value.
  'apollographql-client-name': 'JUMBO_WEB',
  'apollographql-client-version': 'master-v33.9.0-web',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
};

// Minimal slice of the site's SearchProducts query — just the product fields we need.
const QUERY = `
  query SearchProducts($input: ProductSearchInput!) {
    searchProducts(input: $input) {
      products {
        title
        brand
        subtitle: packSizeDisplay
        image
        link
        price { price promoPrice pricePerUnit { price unit } }
      }
    }
  }
`;

interface JumboProduct {
  title: string;
  brand?: string;
  subtitle?: string;
  image?: string;
  link?: string;
  price?: {
    price?: number; // cents
    promoPrice?: number | null; // cents, when on offer
    pricePerUnit?: { price?: number; unit?: string } | null;
  };
}

export const jumboAdapter: StoreAdapter = {
  id: 'jumbo',
  async search(query, limit) {
    const res = await fetchWithTimeout(ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        query: QUERY,
        variables: { input: { searchTerms: query, searchType: 'keyword', offSet: 0, limit } },
      }),
    });
    if (!res.ok) throw new Error(`Jumbo ${res.status}`);
    const json = (await res.json()) as any;
    if (json?.errors?.length) throw new Error(`Jumbo gql: ${json.errors[0]?.message ?? 'error'}`);
    const products: JumboProduct[] = json?.data?.searchProducts?.products ?? [];

    return products
      .map((p): ProductMatch => {
        const cents = p.price?.promoPrice ?? p.price?.price;
        const ppu = p.price?.pricePerUnit;
        return {
          store: 'jumbo',
          name: p.title,
          price: typeof cents === 'number' ? cents / 100 : NaN,
          size: p.subtitle,
          unitPrice:
            ppu?.price != null && ppu.unit
              ? `€${(ppu.price / 100).toFixed(2)}/${ppu.unit}`
              : undefined,
          onOffer: p.price?.promoPrice != null,
          image: p.image,
          url: p.link ? `https://www.jumbo.com${p.link}` : undefined,
        };
      })
      .filter((m) => m.name && Number.isFinite(m.price))
      .slice(0, limit);
  },
};
