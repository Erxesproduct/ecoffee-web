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

## 1.2 Payment (QPay and bank transfer)

On Zochil the payment rule is «100 хувь төлбөрөө төлж захиалгаа баталгаажуулна» with a Khan Bank account; `has_qpay`
is on, but the QPay2 and StorePay methods are `disabled` (open question 1). The website offers:

- **QPay** through erxes: `generateInvoiceUrl` (public) creates the invoice after the order is saved in erxes; the
  customer pays on the erxes payment page and returns to `/order/<reference>`, where `invoicesCheck` is asked every 5 s.
- **Bank transfer** (the shop's own rule): the order page shows Хаан банк 5011130146 (Ж.Оюунжаргал) and the order code
  `EC-…` to write in the transfer, with copy buttons. Staff confirm it by hand.
- No order is sent to QPay unless it was first recorded in erxes (no money asked for an order staff cannot see).

Steps:

1. Get Ecoffee's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`); ask QPay / Zochil whether
   the current merchant can be used outside Zochil.
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. Bank transfer: staff check the Khan Bank statement for the `EC-…` code and move the card to «Баталгаажсан».
5. **Not yet tested**: nothing has been run against a real QPay merchant. Do not call payments working until step 2
   and section 1.5 pass with authorized credentials.

## 1.3 eBarimt

The website never makes a receipt. The checkout asks «Хувь хүн» or «Байгууллага» (7-digit registry number, checked on
the server) and writes it on the order. The receipt is issued in erxes by staff (or the POS) after payment.

1. Collect from Ecoffee: «Ай Жи Ти Си» ХХК TIN (Zochil has none), district code, VAT status, product
   classification codes (coffee, tea, kitchenware, training service).
2. Register for **PosAPI 3.0** (ebarimt.mn) and install the PosAPI service.
3. **Settings → eBarimt**: PosAPI URL, TIN, district code, VAT switches; assign it to the website pipeline.
4. For every paid order: issue the receipt once (check the card first) and send the lottery number by SMS / email.

## 1.4 Delivery zones, fees and order statuses

Website (done), from Zochil shop 2168:

| Option | Fee | Rule |
| --- | --- | --- |
| Улаанбаатар (Zochil «Үндсэн хүргэлт», id 454) | 8,000₮, free when goods are above 200,000₮ | district, khoroo, address |
| Орон нутаг | not offered online | Zochil has the countryside switch on but no countryside option; the site asks to call (open question 2) |
| Pre-order cups | same fee | «14–30 хоногт ирнэ», from the product text (open question 6) |

- The delivery rule is word for word from the shop: «Хүргэлтийн хөлс 8,000 төгрөг. 200,000 төгрөгөөс дээш хүргэлт
  үнэгүй.» No cut-off time, day off or zone limits are given, so none are shown.
- Fees and rules live in `src/content/business.ts`; change them there and in the erxes delivery product.

erxes:

1. Import `docs/erxes/ecoffee-delivery.csv` (`EC-DELIVERY-454` Улаанбаатар 8,000₮).
2. **Sales → Boards → «Онлайн захиалга» → pipeline «Вэбсайт»**, stages (as on the website order page):
   Хүлээгдэж байна → Баталгаажсан → Бэлтгэж байна → Хүргэлтэд гарсан → Хүргэгдсэн, plus Цуцлагдсан.
3. **Frontline → Forms → (order form) → Settings**: create a sales card in «Хүлээгдэж байна» for every submission.
   Staff move it to «Баталгаажсан» when the QPay invoice shows paid or the transfer arrives.

## 1.5 Test order from cart to receipt

**Verified on a local production build:** `npm run test:order -- http://127.0.0.1:3072` passes **29 checks** (empty
cart, unknown product, more than the stock, quantity limit, the browser's price ignored, 8,000₮ fee, free above
200,000₮, countryside refused, district / khoroo / address, QPay and transfer accepted, unknown payment refused, phone,
email, company registry, same checkout key → same reference, honeypot, payment check 400 / 503). The checkout was also
driven in a browser: field errors, the transfer button label, and without erxes the `503 not_configured` answer, after
which the checkout shows the phone number and keeps the cart. `--send` was **not run** (env vars not set). No payment
was made.

Steps for the real test (authorized credentials only):

1. **Frontline → Forms → Create** «Вэбсайт захиалга» with fields Нэр, Утас, Имэйл, Захиалга; copy the form id and the
   field ids into `ERXES_ORDER_FORM_ID` / `ERXES_ORDER_FIELD_IDS`. Set `ERXES_API_URL`, `ERXES_PAYMENT_IDS`. Redeploy.
2. `npm run test:order -- https://<production url> --send`: one order, two items + delivery.
3. Pay the invoice only with QPay's test merchant or with explicit authorization for a real charge; check that
   `/order/<reference>` shows «Төлбөр төлөгдлөө», move the card, issue the eBarimt, mark delivered, void the test.

## Permissions (erxes)

- Staff who handle orders: Sales (cards), Forms (submissions), Payments (view invoices), eBarimt (issue).
- Only the owner: Settings → Payments, Settings → eBarimt, product import.
- The website uses only public erxes mutations; it needs no admin token.

---

## Open questions for Ecoffee

1. **Payment**: Zochil's rule is a Khan Bank transfer; QPay2 and StorePay are `disabled`, yet the banners show StorePay
   and Pocket. Which QPay merchant should erxes use? Keep bank transfer (the site offers both)? Add StorePay / Pocket?
2. **Countryside**: the Zochil countryside switch is on, but there is no countryside option. Fee, courier, bus?
3. **Second store address**: Zochil says «Ecoffee mall, ЧД 4-р хороо 18-р байр», a banner says «Хүннү Молл 2 давхар
   Home&More». Which is current? (The site shows the Zochil address.)
4. **Free delivery threshold**: the site uses goods total **above** 200,000₮ (exactly 200,000₮ pays 8,000₮). Confirm.
5. **Training courses**: they go through the cart like products and the delivery fee is added. Should courses skip
   delivery? Where are the schedules and seat limits?
6. **Pre-order cups** (14–30 days): pay in full up front? Same delivery fee?
7. **Look of same-name products**: 22 products share a name; the site tells them apart by the colour seen in the photo.
   Please confirm the colour names.
8. **Opening hours** of both stores are not given anywhere.
9. **TIN / PosAPI** for eBarimt; the Zochil shop has no registry number.
10. **Domain**: point ecoffee.mn at the new site when ready.
11. **About text** mentions «Letit» and «Sweet Coffee Italia», which are not sold on the shop; keep or remove?
