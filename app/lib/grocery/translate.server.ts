// Translates grocery list items to Dutch supermarket search terms via Claude
// before the store API calls. Server-only (uses the secret ANTHROPIC_API_KEY).
//
// One batched call per submission (all items together) to keep latency/cost low.
// Fails soft: with no API key or on any error it falls back to the static EN->NL
// map in util.server.ts, so the route keeps working without Claude configured.
import Anthropic from '@anthropic-ai/sdk';
import { toDutch } from './util.server';

// Translation is a trivial task, so we use Haiku for low cost/latency.
// Swap to 'claude-opus-4-8' if you ever want maximum quality here.
const MODEL = 'claude-haiku-4-5';

const SYSTEM = `You translate grocery shopping-list items into the Dutch search term a shopper would type at a Dutch supermarket (Albert Heijn, Jumbo, Dirk).

Rules:
- Return the common, concise Dutch product noun (e.g. "organic free-range eggs" -> "eieren", "tomatoes" -> "tomaten").
- If an item is already Dutch, return it unchanged.
- Strip brand names, quantities, and adjectives that aren't needed to find the product.
- Return exactly one translation per input item, in the same order.`;

// Structured output: a string array aligned by index with the input items.
const SCHEMA = {
  type: 'object',
  properties: {
    translations: { type: 'array', items: { type: 'string' } },
  },
  required: ['translations'],
  additionalProperties: false,
} as const;

let client: Anthropic | null = null;
function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic({ maxRetries: 1 });
  return client;
}

export async function translateToDutch(items: string[]): Promise<string[]> {
  if (items.length === 0) return [];
  const fallback = items.map(toDutch); // static EN->NL map, always available

  const anthropic = getClient();
  if (!anthropic) return fallback;

  try {
    const res = await anthropic.messages.create(
      {
        model: MODEL,
        max_tokens: 1024,
        system: SYSTEM,
        output_config: { format: { type: 'json_schema', schema: SCHEMA } },
        messages: [{ role: 'user', content: JSON.stringify({ items }) }],
      },
      { timeout: 15000 },
    );

    const block = res.content.find((b) => b.type === 'text');
    if (!block || block.type !== 'text') return fallback;
    const parsed = JSON.parse(block.text) as { translations?: unknown };
    const out = parsed.translations;
    if (!Array.isArray(out) || out.length !== items.length) return fallback;

    // Use each translation when valid; otherwise keep the static fallback for that slot.
    return out.map((v, i) => (typeof v === 'string' && v.trim() ? v.trim() : fallback[i]));
  } catch (err) {
    console.error('[grocery] Claude translation failed, using static fallback:', err);
    return fallback;
  }
}
