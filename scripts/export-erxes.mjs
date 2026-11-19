// node scripts/export-erxes.mjs → docs/erxes/ecoffee-{categories,products,delivery}.csv
// Files for erxes Products & Services import (Settings → Import). Every row comes from src/data/catalog.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const c = JSON.parse(readFileSync(path.join(root, "src/data/catalog.json"), "utf8"));
const out = path.join(root, "docs/erxes");
mkdirSync(out, { recursive: true });

const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (rows) => "﻿" + rows.map((r) => r.map(cell).join(",")).join("\n") + "\n";
const code = (id) => `EC-${id.toUpperCase()}`;

// categories: EC → the 13 groups (coffee, moka pots, cups, syrups, barista, …) → delivery
const cats = [["code", "name", "parent code"], ["EC", "Ecoffee", ""]];
for (const g of c.groups) cats.push([code(g.id), g.name, "EC"]);
cats.push(["EC-DELIVERY", "Хүргэлт", "EC"]);
writeFileSync(path.join(out, "ecoffee-categories.csv"), csv(cats));

const rows = [["code", "name", "category code", "type", "unit price", "price before sale", "look", "brand", "specs", "stock (Zochil)", "zochil product id", "image (website path)"]];
for (const p of c.products)
  for (const v of p.variants)
    rows.push([
      `EC-${v.id}`,
      [p.title, p.shade].filter(Boolean).join(" · ").slice(0, 200),
      code(p.group),
      p.group === "academy" ? "service" : "product",
      v.price,
      v.compareAt ?? "",
      p.shade ?? "",
      p.brand ?? "",
      Object.entries(p.specs ?? {}).map(([k, x]) => `${k}=${typeof x === "object" ? `${x.min}-${x.max}` : x}`).join("; "),
      v.stock ?? "",
      p.id,
      p.images[0]?.src ?? "",
    ]);
writeFileSync(path.join(out, "ecoffee-products.csv"), csv(rows));

const d = c.shop.delivery;
writeFileSync(
  path.join(out, "ecoffee-delivery.csv"),
  csv([
    ["code", "name", "category code", "type", "unit price", "free above (goods total)", "source"],
    ...d.map((x) => [`EC-DELIVERY-${x.id}`, `Хүргэлт: ${x.title}`, "EC-DELIVERY", "service", x.price, x.freeFrom ?? "", `Zochil delivery option ${x.id} «${x.note}»`]),
  ]),
);
console.log(`categories ${cats.length - 1}, products ${rows.length - 1}, delivery ${d.length}`);
