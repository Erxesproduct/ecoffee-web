"use client";

import Image from "next/image";
import { useState } from "react";

type Photo = { src: string; w: number; h: number; thumb: { src: string; w: number; h: number } };

/** Product photos on a white «saucer»: a big one with a soft cross-fade and square thumbnails under it. */
export function Gallery({ photos, alt, dim = false }: { photos: Photo[]; alt: string; dim?: boolean }) {
  const [i, setI] = useState(0);
  const p = photos[i];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[26px] bg-white shadow-[0_0_0_1px_var(--color-line),0_30px_50px_-34px_rgb(42_26_18/0.6)]">
        {p && <Image key={p.src} src={p.src} alt={`${alt}${photos.length > 1 ? ` (${i + 1}/${photos.length})` : ""}`} fill priority={i === 0} sizes="(min-width: 768px) 50vw, 100vw" className={`fade-in object-contain ${dim ? "opacity-60 grayscale" : ""}`} />}      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2.5" role="group" aria-label="Зургууд">
          {photos.map((x, n) => (
            <button
              key={x.src}
              type="button"
              onClick={() => setI(n)}
              aria-pressed={n === i}
              aria-label={`Зураг ${n + 1}`}
              className={`relative h-16 w-16 overflow-hidden rounded-[14px] bg-white transition duration-300 md:h-[74px] md:w-[74px] ${n === i ? "shadow-[0_0_0_2.5px_var(--color-verde)]" : "opacity-75 shadow-[0_0_0_1px_var(--color-line)] hover:opacity-100"}`}
            >
              <Image src={x.thumb.src} alt="" fill sizes="74px" className="object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
