"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cart, maxQty } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { hearts, useHearts } from "@/lib/wishlist";
import { BeanBurst } from "./card-actions";
import { CheckIcon, HeartIcon, MinusIcon, PlusIcon } from "./icons";

type V = { id: string; label: string | null; price: number; compareAt: number | null; stock: number | null };

export function BuyBox({ slug, variants, phone, cta = "Сагсанд нэмэх" }: { slug: string; variants: V[]; phone: string; cta?: string }) {
  const router = useRouter();
  const v = variants[0];
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(0);
  const [likes, setLikes] = useState(0);
  const liked = useHearts().includes(slug);
  const out = v.stock === 0;
  const cap = Math.max(1, maxQty(v.id) || Math.min(10, v.stock ?? 10));
  const few = v.stock != null && v.stock > 0 && v.stock <= 5;
  const off = v.compareAt ? Math.round((1 - v.price / v.compareAt) * 100) : 0;

  const add = () => {
    cart.add(v.id, qty);
    setAdded((n) => n + 1);
  };

  return (
    <div className="card relative p-5 md:p-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={`display text-[40px] leading-none ${v.compareAt ? "text-rosso" : "text-ink"}`}>{formatPrice(v.price)}</span>
        {v.compareAt && <s className="text-[18px] text-ink-3">{formatPrice(v.compareAt)}</s>}
        {off > 0 && <span className="rounded-[8px] bg-rosso px-2.5 py-1 text-[14px] font-extrabold text-white">-{off}%</span>}
        {few && <span className="rounded-[8px] bg-crema-3 px-3 py-1 text-[14px] font-bold text-[#8a5420]">Сүүлийн {v.stock} ширхэг</span>}
      </div>

      {out ? (
        <p className="mt-5 rounded-[14px] bg-latte px-4 py-3 font-bold">Одоогоор дууссан. Ирэх хугацааг {phone} дугаараас лавлаарай.</p>
      ) : (
        <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-3">
          <div className="flex h-14 items-center rounded-[14px] bg-latte px-1">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-10 place-items-center rounded-[10px] hover:bg-white" aria-label="Цөөлөх">
              <MinusIcon size={18} />
            </button>
            <span className="display w-8 text-center text-[21px]" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty((q) => Math.min(cap, q + 1))} disabled={qty >= cap} className="grid h-11 w-10 place-items-center rounded-[10px] hover:bg-white disabled:opacity-30" aria-label="Нэмэх">
              <PlusIcon size={18} />
            </button>
          </div>
          <button type="button" onClick={add} className={`btn relative h-14 !px-4 text-[16.5px] ${added ? "btn-espresso" : "btn-verde"}`}>
            <span key={added} className={`flex items-center gap-2 ${added ? "pop-in" : ""}`}>
              {added ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
              {added ? "Нэмэгдлээ" : cta}
            </span>
            <BeanBurst n={added} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!liked) setLikes((n) => n + 1);
              hearts.toggle(slug);
            }}
            aria-pressed={liked}
            aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
            className={`relative grid h-14 w-14 place-items-center justify-self-center rounded-[14px] bg-white shadow-[0_0_0_1.5px_var(--color-line)_inset] transition hover:scale-105 ${liked ? "text-rosso" : ""}`}
          >
            <HeartIcon size={22} filled={liked} />
            <BeanBurst n={likes} />
          </button>
          <button
            type="button"
            onClick={() => {
              add();
              router.push("/cart");
            }}
            className="btn btn-rosso h-14 !px-4"
          >
            Шууд захиалах →
          </button>
        </div>
      )}
    </div>
  );
}
