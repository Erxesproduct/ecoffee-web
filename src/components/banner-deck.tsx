"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type B = { src: string; w: number; h: number; title: string };

/** The shop's own banners, cross-fading every 6 s (paused on hover, never for reduced motion). */
export function BannerDeck({ banners }: { banners: B[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (banners.length < 2 || hold || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % banners.length), 6000);
    return () => window.clearInterval(id);
  }, [banners.length, hold]);
  if (!banners.length) return null;
  const b = banners[0];
  return (
    <div className="relative" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div className="relative overflow-hidden rounded-[22px] bg-white shadow-[0_0_0_6px_#fff,0_0_0_7px_var(--color-line),0_40px_60px_-36px_rgb(42_26_18/0.7)]" style={{ aspectRatio: `${b.w} / ${b.h}` }}>
        {banners.map((x, n) => (
          <Image key={x.src} src={x.src} alt={n === i ? x.title || "Ecoffee" : ""} fill priority={n === 0} sizes="(min-width: 1024px) 640px, 100vw" className={`object-cover transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
      {banners.length > 1 && (
        <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Баннер">
          {banners.map((x, n) => (
            <button key={x.src} type="button" onClick={() => setI(n)} aria-pressed={n === i} aria-label={`Баннер ${n + 1}`} className={`h-2.5 rounded-full transition-all ${n === i ? "w-8 bg-verde" : "w-2.5 bg-line hover:bg-crema"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
