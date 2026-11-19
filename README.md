# Ecoffee web store

Next.js 16 storefront that replaces the Zochil shop at ecoffee.mn (Italian coffee, Bialetti moka pots, barista tools
and training since 2015). «Caffè Tricolore» design from the brand's own green, red and cream: a scalloped café awning,
a chalkboard menu, drifting beans, rising steam and a latte-art cup (all still for reduced motion). 177 products from
the Zochil shop with specs read from the shop's own text, a moka pot finder by cup size and stove, the barista academy,
the journal, checkout with QPay (through erxes) or bank transfer, Ulaanbaatar delivery and eBarimt details.

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (add --send for one real test order in erxes)
npm run export:erxes   # docs/erxes/ecoffee-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (server) and `src/data/lite.json` (cart, hearts), built from Zochil shop 2168.
  Photos in `public/images/p/`, journal photos in `public/images/j/`.
- Business rules (8,000₮ delivery, free above 200,000₮, QPay or Khan Bank transfer, stores, statuses):
  `src/content/business.ts`.
- Orders: `POST /api/orders` validates against catalog prices and stock, records the order in erxes (form → Sales
  card), then creates the QPay invoice in erxes (bank transfer: no invoice, the order page shows the account). Env
  vars: `.env.example`.
- erxes admin work (payments, eBarimt, pipeline, import) and open questions: `docs/erxes/MANUAL-STEPS.md`.
