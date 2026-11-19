"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";
import { CupsRow, MokaArt } from "./deco";

export type Pot = { slug: string; title: string; shade: string | null; brand: string; cups: number; induction: boolean | null; material: string | null; price: number; compareAt: number | null; thumb: string | null; variantId: string | null };
export type Part = { slug: string; title: string; cups: number; price: number; thumb: string | null; variantId: string | null };

/** FAQ: «1 аяга нь ойролцоогоор 45мл». */
const CUP_ML = 45;

/** Pick a moka pot by size (espresso cups) and stove; every fact comes from the pot's own name/text or the shop FAQ. */
export function MokaFinder({ pots, parts, sizes, inductionNote }: { pots: Pot[]; parts: Part[]; sizes: number[]; inductionNote: string | null }) {
  const [cups, setCups] = useState<number | null>(null);
  const [stove, setStove] = useState<"any" | "induction">("any");

  const fit = pots.filter((p) => (stove === "any" || p.induction === true) && (cups == null || p.cups === cups)).sort((a, b) => a.price - b.price);
  const near = cups == null ? [] : pots.filter((p) => (stove === "any" || p.induction === true) && p.cups !== cups && Math.abs(p.cups - cups) <= 1).sort((a, b) => Math.abs(a.cups - cups) - Math.abs(b.cups - cups) || a.price - b.price);
  const spares = cups == null ? [] : parts.filter((p) => p.cups === cups);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-10">
      <div className="space-y-6 lg:sticky lg:top-36 lg:self-start">
        <fieldset className="card p-5">
          <legend className="sr-only">Хэмжээ</legend>
          <p className="display text-[22px]">1. Хэдэн аяга эспрессо?</p>
          <p className="mt-1 text-[14.5px] text-ink-2">1 аяга ≈ {CUP_ML} мл. Сүүтэй кофе, американо хийхэд эспрессо дээрээ сүү, халуун ус нэмнэ.</p>
          <div className="mt-4 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Аяганы тоо">
            <button type="button" role="radio" aria-checked={cups == null} onClick={() => setCups(null)} className="chip justify-center">
              Бүгд
            </button>
            {sizes.map((n) => (
              <button key={n} type="button" role="radio" aria-checked={cups === n} onClick={() => setCups(n)} className="chip flex-col justify-center !gap-0 py-1.5 leading-tight">
                <span>{n} аяга</span>
                <span className="text-[12px] font-normal opacity-75">≈{n * CUP_ML} мл</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="card p-5">
          <legend className="sr-only">Плитка</legend>
          <p className="display text-[22px]">2. Юун дээр чанах вэ?</p>
          <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Плитка">
            <button type="button" role="radio" aria-checked={stove === "any"} onClick={() => setStove("any")} className="chip justify-start">
              Газ, энгийн цахилгаан плитка
            </button>
            <button type="button" role="radio" aria-checked={stove === "induction"} onClick={() => setStove("induction")} className="chip justify-start">
              Индукц плитка
            </button>
          </div>
          {stove === "induction" && inductionNote && <p className="pop-in mt-4 rounded-[12px] bg-verde-3 p-3 text-[14.5px] text-ink-2">{inductionNote}</p>}
        </fieldset>
      </div>

      <div aria-live="polite">
        <p className="font-bold text-ink-2">
          {fit.length} мока пот{cups ? `, ${cups} аяганы` : ""}
          {stove === "induction" ? ", индукцэд" : ""}
        </p>
        {fit.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
            {fit.map((p) => (
              <PotCard key={p.slug} p={p} />
            ))}
          </ul>
        ) : (
          <div className="card mt-4 flex items-center gap-5 p-6">
            <MokaArt width={70} className="shrink-0" />
            <p className="text-ink-2">
              Энэ хэмжээгээр {stove === "induction" ? "индукцэд ажилладаг гэж бичигдсэн " : ""}мока пот одоогоор алга. Доорх ойролцоо хэмжээг үзэх эсвэл утсаар лавлаарай.
            </p>
          </div>
        )}
        {near.length > 0 && (
          <>
            <p className="display mt-10 text-[22px]">Ойролцоо хэмжээ</p>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
              {near.slice(0, 6).map((p) => (
                <PotCard key={p.slug} p={p} />
              ))}
            </ul>
          </>
        )}
        {spares.length > 0 && (
          <>
            <p className="display mt-10 text-[22px]">{cups} аяганы сэлбэг</p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {spares.map((s) => (
                <li key={s.slug} className="card relative flex items-center gap-3 p-3">
                  <Link href={`/p/${s.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-white ring-1 ring-line">
                    {s.thumb && <Image src={s.thumb} alt="" fill sizes="64px" className="object-contain" />}
                  </Link>
                  <Link href={`/p/${s.slug}`} className="min-w-0 flex-1 leading-snug font-bold hover:text-verde">
                    {s.title}
                    <span className="block font-normal text-ink-2">{formatPrice(s.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

function PotCard({ p }: { p: Pot }) {
  return (
    <li className="card lift relative flex flex-col overflow-hidden">
      <Link href={`/p/${p.slug}`} className="relative m-2 mb-0 block aspect-square overflow-hidden rounded-[14px] bg-white" tabIndex={-1} aria-hidden>
        {p.thumb && <Image src={p.thumb} alt="" fill sizes="(min-width: 1280px) 260px, (min-width: 640px) 40vw, 90vw" className="object-contain" />}
        {p.induction === true && <span className="absolute bottom-2 left-2 rounded-[8px] bg-verde px-2.5 py-1 text-[12.5px] font-bold text-white">Индукц</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow !text-[11px] text-crema">{p.brand}</span>
        <Link href={`/p/${p.slug}`} className="leading-snug font-bold hover:text-verde">
          {p.title}
          {p.shade && <span className="font-normal text-ink-2"> · {p.shade}</span>}
        </Link>
        <span className="mt-1.5 flex items-center gap-2 text-[13.5px] text-ink-2">
          <CupsRow n={p.cups} size={12} className="text-verde" /> {p.cups} аяга{p.material ? ` · ${p.material}` : ""}
        </span>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span>
            <span className={`display block text-[21px] leading-none ${p.compareAt ? "text-rosso" : ""}`}>{formatPrice(p.price)}</span>
            {p.compareAt && <s className="text-[13.5px] text-ink-3">{formatPrice(p.compareAt)}</s>}
          </span>
          <CardActions slug={p.slug} variantId={p.variantId} />
        </div>
      </div>
    </li>
  );
}
