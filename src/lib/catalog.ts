import "server-only";

import data from "@/data/catalog.json";

export type Variant = {
  /** Zochil product id. erxes product code EC-<id>. */
  id: string;
  label: string | null;
  price: number;
  compareAt: number | null;
  /** Zochil stock; null = not counted (orderable). */
  stock: number | null;
};
export type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };
export type Roast = "light" | "medium" | "dark" | "decaf";
/** Only what the product name or the shop's own text says (see build script); missing = not stated. */
export type Specs = {
  cups?: number;
  ml?: number;
  yieldMl?: number;
  oz?: number;
  grams?: number;
  pieces?: number;
  pairs?: boolean;
  roast?: Roast;
  arabica?: boolean;
  induction?: boolean;
  material?: string;
  watts?: number;
  espressoMl?: number;
  lungoMl?: number;
  days?: number;
  preorderDays?: { min: number; max: number };
};
export type Product = {
  id: number;
  slug: string;
  title: string;
  /** beans | ground | pods | tea | moka | brewers | cups | syrups | barista | cafe | parts | travel | academy */
  group: string;
  brand: string | null;
  /** colour or look, for products that share a name on Zochil (read from the photo) */
  shade: string | null;
  /** the shop's own text in Mongolian, line by line */
  lines: string[];
  /** the brand's own English copy, kept as written */
  linesEn: string[];
  specs: Specs;
  variants: Variant[];
  orders: number;
  featured: boolean;
  /** place on the shop's own bestseller list, -1 when not on it */
  best: number;
  createdAt: string;
  images: Photo[];
};
export type Group = { id: string; name: string; line: string; count: number };
export type Brand = { id: string; name: string; line: string; count: number };
export type Post = { id: number; slug: string; title: string; lines: string[]; image: { src: string; w: number; h: number } | null; date: string };

export const products = data.products as Product[];
export const groups = data.groups as Group[];
export const brands = data.brands as Brand[];
export const journal = data.journal as Post[];
export const banners = data.banners as { src: string; w: number; h: number; title: string }[];
export const catalogInfo = { source: data.source, shopId: data.shopId, updatedAt: data.updatedAt };

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { product: p, variant: v }] as const)));
export const getProduct = (slug: string) => bySlug.get(slug);
export const getVariant = (id: string) => byVariant.get(id);
export const getPost = (slug: string) => journal.find((j) => j.slug === slug);
export const groupName = (id: string) => groups.find((g) => g.id === id)?.name ?? "";
export const brandName = (id: string | null) => (id ? (brands.find((b) => b.id === id)?.name ?? "") : "");
/** Title with its look («Ган аяга 240мл · улаан»). */
export const fullName = (p: Pick<Product, "title" | "shade">) => (p.shade ? `${p.title} · ${p.shade}` : p.title);
export const sku = (id: string) => `EC-${id}`;

export const ROAST: Record<Roast, { name: string; level: number }> = {
  light: { name: "Цайвар хууралт", level: 1 },
  medium: { name: "Дунд хууралт", level: 2 },
  dark: { name: "Бараан хууралт", level: 3 },
  decaf: { name: "Кофейнгүй", level: 0 },
};

/** Spec rows for the product page, in a fixed order; every value comes from the product's own name or text. */
export function specRows(p: Product): { k: string; v: string }[] {
  const s = p.specs;
  const rows: { k: string; v: string }[] = [];
  if (p.brand) rows.push({ k: "Брэнд", v: brandName(p.brand) });
  if (s.cups) rows.push({ k: p.group === "parts" ? "Тохирох хэмжээ" : "Хэмжээ", v: `${s.cups} аяга${p.group === "moka" ? " эспрессо" : ""}` });
  if (s.yieldMl) rows.push({ k: "Нэг удаад", v: `${s.yieldMl} мл кофе` });
  if (s.espressoMl) rows.push({ k: "Эспрессо / лунго", v: `${s.espressoMl} мл / ${s.lungoMl} мл` });
  if (s.ml) rows.push({ k: "Багтаамж", v: s.ml >= 1000 ? `${s.ml / 1000} л` : `${s.ml} мл` });
  if (s.oz) rows.push({ k: "Аяганы хэмжээ", v: `${s.oz} oz` });
  if (s.grams) rows.push({ k: "Жин", v: s.grams >= 1000 ? `${s.grams / 1000} кг` : `${s.grams} гр` });
  if (s.roast) rows.push({ k: "Хууралт", v: ROAST[s.roast].name });
  if (s.arabica) rows.push({ k: "Үр", v: "100% Арабика" });
  if (s.pieces) rows.push({ k: "Тоо", v: `${s.pieces} ${s.pairs ? "хос" : "ширхэг"}` });
  if (s.material) rows.push({ k: "Материал", v: s.material });
  if (s.induction === true) rows.push({ k: "Индукц", v: "Индукц плитка дээр ажиллана" });
  if (s.induction === false) rows.push({ k: "Индукц", v: "Индукцээс бусад плитка, газ дээр" });
  if (s.watts) rows.push({ k: "Чадал", v: `${s.watts} W` });
  if (s.days) rows.push({ k: "Үргэлжлэх хугацаа", v: `${s.days} өдөр` });
  if (s.preorderDays) rows.push({ k: "Хүргэлт", v: `Урьдчилсан захиалга: ${s.preorderDays.min}–${s.preorderDays.max} хоногт` });
  rows.push({ k: "Код", v: sku(p.variants[0].id) });
  return rows;
}

export const soldOut = (v: Pick<Variant, "stock">) => v.stock === 0;
export const available = (p: Product) => p.variants.some((v) => !soldOut(v));
export const fromPrice = (p: Product) => p.variants[0].price;
export const onSale = (p: Product) => p.variants.some((v) => v.compareAt);
export const isCourse = (p: Product) => p.group === "academy";
export const isPreorder = (p: Product) => !!p.specs.preorderDays;

/** In stock first, then the shop's bestseller order, then most ordered on Zochil. */
const rank = (p: Product) => (p.best < 0 ? 999 : p.best);
export const byPopularity = (a: Product, b: Product) => Number(available(b)) - Number(available(a)) || rank(a) - rank(b) || b.orders - a.orders || Number(b.featured) - Number(a.featured);
export const popular = [...products].sort(byPopularity);
export const mokaPots = products.filter((p) => p.group === "moka" && p.specs.cups);
export const coffees = products.filter((p) => ["beans", "ground", "pods"].includes(p.group));
export const courses = products.filter(isCourse).sort((a, b) => fromPrice(a) - fromPrice(b));
