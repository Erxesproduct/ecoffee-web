# Ecoffee: erxes manual steps

Owner of every step below: **Terbish**, with Ecoffee («Ай Жи Ти Си» ХХК) for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → ecoffee-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for Ecoffee yet ("erxes 3.0: NOT SET"). Create the workspace first.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 177 products, 13 groups, 7 brands, MNT prices, 328 photos, imported from Zochil | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin; bank transfer shown with the order code | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Ulaanbaatar 8,000₮, free above 200,000₮; status list | delivery product, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (29 checks, `npm run test:order`) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: ecoffee.mn (Zochil shop 2168), read 2026-11-19: **177 products**, MNT prices 3,000₮–1,500,000₮, 328 photos
(trimmed, pre-sized WebP on the website), 2 banners, logo, about text, 6 journal posts, FAQ.

- Groups (from the product names, because the Zochil categories were mixed): Үрлэн кофе 13, Нунтаг кофе 8, Под кофе 4,
  Цай, матча 6, Мока пот 27, Кофе машин, хандлагч 7, Аяга, халбага 31, Сироп 8, Бариста хэрэгсэл 29, Кофе шопт 22,
  Сэлбэг 13, Аялал, гадаа 6, Бариста сургалт 3.
- Brands (from the names): Bialetti 63, 1883 Maison Routin 14, Caffè Borbone 8, Lavazza 6, LELIT 3, Didiesse 3,
  Il Caffè Italiano 2.
- Specs are read only from the shop's own text: cups and ml (moka pots), grams, roast, arabica share, induction
  («индукцаас бусад» = no), material, watts, days for pre-order. Nothing is invented: a product without a written
  value shows none. 59 products have no text on Zochil; 17 have English text only (shown as is).
- 22 products have the same name as another one; they are told apart by the colour in their photo («look»,
  open question 7).
- Sale: 11 products have a «price before sale». Stock: 23 products track stock on Zochil, none at 0; the rest are
  sold as available.
- Moka pot finder (`/moka`): size in cups (1 cup ≈ 45 ml, from the shop FAQ) and stove type, plus matching spare parts.
- Old Zochil URLs (`/products/<category>/<id>`, category pages, `/about`, journal posts, …) redirect to the new pages.

Files (made by `npm run export:erxes` from `src/data/catalog.json`):

- `docs/erxes/ecoffee-categories.csv`: `EC` → `EC-BEANS` … `EC-ACADEMY`, `EC-DELIVERY`.
- `docs/erxes/ecoffee-products.csv`: 177 rows, code `EC-<zochilId>`, name, category, type (the 3 courses are
  `service`), unit price, price before sale, look, brand, specs, Zochil stock, photo path.

Steps:

1. **Products & services → Categories**: import `ecoffee-categories.csv` (parents first; already ordered).
2. **Settings → Import & Export → Import → Products**: upload `ecoffee-products.csv`. Map `code → Code`,
   `name → Name`, `category code → Category code`, `unit price → Unit price`, `type → Type`. Keep the codes: website
   orders name every line with its `EC-…` code.
3. **Inventories → Remainders**: enter real stock.
4. Photos: upload from `public/images/p/` (path in the CSV) if erxes should show them too.
