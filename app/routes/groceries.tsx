import { useMemo, useState } from 'react';
import { Form, Link, useActionData, useNavigation } from 'react-router';
import type { Route } from './+types/groceries';
import { parseItems, searchAllStores } from '../lib/grocery/index.server';
import { defaultSelectionsForItem } from '../lib/grocery/quantity';
import { STORES } from '../lib/grocery/types';
import type { ItemResult, ProductMatch, StoreId } from '../lib/grocery/types';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Grocery Price Compare' },
    {
      name: 'description',
      content: 'Compare grocery prices across Dutch supermarkets (AH, Jumbo, Dirk).',
    },
  ];
}

// ─── Server action ──────────────────────────────────────────────────────────
// Runs server-side (browsers can't call the store APIs directly — CORS).
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const raw = String(form.get('items') ?? '');
  const items = parseItems(raw);
  if (items.length === 0) {
    return { ok: false as const, error: 'Enter at least one grocery item.', raw };
  }
  const data = await searchAllStores(items);
  return { ok: true as const, items: data.items, generatedAt: data.generatedAt, raw };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────
const euro = (n: number) => `€${n.toFixed(2).replace('.', ',')}`;

function matchAt(item: ItemResult, store: StoreId, idx: number): ProductMatch | undefined {
  return item.stores.find((s) => s.store === store)?.matches[idx];
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function GroceriesPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const busy = navigation.state !== 'idle' && navigation.formData != null;

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f2ee]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <Link to="/" className="text-sm text-[#36b2ed] hover:underline">
            ← Back home
          </Link>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Grocery Price Compare</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-400">
            Enter your grocery list and we&apos;ll check{' '}
            <span className="text-gray-200">Albert Heijn, Jumbo &amp; Dirk</span> to show where each
            item is cheapest. Tip: Dutch terms match best (e.g. <em>tomaten, eieren, melk</em>).
          </p>
        </header>

        <Form method="post" className="mb-8">
          <label htmlFor="items" className="mb-2 block text-sm font-medium text-gray-300">
            Your list — one item per line (or comma-separated)
          </label>
          <textarea
            id="items"
            name="items"
            rows={5}
            defaultValue={actionData?.raw ?? ''}
            placeholder={'tomaten\neieren\nmelk\nbrood'}
            className="w-full resize-y rounded-lg border border-[#2a2a2a] bg-[#161616] p-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 focus:border-[#36b2ed]"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-[#36b2ed] px-5 py-2.5 text-sm font-semibold text-[#0d0d0d] transition hover:bg-[#54c0f0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Comparing…' : 'Compare prices'}
            </button>
            <span className="text-xs text-gray-500">Up to 20 items.</span>
          </div>
          {actionData && !actionData.ok && (
            <p className="mt-3 text-sm text-red-400">{actionData.error}</p>
          )}
        </Form>

        {busy && <LoadingState />}

        {!busy && actionData?.ok && (
          <Results key={actionData.generatedAt} items={actionData.items} />
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-8 text-center text-sm text-gray-400">
      <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gray-600 border-t-[#36b2ed]" />
      Checking the supermarkets…
    </div>
  );
}

// ─── Results (holds alternative-selection state) ──────────────────────────────
function Results({ items }: { items: ItemResult[] }) {
  // selection key `${itemIndex}:${storeId}` -> chosen match index.
  // Defaults to similarly-sized products across stores (cheapest among them);
  // the user can override any store via its dropdown.
  const defaults = useMemo(() => items.map((it) => defaultSelectionsForItem(it)), [items]);
  const [selection, setSelection] = useState<Record<string, number>>({});
  const selIdx = (i: number, store: StoreId) =>
    selection[`${i}:${store}`] ?? defaults[i][store] ?? 0;
  const setSel = (i: number, store: StoreId, idx: number) =>
    setSelection((prev) => ({ ...prev, [`${i}:${store}`]: idx }));

  // Cheapest store per item + basket-level totals, recomputed as alternatives change.
  const summary = useMemo(() => {
    const cheapestPerItem: (StoreId | null)[] = [];
    const perStoreTotal = Object.fromEntries(
      STORES.map((s) => [s.id, { total: 0, covered: 0 }]),
    ) as Record<StoreId, { total: number; covered: number }>;
    let mixMatchTotal = 0;
    let pricedItems = 0;

    items.forEach((item, i) => {
      let best: { store: StoreId; price: number } | null = null;
      for (const { id } of STORES) {
        const m = matchAt(item, id, selIdx(i, id));
        if (!m) continue;
        perStoreTotal[id].total += m.price;
        perStoreTotal[id].covered += 1;
        if (!best || m.price < best.price) best = { store: id, price: m.price };
      }
      cheapestPerItem.push(best?.store ?? null);
      if (best) {
        mixMatchTotal += best.price;
        pricedItems += 1;
      }
    });

    // A store can win the "single store" basket only if it has every item.
    const fullStores = STORES.filter((s) => perStoreTotal[s.id].covered === items.length);
    const cheapestSingle = fullStores.length
      ? fullStores.reduce((a, b) =>
          perStoreTotal[a.id].total <= perStoreTotal[b.id].total ? a : b,
        )
      : null;

    return { cheapestPerItem, perStoreTotal, mixMatchTotal, pricedItems, cheapestSingle };
  }, [items, selection]);

  return (
    <div>
      {/* Comparison table */}
      <div className="overflow-x-auto rounded-lg border border-[#2a2a2a]">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#161616]">
              <th className="sticky left-0 z-10 bg-[#161616] px-3 py-3 font-semibold">Item</th>
              {STORES.map((s) => (
                <th key={s.id} className="min-w-[150px] px-3 py-3 font-semibold">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-[#2a2a2a] align-top">
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-[#0d0d0d] px-3 py-3 text-left font-medium capitalize"
                >
                  {item.query}
                  {item.translated && (
                    <span className="mt-0.5 block text-xs font-normal text-gray-500">
                      searched: {item.translated}
                    </span>
                  )}
                </th>
                {STORES.map((s) => (
                  <Cell
                    key={s.id}
                    item={item}
                    itemIndex={i}
                    store={s.id}
                    selectedIdx={selIdx(i, s.id)}
                    onSelect={(idx) => setSel(i, s.id, idx)}
                    isCheapest={summary.cheapestPerItem[i] === s.id}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Basket summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#1a9e5f]/40 bg-[#1a9e5f]/10 p-4">
          <div className="text-xs uppercase tracking-wide text-[#5fd99b]">
            Cheapest basket (mix &amp; match)
          </div>
          <div className="mt-1 text-2xl font-bold">{euro(summary.mixMatchTotal)}</div>
          <div className="mt-1 text-xs text-gray-400">
            Buying each item at its cheapest store · {summary.pricedItems} of {items.length} items
            priced
          </div>
        </div>

        <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-4">
          <div className="text-xs uppercase tracking-wide text-gray-400">Cheapest single store</div>
          {summary.cheapestSingle ? (
            <>
              <div className="mt-1 text-2xl font-bold">
                {summary.cheapestSingle.label}{' '}
                <span className="text-base font-semibold text-gray-300">
                  {euro(summary.perStoreTotal[summary.cheapestSingle.id].total)}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-400">Has every item on your list.</div>
            </>
          ) : (
            <div className="mt-1 text-sm text-gray-400">
              No single store had every item — see per-store totals below.
            </div>
          )}
        </div>
      </div>

      {/* Per-store totals */}
      <div className="mt-4 flex flex-wrap gap-3">
        {STORES.map((s) => {
          const t = summary.perStoreTotal[s.id];
          return (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#161616] px-3 py-2 text-sm"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-gray-300">{s.label}</span>
              <span className="font-semibold">{t.covered ? euro(t.total) : '—'}</span>
              <span className="text-xs text-gray-500">
                ({t.covered}/{items.length})
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-gray-600">
        Prices are fetched live from each store&apos;s public endpoints and may differ from in-store
        prices. Each store defaults to a similarly-sized product (cheapest among them) for a fair
        comparison — adjust any dropdown if a different product fits better.
      </p>
    </div>
  );
}

// ─── Single store cell ────────────────────────────────────────────────────────
function Cell({
  item,
  itemIndex,
  store,
  selectedIdx,
  onSelect,
  isCheapest,
}: {
  item: ItemResult;
  itemIndex: number;
  store: StoreId;
  selectedIdx: number;
  onSelect: (idx: number) => void;
  isCheapest: boolean;
}) {
  const result = item.stores.find((s) => s.store === store);
  const matches = result?.matches ?? [];
  const match = matches[selectedIdx];

  if (!match) {
    return (
      <td className="px-3 py-3 text-gray-600">
        <span title={result?.error ?? 'No matching product'}>—</span>
      </td>
    );
  }

  return (
    <td
      className={`px-3 py-3 ${
        isCheapest ? 'bg-[#1a9e5f]/15 ring-1 ring-inset ring-[#1a9e5f]/50' : ''
      }`}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold">{euro(match.price)}</span>
        {isCheapest && (
          <span className="rounded bg-[#1a9e5f] px-1.5 py-0.5 text-[10px] font-semibold text-[#0d0d0d]">
            cheapest
          </span>
        )}
        {match.onOffer && !isCheapest && (
          <span className="rounded bg-[#e03e2d] px-1.5 py-0.5 text-[10px] font-semibold text-white">
            offer
          </span>
        )}
      </div>
      <div className="mt-0.5 line-clamp-2 text-xs text-gray-300" title={match.name}>
        {match.name}
      </div>
      <div className="mt-0.5 text-[11px] text-gray-500">
        {[match.size, match.unitPrice].filter(Boolean).join(' · ')}
      </div>

      {matches.length > 1 && (
        <select
          value={selectedIdx}
          onChange={(e) => onSelect(Number(e.target.value))}
          className="mt-1.5 w-full max-w-[150px] rounded border border-[#2a2a2a] bg-[#0d0d0d] px-1 py-1 text-[11px] text-gray-300 outline-none focus:border-[#36b2ed]"
          aria-label={`Choose ${store} product for ${item.query}`}
        >
          {matches.map((m, idx) => (
            <option key={idx} value={idx}>
              {euro(m.price)} — {m.name}
            </option>
          ))}
        </select>
      )}
    </td>
  );
}
