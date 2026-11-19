"use client";

import Link from "next/link";
import { useState } from "react";
import { cart } from "@/lib/cart";
import { hearts, useHearts } from "@/lib/wishlist";
import { Bean } from "./deco";
import { CheckIcon, HeartIcon, PlusIcon } from "./icons";

/** Three coffee beans hop up when something is liked or added. */
export function BeanBurst({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span key={n} className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden>
      {[
        [-18, -120, "#6b4024"],
        [0, 80, "#a8693c"],
        [18, 160, "#2f1a10"],
      ].map(([x, r, c], i) => (
        <span key={i} className="bean-up absolute top-0 left-0" style={{ ["--x" as string]: `${x}px`, ["--r" as string]: `${r}deg`, animationDelay: `${i * 70}ms` }}>
          <Bean size={11} color={c as string} />
        </span>
      ))}
    </span>
  );
}

/** Heart (top right of the card) and a «+» that adds straight to the cart. */
export function CardActions({ slug, variantId, choose = false }: { slug: string; variantId: string | null; choose?: boolean }) {
  const liked = useHearts().includes(slug);
  const [done, setDone] = useState(0);
  const [likes, setLikes] = useState(0);
  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!liked) setLikes((n) => n + 1);
          hearts.toggle(slug);
        }}
        aria-pressed={liked}
        aria-label={liked ? "Хадгалснаас хасах" : "Хадгалах"}
        className={`absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-[0_6px_16px_-8px_rgb(42_26_18/0.6)] ring-1 ring-line transition hover:scale-110 ${liked ? "text-rosso" : "text-ink-2"}`}
      >
        <HeartIcon size={19} filled={liked} />
        <BeanBurst n={likes} />
      </button>
      {variantId ? (
        <button
          type="button"
          onClick={() => {
            cart.add(variantId);
            setDone((n) => n + 1);
          }}
          aria-label="Сагсанд нэмэх"
          className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-[12px] text-white transition hover:scale-105 ${done ? "bg-ink" : "btn-verde"}`}
        >
          <span key={done} className={done ? "pop-in" : ""}>
            {done ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
          </span>
          <BeanBurst n={done} />
        </button>
      ) : choose ? (
        <Link href={`/p/${slug}`} className="btn btn-verde !min-h-11 shrink-0 !px-4 !text-[14px]">
          Дэлгэрэнгүй
        </Link>
      ) : null}
    </>
  );
}
