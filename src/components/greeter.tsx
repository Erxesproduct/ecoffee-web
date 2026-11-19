"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { business } from "@/content/business";
import { CloseIcon, PhoneIcon } from "./icons";

/**
 * The moustached man from the Ecoffee banner, in the corner: says hello once per visit and opens the shop's
 * frequently asked questions. Every answer is the shop's own text (Zochil FAQ, payment/delivery rules, stores).
 */
const QUESTIONS: { q: string; a: React.ReactNode }[] = [
  ...business.faq.map((f) => ({ q: f.q, a: f.a })),
  { q: "Хүргэлт хэд вэ?", a: `${business.rules.delivery} ${business.rules.countryside}` },
  { q: "Яаж төлөх вэ?", a: `${business.rules.payment} ${business.payments.map((p) => `${p.name}: ${p.note}`).join(" ")}` },
  { q: "Урьдчилсан захиалгын бараа хэзээ ирэх вэ?", a: business.rules.preorder },
  { q: "И-баримт авах уу?", a: business.rules.ebarimt },
  {
    q: "Дэлгүүр хаана байдаг вэ?",
    a: (
      <span className="grid gap-2">
        {business.stores.map((s) => (
          <span key={s.name}>
            <b>{s.name}</b>: {s.place}, {s.line}.{" "}
            <a href={`tel:${s.phone.tel}`} className="font-bold text-verde underline">
              {s.phone.display}
            </a>
          </span>
        ))}
      </span>
    ),
  },
];

const SEEN = "ecoffee.greeted";

export function Greeter() {
  const [open, setOpen] = useState(false);
  const [hello, setHello] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  // say hello once per visit, a moment after the page opens
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    if (seen) return;
    const show = setTimeout(() => setHello(true), 1200);
    const hide = setTimeout(() => setHello(false), 11000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="pointer-events-none fixed right-3 bottom-[72px] z-40 flex flex-col items-end md:right-6 md:bottom-6">
      {open && (
        <div
          ref={panel}
          role="dialog"
          aria-label="Түгээмэл асуулт"
          tabIndex={-1}
          className="pop-in pointer-events-auto mb-3 flex max-h-[min(560px,calc(100dvh-190px))] w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-[22px] bg-foam shadow-[0_18px_50px_-12px_rgb(42_26_18/0.45)] ring-1 ring-line outline-none"
        >
          <div className="tricolor h-1.5 shrink-0" aria-hidden />
          <div className="flex shrink-0 items-start gap-3 bg-verde px-5 pt-4 pb-4 text-white">
            <div className="min-w-0 flex-1">
              <p className="script text-[26px] leading-none">Сайн уу!</p>
              <p className="mt-1 text-[15px] text-white/90">Ecoffee-д тавтай морил. Түгээмэл асуултууд:</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Хаах">
              <CloseIcon size={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
            {QUESTIONS.map((x, i) => (
              <details key={x.q} className="group border-b border-line last:border-0" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-start gap-2 rounded-[10px] px-2 py-3 font-bold leading-snug hover:text-verde [&::-webkit-details-marker]:hidden">
                  <span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-crema text-[13px] leading-none text-white transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                  {x.q}
                </summary>
                <div className="px-2 pb-4 pl-9 text-[14.5px] leading-relaxed text-ink-2">{x.a}</div>
              </details>
            ))}
          </div>
          <div className="flex shrink-0 gap-2 border-t border-line bg-latte p-3">
            <a href={`tel:${business.phone.tel}`} className="btn btn-verde !min-h-11 flex-1 !px-3 !text-[14.5px]">
              <PhoneIcon size={17} /> {business.phone.display}
            </a>
            <Link href="/info" onClick={() => setOpen(false)} className="btn btn-cream !min-h-11 !px-4 !text-[14.5px]">
              Мэдээлэл
            </Link>
          </div>
        </div>
      )}

      {hello && !open && (
        <button
          type="button"
          onClick={() => {
            setHello(false);
            setOpen(true);
          }}
          className="pop-in pointer-events-auto relative mr-10 mb-2 max-w-[230px] rounded-[18px] rounded-br-[4px] bg-white px-4 py-3 text-left shadow-[0_10px_30px_-10px_rgb(42_26_18/0.4)] ring-1 ring-line"
        >
          <span className="script block text-[22px] leading-none text-rosso">Сайн уу!</span>
          <span className="mt-1 block text-[14.5px] leading-snug">Тавтай морил! Асуух зүйл байвал над дээр дараарай.</span>
        </button>
      )}

      <button
        ref={btn}
        type="button"
        onClick={() => {
          setHello(false);
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        aria-label={open ? "Түгээмэл асуултыг хаах" : "Сайн уу! Түгээмэл асуулт"}
        className="greeter pointer-events-auto relative block h-[104px] w-[57px] transition hover:-translate-y-1 md:h-[136px] md:w-[75px]"
      >
        <Image src="/images/mascot.webp" alt="" width={197} height={360} className={`greeter-man h-full w-full object-contain drop-shadow-[0_6px_10px_rgb(42_26_18/0.35)] ${hello ? "greeter-wave" : ""}`} />
        <span className="absolute bottom-2 -left-3 grid h-7 w-7 place-items-center rounded-full bg-verde text-[15px] font-bold text-white ring-2 ring-white" aria-hidden>
          ?
        </span>
        <span className="sr-only">Түгээмэл асуулт</span>
      </button>
    </div>
  );
}
