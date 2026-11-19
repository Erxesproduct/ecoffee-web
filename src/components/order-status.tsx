"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { localOrders, useLocalOrders } from "@/lib/local-orders";
import { CupArt, Steam } from "./deco";
import { CheckIcon, ClockIcon, CloseIcon, PhoneIcon } from "./icons";

const LABEL: Record<string, { title: string; text: string; tone: "ok" | "wait" | "bad" }> = {
  paid: { title: "Төлбөр төлөгдлөө", text: "Захиалга баталгаажлаа. Хүргэлтийн өмнө бид тантай утсаар холбогдоно.", tone: "ok" },
  pending: { title: "Төлбөр хүлээгдэж байна", text: "QPay-ээр төлсний дараа энэ хуудас өөрөө шинэчлэгдэнэ.", tone: "wait" },
  failed: { title: "Төлбөр амжилтгүй", text: "Төлбөр хийгдсэнгүй. Дахин оролдох эсвэл бидэнтэй холбогдоно уу.", tone: "bad" },
  cancelled: { title: "Нэхэмжлэл цуцлагдсан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  rejected: { title: "Төлбөр татгалзсан", text: "Банк төлбөрийг татгалзсан. Бидэнтэй холбогдоно уу.", tone: "bad" },
  expired: { title: "Нэхэмжлэлийн хугацаа дууссан", text: "Шинэ нэхэмжлэл авахаар бидэнтэй холбогдоно уу.", tone: "bad" },
  refunded: { title: "Төлбөр буцаагдсан", text: "Төлбөрийг буцаан шилжүүлсэн.", tone: "bad" },
};
const TERMINAL = ["paid", "failed", "cancelled", "rejected", "expired", "refunded"];
const TONE = { ok: "bg-verde-3", wait: "bg-crema-3", bad: "bg-rosso-3" };

export function OrderStatus({ reference }: { reference: string }) {
  const orders = useLocalOrders();
  const order = orders.find((o) => o.reference === reference) ?? null;
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const tries = useRef(0);

  const check = useCallback(async () => {
    const o = localOrders.get(reference);
    if (!o?.invoiceId) return;
    setChecking(true);
    try {
      const res = await fetch("/api/payments/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoiceId: o.invoiceId }) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) {
        localOrders.setStatus(reference, json.status);
        setCheckError(null);
      } else setCheckError(json?.error === "not_configured" ? "Төлбөрийн систем холбогдоогүй байна." : "Төлбөр шалгахад алдаа гарлаа.");
    } catch {
      setCheckError("Интернэт холболтоо шалгана уу.");
    } finally {
      setChecking(false);
    }
  }, [reference]);

  // check on arrival (also when coming back from the QPay page), then every 5 s while pending and visible, for 10 min
  const status = order?.status ?? null;
  useEffect(() => {
    if (!order?.invoiceId || (status && TERMINAL.includes(status))) return;
    const first = window.setTimeout(check, 300);
    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (++tries.current > 120) return window.clearInterval(id);
      check();
    }, 5000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [order?.invoiceId, status, check]);

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopied(text);
        window.setTimeout(() => setCopied(null), 1600);
      },
      () => {},
    );
  };

  if (!order)
    return (
      <div className="card mx-auto max-w-xl p-8 text-center md:p-12">
        <p className="display text-[30px]">{reference}</p>
        <p className="mt-3 text-ink-2">Энэ захиалга энэ төхөөрөмж дээр хадгалагдаагүй байна. Захиалгынхаа явцыг утсаар лавлана уу.</p>
        <a href={`tel:${business.phone.tel}`} className="btn btn-verde mt-8">
          <PhoneIcon size={16} /> {business.phone.display}
        </a>
      </div>
    );

  const transfer = order.method === "transfer";
  const s = status ? (LABEL[status] ?? LABEL.pending) : null;
  const paid = status === "paid";
  const row = (k: string, v: string) => (
    <div className="flex items-center justify-between gap-3 border-b border-dashed border-line py-2.5 last:border-0">
      <dt className="text-[14.5px] text-ink-2">{k}</dt>
      <dd className="flex min-w-0 items-center gap-2">
        <b className="truncate">{v}</b>
        <button type="button" onClick={() => copy(v)} className="shrink-0 rounded-[8px] bg-white px-2 py-1 text-[12px] font-bold ring-1 ring-line hover:ring-verde">
          {copied === v ? "Хуулсан" : "Хуулах"}
        </button>
      </dd>
    </div>
  );

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="card pop-in overflow-hidden">
        <div className="board relative overflow-hidden !rounded-none p-8 md:p-10">
          <span className="absolute -top-2 right-4 hidden sm:block">
            <CupArt width={130} />
          </span>
          <p className="script chalk text-[28px] leading-none text-crema-2">Grazie!</p>
          <h1 className="chalk relative mt-2 text-[38px] leading-tight md:text-[50px]">Баярлалаа</h1>
          <p className="relative mt-2 text-[#e4d5c2]">
            Захиалгын код: <b className="display text-[22px] text-white">{order.reference}</b>
          </p>
        </div>
        <div className="p-6 md:p-10">
          {transfer ? (
            <div className="rounded-[16px] bg-crema-3 p-5" role="status">
              <b className="display block text-[21px]">Дансаар шилжүүлнэ үү</b>
              <dl className="mt-3">
                {row("Банк", business.bank.bank)}
                {row("Данс", business.bank.account)}
                {row("Хүлээн авагч", business.bank.holder)}
                {row("Дүн", String(order.total))}
                {row("Гүйлгээний утга", order.reference)}
              </dl>
              <p className="mt-3 text-[14.5px] font-bold">{business.rules.payment}</p>
              <p className="mt-1 text-[14px] text-ink-2">Төлбөр орсныг ажилтан шалгаад утсаар баталгаажуулна.</p>
            </div>
          ) : s ? (
            <div className={`flex gap-4 rounded-[16px] p-4 ${TONE[s.tone]}`} role="status" aria-live="polite">
              <span className="mt-0.5">{s.tone === "ok" ? <CheckIcon size={20} /> : s.tone === "bad" ? <CloseIcon size={20} /> : <ClockIcon size={20} />}</span>
              <span>
                <span className="block font-bold">{s.title}</span>
                <span className="block text-[14.5px] text-ink-2">{s.text}</span>
              </span>
            </div>
          ) : (
            <div className="rounded-[16px] bg-crema-3 p-4 text-[14.5px]" role="status">
              <b className="block">Төлбөрийн нэхэмжлэл үүсээгүй</b>
              Захиалга бүртгэгдсэн. QPay нэхэмжлэлийг бид таны утас руу илгээнэ, эсвэл {business.phone.display} дугаарт залгана уу.
            </div>
          )}
          {!transfer && order.payUrl && !paid && status && !TERMINAL.includes(status) && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={order.payUrl} className="btn btn-rosso">
                QPay-ээр төлөх
              </a>
              <button type="button" onClick={check} disabled={checking} className="btn btn-cream">
                {checking ? "Шалгаж байна…" : "Төлбөр шалгах"}
              </button>
            </div>
          )}
          {checkError && <p className="mt-3 text-[14px] font-bold text-rosso">{checkError}</p>}

          <ul className="mt-8 space-y-2.5 text-[15px]">
            {order.lines.map((l) => (
              <li key={`${l.name}|${l.label}`} className="flex justify-between gap-4">
                <span className="text-ink-2">
                  {l.name}
                  {l.label ? ` (${l.label})` : ""} × {l.qty}
                </span>
                <span className="shrink-0 tabular-nums">{formatPrice(l.total)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4">
              <span className="text-ink-2">Хүргэлт</span>
              <span className="tabular-nums">{order.deliveryFee === 0 ? "Үнэгүй" : formatPrice(order.deliveryFee)}</span>
            </li>
            <li className="display flex justify-between gap-4 border-t border-line pt-4 text-[25px]">
              <span>Нийт</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </li>
          </ul>
          <p className="mt-6 text-[14px] text-ink-2">{business.rules.ebarimt}</p>
        </div>
      </div>
      <aside className="card self-start p-6 md:p-8">
        <p className="script flex items-end gap-2 text-[26px] leading-none text-crema">
          захиалгын явц <Steam width={26} color="#c98a4b" />
        </p>
        <ol className="mt-6 space-y-5">
          {ORDER_STATUSES.filter((x) => x.id !== "cancelled").map((x, i) => {
            const reached = i === 0 || (paid && i === 1);
            return (
              <li key={x.id} className="flex gap-4">
                <span className={`display mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[15px] ${reached ? "bg-verde text-white" : "bg-latte text-ink-3"}`}>{reached ? <CheckIcon size={16} /> : i + 1}</span>
                <span>
                  <span className={`block text-[16px] ${reached ? "font-bold" : "text-ink-2"}`}>{x.name}</span>
                  <span className="block text-[13.5px] text-ink-3">{x.note}</span>
                </span>
              </li>
            );
          })}
        </ol>
        <p className="mt-8 text-[14px] text-ink-2">Төлбөрөөс хойших шатуудыг (бэлтгэх, хүргэлтэд гарах) бид утсаар мэдэгдэнэ.</p>
        <Link href="/shop" className="btn btn-cream mt-6">
          Дэлгүүр хэсэх →
        </Link>
      </aside>
    </div>
  );
}
