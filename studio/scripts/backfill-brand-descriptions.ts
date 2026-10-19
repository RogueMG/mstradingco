/**
 * One-off backfill: copies brand descriptions from sanity/seed.ndjson onto
 * brand documents that don't have one yet. Never overwrites an existing value.
 *
 *   cd studio
 *   npx sanity exec scripts/backfill-brand-descriptions.ts --with-user-token
 */
import { readFileSync } from "node:fs";

import { getCliClient } from "sanity/cli";

interface SeedBrand {
  _id: string;
  _type: string;
  description?: string;
}

const client = getCliClient({ apiVersion: "2026-10-18" });

const seed = readFileSync(new URL("../../sanity/seed.ndjson", import.meta.url), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line) as SeedBrand)
  .filter((doc) => doc._type === "brand" && doc.description);

const existing = new Set<string>(
  await client.fetch(`*[_type == "brand" && _id in $ids]._id`, {
    ids: seed.map((doc) => doc._id),
  }),
);

const transaction = client.transaction();

for (const brand of seed) {
  if (existing.has(brand._id)) {
    transaction.patch(brand._id, (patch) =>
      patch.setIfMissing({ description: brand.description }),
    );
  }
}

const result = await transaction.commit();

console.log(`Checked ${existing.size} brands; ${result.results.length} patched where missing.`);
