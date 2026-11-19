/**
 * End-to-end check of the website order flow (cart → /api/orders → erxes form + erxes QPay invoice → /api/payments/check).
 *
 *   node scripts/test-order.mjs [baseUrl] [--send]
 *
 * Without --send it only runs the validation cases: nothing reaches erxes while erxes is not configured, and with
 * erxes configured the validation cases are rejected before anything is sent.
 * With --send it also places ONE test order, marked «ТЕСТ ЗАХИАЛГА: устгана уу», and checks its invoice status once.
 * Creating an invoice never charges anyone: QPay only charges when someone scans the QR and pays.
 * Exit code 1 if any check fails.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const send = args.includes("--send");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "src", "data", "catalog.json"), "utf8"));
const V = catalog.products.flatMap((p) => p.variants.map((v) => ({ ...v, slug: p.slug })));
// Zochil rules (ecoffee.mn, shop 2168): option «Үндсэн хүргэлт», Ulaanbaatar 8,000₮, free when the goods are
// above 200,000₮; QPay (through erxes) or bank transfer; no countryside option online.
const city = catalog.shop.delivery[0];
const FEE = city.price;
const FREE = city.freeFrom;

const ok = V.filter((v) => v.stock !== 0);
const cheap = [...ok].sort((a, b) => a.price - b.price)[0];
// the base order stays at or under the free-delivery line, so it pays the fee
const mid = ok.find((v) => v.id !== cheap.id && v.price >= 5000 && v.price + cheap.price <= FREE);
const big = ok.find((v) => v.price * 10 > FREE && (v.stock == null || v.stock >= Math.floor(FREE / v.price) + 1));
const soldout = V.find((v) => v.stock === 0);
const few = ok.find((v) => v.stock != null && v.stock < 10);
const item = (v, qty) => ({ id: v.id, qty });

const order = {
  name: "Тест Захиалагч",
  phone: "99112233",
  delivery: "city",
  area: "Баянзүрх",
  khoroo: 17,
  address: "Тест хаяг, 1-р байр, 2-р орц, 34 тоот",
  payment: "qpay",
  receiptType: "person",
  note: "ТЕСТ ЗАХИАЛГА: устгана уу",
  items: [item(mid, 1), item(cheap, 1)],
};
const SUBTOTAL = mid.price + cheap.price;

async function post(url, body) {
  const res = await fetch(`${base}${url}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const valid = (r) => !r.json?.errors && (r.status === 200 || r.status === 503);
const rejects = (field) => (r) => r.status === 422 && !!r.json?.errors?.[field];
const total = (expected, fee) => (r) => valid(r) && r.json?.total === expected && (fee === undefined || r.json?.deliveryFee === fee);
const key = (n) => `test-${n}-${Date.now().toString(36)}-abcdef`;
const bigQty = big ? Math.min(10, Math.floor(FREE / big.price) + 1) : 0;
// exactly on the line still pays the fee («200,000 төгрөгөөс дээш»)
const exact = ok.find((v) => FREE % v.price === 0 && FREE / v.price <= 10 && (v.stock == null || v.stock >= FREE / v.price));

const cases = [
  ["empty cart is rejected", { ...order, items: [] }, rejects("items")],
  ["unknown product is ignored (then empty)", { ...order, items: [{ id: "1", qty: 1 }] }, rejects("items")],
  ["numeric id (old format) is ignored", { ...order, items: [{ id: Number(cheap.id) || 1, qty: 1 }] }, rejects("items")],
  ...(soldout ? [[`sold-out product is not orderable (EC-${soldout.id})`, { ...order, items: [item(soldout, 1)] }, rejects("items")]] : []),
  ...(few ? [[`more than the stock (${few.stock}) is not orderable (EC-${few.id})`, { ...order, items: [item(few, few.stock + 1)] }, rejects("items")]] : []),
  [`one ${cheap.price}₮ item + ${FEE}₮ delivery`, { ...order, items: [item(cheap, 1)] }, total(cheap.price + FEE, FEE)],
  [`city ${SUBTOTAL}₮ + ${FEE}₮ delivery`, order, total(SUBTOTAL + FEE, FEE)],
  ...(exact ? [[`exactly ${FREE}₮ still pays ${FEE}₮ (EC-${exact.id} × ${FREE / exact.price})`, { ...order, items: [item(exact, FREE / exact.price)] }, total(FREE + FEE, FEE)]] : []),
  ...(big ? [[`above ${FREE}₮ delivery is free (EC-${big.id} × ${bigQty})`, { ...order, items: [item(big, bigQty)] }, total(big.price * bigQty, 0)]] : []),
  ["countryside is not offered online", { ...order, delivery: "countryside", area: "Төв" }, (r) => r.status === 422],
  ["district is required", { ...order, area: "" }, rejects("area")],
  ["an aimag is not a district", { ...order, area: "Орхон" }, rejects("area")],
  ["khoroo must be 1–45", { ...order, khoroo: 99 }, rejects("khoroo")],
  ["address is required", { ...order, address: "" }, rejects("address")],
  ["unknown delivery is rejected", { ...order, delivery: "pickup" }, (r) => r.status === 422],
  ["QPay is accepted", order, valid],
  ["bank transfer is accepted (no QPay invoice)", { ...order, payment: "transfer" }, (r) => valid(r) && (r.status === 503 || r.json?.payment === null)],
  ["unknown payment is rejected", { ...order, payment: "cash" }, rejects("payment")],
  ["company eBarimt needs a 7-digit registry number", { ...order, receiptType: "company", regNo: "12" }, rejects("regNo")],
  ["company eBarimt with a valid registry number passes", { ...order, receiptType: "company", regNo: "1234567" }, valid],
  ["bad phone is rejected", { ...order, phone: "123" }, rejects("phone")],
  ["+976 phone prefix is accepted", { ...order, phone: "+976 9911 2233" }, valid],
  ["bad email is rejected", { ...order, email: "not-an-email" }, rejects("email")],
  ["quantity over 10 is ignored", { ...order, items: [item(cheap, 11)] }, rejects("items")],
  ["the browser's price is ignored", { ...order, items: order.items.map((i) => ({ ...i, price: 1 })) }, total(SUBTOTAL + FEE)],
  ["the same checkout key gives the same reference", { ...order, key: "same-key-0123456789abcdef" }, (r) => valid(r) && /^EC-\d{6}-[0-9A-F]{6}$/.test(r.json?.reference ?? "")],
  ["honeypot is silently accepted", { ...order, website: "spam" }, (r) => r.status === 200 && r.json?.ok === true && r.json?.payment === null],
];

let failed = 0;
console.log(`Order API checks against ${base}\n`);
for (const [label, body, check] of cases) {
  const r = await post("/api/orders", { key: key(cases.findIndex((c) => c[0] === label)), ...body });
  const pass = check(r);
  if (!pass) failed++;
  if (label.startsWith("the same checkout key")) {
    const again = await post("/api/orders", { ...body });
    const same = again.json?.reference === r.json?.reference;
    if (!same) failed++;
    console.log(`${same ? "✓" : "✗"} retry with that key returns ${again.json?.reference}`);
  }
  console.log(`${pass ? "✓" : "✗"} ${label}  (${r.status}${r.json?.errors ? " " + Object.keys(r.json.errors).join(",") : ""}${r.json?.total != null ? " total " + r.json.total : ""})`);
}

const bad = await post("/api/payments/check", { invoiceId: "../../etc" });
const badOk = bad.status === 400;
if (!badOk) failed++;
console.log(`${badOk ? "✓" : "✗"} payment check rejects a malformed invoice id (${bad.status})`);
const probe = await post("/api/payments/check", { invoiceId: "notAnInvoice123" });
const probeOk = probe.status === 503 ? probe.json?.error === "not_configured" : probe.status === 200 || probe.status === 502;
if (!probeOk) failed++;
console.log(`${probeOk ? "✓" : "✗"} payment check answers honestly (${probe.status} ${probe.json?.error ?? probe.json?.status})`);

if (send) {
  const r = await post("/api/orders", { key: key("send"), ...order });
  if (r.status === 200 && r.json?.ok) {
    console.log(`\n✓ test order recorded in erxes: ${r.json.reference}, total ${r.json.total}₮ (expected ${SUBTOTAL + FEE})`);
    if (r.json.total !== SUBTOTAL + FEE) {
      failed++;
      console.log("✗ unexpected total");
    }
    if (r.json.payment) {
      console.log(`✓ QPay invoice created in erxes: ${r.json.payment.invoiceId} (not paid; nobody is charged)`);
      const c = await post("/api/payments/check", { invoiceId: r.json.payment.invoiceId });
      console.log(`${c.status === 200 ? "✓" : "✗"} invoice status: ${c.json?.status ?? c.json?.error}`);
      if (c.status !== 200) failed++;
    } else console.log(`– no invoice: ${r.json.paymentError ?? "ERXES_PAYMENT_IDS not set"}`);
  } else if (r.status === 503 && r.json?.error === "not_configured") {
    console.log(`\n– test order NOT sent: erxes env vars are not set on ${base} (reference ${r.json.reference}). See .env.example.`);
  } else {
    failed++;
    console.log(`\n✗ test order failed: ${r.status} ${JSON.stringify(r.json)}`);
  }
}

console.log(failed ? `\n${failed} check(s) failed` : `\nall ${cases.length + 3} checks passed`);
process.exit(failed ? 1 : 0);
