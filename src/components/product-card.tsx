import Image from "next/image";
import Link from "next/link";
import { available, brandName, isCourse, isPreorder, ROAST, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { CardActions } from "./card-actions";
import { CupsRow, RoastMeter } from "./deco";

/** One short fact under the photo, from the product's own specs. */
export function SpecHint({ p }: { p: Product }) {
  const s = p.specs;
  if (p.group === "moka" && s.cups)
    return (
      <span className="flex items-center gap-1.5 text-verde">
        <CupsRow n={s.cups} size={12} /> <span className="text-ink-2">{s.cups} аяга</span>
      </span>
    );
  if (s.roast)
    return (
      <span className="flex items-center gap-1.5">
        <RoastMeter level={ROAST[s.roast].level} size={9} /> <span className="text-ink-2">{ROAST[s.roast].name}</span>
      </span>
    );
  const bits = [s.grams && (s.grams >= 1000 ? `${s.grams / 1000} кг` : `${s.grams} гр`), s.ml && (s.ml >= 1000 ? `${s.ml / 1000} л` : `${s.ml} мл`), s.pieces && `${s.pieces} ${s.pairs ? "хос" : "ш"}`, s.days && `${s.days} өдөр`].filter(Boolean);
  if (!bits.length) return null;
  return <span className="text-ink-2">{bits.join(" · ")}</span>;
}

export function ProductCard({ p, priority = false }: { p: Product; priority?: boolean }) {
  const v = p.variants[0];
  const img = p.images[0];
  const second = p.images[1];
  const ok = available(p);
  const off = v.compareAt ? Math.round((1 - v.price / v.compareAt) * 100) : 0;
  return (
    <article className="group card lift relative flex h-full flex-col overflow-hidden">
      <Link href={`/p/${p.slug}`} className="relative m-2 mb-0 block aspect-square overflow-hidden rounded-[16px] bg-white" tabIndex={-1} aria-hidden>
        {img && <Image src={img.thumb.src} alt="" fill priority={priority} sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className={`object-contain transition duration-700 group-hover:scale-[1.05] ${ok ? "" : "opacity-60 grayscale"} ${second ? "group-hover:opacity-0" : ""}`} />}
        {second && ok && <Image src={second.thumb.src} alt="" fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw" className="scale-[1.05] object-contain opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100" />}
        {off > 0 && ok && (
          <span className="stamp absolute top-2 left-2 h-14 w-14 rotate-[-12deg] bg-rosso text-[15px] font-extrabold text-white">
            -{off}%
          </span>
        )}
        {isPreorder(p) && <span className="absolute bottom-2 left-2 rounded-[8px] bg-ink px-2.5 py-1 text-[12.5px] font-bold text-foam">Урьдчилсан захиалга</span>}
        {isCourse(p) && <span className="absolute bottom-2 left-2 rounded-[8px] bg-rosso px-2.5 py-1 text-[12.5px] font-bold text-white">Сургалт</span>}
        {!ok && <span className="absolute right-2 bottom-2 rounded-[8px] bg-ink px-3 py-1 text-[12.5px] font-bold text-white">Дууссан</span>}
      </Link>
      <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
        {p.brand && <span className="eyebrow !text-[11px] text-crema">{brandName(p.brand)}</span>}
        <Link href={`/p/${p.slug}`} className="line-clamp-2 text-[16.5px] leading-snug font-bold transition hover:text-verde">
          {p.title}
        </Link>
        {p.shade && <span className="text-[14px] text-ink-2">{p.shade}</span>}
        <span className="mt-1 text-[13.5px]">
          <SpecHint p={p} />
        </span>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span>
            <span className={`display block text-[21px] leading-none ${v.compareAt ? "text-rosso" : "text-ink"}`}>{formatPrice(v.price)}</span>
            {v.compareAt && <s className="text-[13.5px] text-ink-3">{formatPrice(v.compareAt)}</s>}
          </span>
          <CardActions slug={p.slug} variantId={ok ? v.id : null} />
        </div>
      </div>
    </article>
  );
}
