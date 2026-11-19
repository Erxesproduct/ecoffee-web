import type { Metadata } from "next";
import Link from "next/link";
import { Beans, MokaArt, Steam } from "@/components/deco";
import { MokaFinder, type Part, type Pot } from "@/components/moka-finder";
import { business } from "@/content/business";
import { available, brandName, mokaPots, products } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Мока пот сонгогч",
  description: "Bialetti мока потоо аяганы тоо, плиткаараа сонгоорой: 1-ээс 9 аяга, индукц, сэлбэг.",
  alternates: { canonical: "/moka" },
};

export default function MokaPage() {
  const pots: Pot[] = mokaPots.map((p) => ({
    slug: p.slug,
    title: p.title,
    shade: p.shade,
    brand: brandName(p.brand) || "Мока пот",
    cups: p.specs.cups!,
    induction: p.specs.induction ?? null,
    material: p.specs.material ?? null,
    price: p.variants[0].price,
    compareAt: p.variants[0].compareAt,
    thumb: p.images[0]?.thumb.src ?? null,
    variantId: available(p) ? p.variants[0].id : null,
  }));
  const parts: Part[] = products
    .filter((p) => p.group === "parts" && p.specs.cups && available(p))
    .map((p) => ({ slug: p.slug, title: p.title, cups: p.specs.cups!, price: p.variants[0].price, thumb: p.images[0]?.thumb.src ?? null, variantId: p.variants[0].id }));
  const sizes = [...new Set(pots.map((p) => p.cups))].sort((a, b) => a - b);
  const faq = business.faq;
  const inductionNote = faq.find((f) => /индукц/i.test(f.q))?.a ?? null;

  return (
    <>
      <section className="paper relative overflow-hidden">
        <Beans color="#c9a27c" count={5} />
        <div className="wrap relative grid items-center gap-6 pt-12 pb-10 md:grid-cols-[1fr_auto] md:pt-16">
          <div>
            <nav className="text-[14px] font-bold text-ink-2" aria-label="Зам">
              <Link href="/" className="hover:text-verde">
                Нүүр
              </Link>{" "}
              / Мока пот сонгогч
            </nav>
            <p className="script mt-3 text-[26px] leading-none text-crema">Bialetti · 1933 оноос</p>
            <h1 className="mt-1 text-[38px] leading-tight md:text-[56px]">Мока пот сонгогч</h1>
            <p className="mt-3 max-w-xl text-[17px] text-ink-2">{faq.find((f) => /юу вэ/i.test(f.q))?.a.split(". ")[0]}. Хэдэн аяга, юун дээр чанахаа сонгоход тохирохыг нь харуулна.</p>
          </div>
          <div className="relative mx-auto hidden md:block">
            <Steam width={70} color="#c98a4b" className="absolute -top-14 left-8" />
            <MokaArt width={170} fill="#d7dade" className="swing" />
          </div>
        </div>
      </section>
      <div className="wrap mt-10">
        <MokaFinder pots={pots} parts={parts} sizes={sizes} inductionNote={inductionNote} />
      </div>
      <section className="wrap mt-16 grid gap-4 md:grid-cols-3">
        {faq.map((f) => (
          <div key={f.q} className="card p-6">
            <h2 className="text-[20px] leading-snug">{f.q}</h2>
            <p className="mt-2 text-[15.5px] text-ink-2">{f.a}</p>
          </div>
        ))}
      </section>
    </>
  );
}
