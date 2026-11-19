import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Bean, CupsRow, MokaArt, RoastMeter, Steam } from "@/components/deco";
import { Gallery } from "@/components/gallery";
import { BankIcon, CapIcon, ClockIcon, QrIcon, TruckIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, brandName, byPopularity, fullName, getProduct, groups, isCourse, isPreorder, products, ROAST, sku, specRows } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site-url";

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const name = fullName(p);
  const desc = [brandName(p.brand), formatPrice(p.variants[0].price), p.lines[0] ?? p.linesEn[0]].filter(Boolean).join(" · ").slice(0, 160);
  return { title: name, description: desc, alternates: { canonical: `/p/${p.slug}` }, openGraph: { images: p.images[0] ? [{ url: p.images[0].src }] : undefined } };
}

/** FAQ: «1 аяга нь ойролцоогоор 45мл». */
const CUP_ML = 45;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const name = fullName(p);
  const group = groups.find((g) => g.id === p.group);
  const city = business.delivery[0];
  const v = p.variants[0];
  const s = p.specs;
  const course = isCourse(p);
  const rows = specRows(p);
  const inductionFaq = business.faq.find((f) => /индукц/i.test(f.q));

  // what goes with it: parts of the same size for a moka pot, coffee for a brewer, then the same group, then what sells
  const fits = (x: (typeof products)[number]) =>
    (p.group === "moka" && x.group === "parts" && x.specs.cups === s.cups ? 6 : 0) +
    (p.group === "moka" && x.group === "ground" ? 3 : 0) +
    (["beans", "ground", "pods"].includes(p.group) && x.group === "moka" ? 2 : 0) +
    (x.group === p.group ? 3 : 0) +
    (x.brand && x.brand === p.brand ? 1 : 0);
  const related = products
    .filter((x) => x.slug !== p.slug && available(x))
    .map((x) => ({ x, score: fits(x) }))
    .sort((a, b) => b.score - a.score || byPopularity(a.x, b.x))
    .slice(0, 10)
    .map(({ x }) => x);

  const ld = {
    "@context": "https://schema.org",
    "@type": course ? "Course" : "Product",
    name,
    ...(course
      ? { provider: { "@type": "Organization", name: business.name } }
      : { sku: sku(v.id), brand: p.brand ? { "@type": "Brand", name: brandName(p.brand) } : undefined, image: p.images.map((m) => absoluteUrl(m.src)) }),
    description: [...p.lines, ...p.linesEn].join(" ") || undefined,
    offers: { "@type": "Offer", priceCurrency: "MNT", price: v.price, availability: available(p) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: absoluteUrl(`/p/${p.slug}`) },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="wrap pt-8 md:pt-12">
        <nav className="flex flex-wrap gap-x-1.5 text-[14px] font-bold text-ink-2" aria-label="Зам">
          <Link href="/shop" className="hover:text-verde">
            Дэлгүүр
          </Link>
          {group && (
            <>
              /
              <Link href={`/shop?g=${group.id}`} className="hover:text-verde">
                {group.name}
              </Link>
            </>
          )}
          {p.brand && (
            <>
              /
              <Link href={`/shop?b=${p.brand}`} className="hover:text-verde">
                {brandName(p.brand)}
              </Link>
            </>
          )}
        </nav>

        <div className="mt-5 grid gap-8 md:grid-cols-2 lg:gap-14">
          <div className="md:sticky md:top-36 md:self-start">
            <Gallery photos={p.images} alt={name} dim={!available(p)} />
          </div>

          <div>
            <p className="script text-[26px] leading-none text-crema">{p.brand ? brandName(p.brand) : group?.name}</p>
            <h1 className="mt-2 text-[32px] leading-tight md:text-[42px]">{p.title}</h1>
            {p.shade && <p className="mt-1 text-[18px] font-bold text-ink-2">{p.shade}</p>}

            {p.group === "moka" && s.cups && (
              <div className="card mt-5 flex items-center gap-5 p-5">
                <MokaArt width={74} fill="#d7dade" className="shrink-0" />
                <div>
                  <p className="display text-[22px] leading-tight">{s.cups} аяга эспрессо</p>
                  <CupsRow n={s.cups} size={20} className="mt-1.5 text-verde" />
                  <p className="mt-1.5 text-[14.5px] text-ink-2">{s.yieldMl ? `Нэг удаад ${s.yieldMl} мл кофе гаргана.` : `Ойролцоогоор ${s.cups * CUP_ML} мл (1 аяга ≈ ${CUP_ML} мл).`}</p>
                </div>
              </div>
            )}
            {s.roast && (
              <div className="card mt-5 flex items-center gap-5 p-5">
                <RoastMeter level={ROAST[s.roast].level} size={26} className="shrink-0" />
                <div>
                  <p className="display text-[22px] leading-tight">{ROAST[s.roast].name}</p>
                  <p className="text-[14.5px] text-ink-2">{[s.arabica && "100% Арабика", s.grams && (s.grams >= 1000 ? `${s.grams / 1000} кг` : `${s.grams} гр`), p.group === "beans" ? "үрлэн" : p.group === "ground" ? "нунтагласан" : p.group === "pods" ? "цаасан под" : null].filter(Boolean).join(" · ")}</p>
                </div>
              </div>
            )}

            <div className="mt-5">
              <BuyBox slug={p.slug} variants={p.variants} phone={business.phone.display} cta={course ? "Бүртгүүлэх" : "Сагсанд нэмэх"} />
            </div>

            <ul className="mt-4 grid gap-2 text-[15px]">
              {isPreorder(p) && (
                <li className="flex items-start gap-3 rounded-[14px] bg-ink px-4 py-3 text-foam">
                  <ClockIcon size={20} className="mt-0.5 shrink-0 text-crema-2" />
                  <span>{business.rules.preorder}</span>
                </li>
              )}
              {course ? (
                <li className="flex items-start gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_0_0_1px_var(--color-line)]">
                  <CapIcon size={20} className="mt-0.5 shrink-0 text-rosso" />
                  <span>
                    Сургалтын өдөр, цагийг{" "}
                    <a href={`tel:${business.phone.tel}`} className="font-bold text-verde underline">
                      {business.phone.display}
                    </a>{" "}
                    дугаараас лавлана уу.{" "}
                    <Link href="/academy" className="font-bold text-verde underline">
                      Бүх шат →
                    </Link>
                  </span>
                </li>
              ) : (
                <li className="flex items-start gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_0_0_1px_var(--color-line)]">
                  <TruckIcon size={20} className="mt-0.5 shrink-0 text-verde" />
                  <span>
                    Улаанбаатарт хүргэнэ: {formatPrice(city.fee)}, <b>{formatPrice(city.freeFrom)}-өөс дээш үнэгүй</b>.
                  </span>
                </li>
              )}
              <li className="flex items-start gap-3 rounded-[14px] bg-white px-4 py-3 shadow-[0_0_0_1px_var(--color-line)]">
                <QrIcon size={20} className="mt-0.5 shrink-0 text-rosso" />
                <span className="flex flex-wrap items-center gap-x-1.5">
                  QPay эсвэл <BankIcon size={16} className="text-ink-2" /> дансаар, 100% урьдчилан төлнө. И-баримт олгоно.
                </span>
              </li>
            </ul>

            <section className="board mt-8 p-6 md:p-7" aria-labelledby="specs">
              <h2 id="specs" className="script chalk flex items-end gap-2 text-[28px]">
                Үзүүлэлт <Steam width={30} color="#c98a4b" className="-mb-0.5" />
              </h2>
              <dl className="mt-4 space-y-2 text-[15.5px]">
                {rows.map((r) => (
                  <div key={r.k} className="flex items-baseline">
                    <dt className="shrink-0 text-[#cdb9a3]">{r.k}</dt>
                    <span className="leader" aria-hidden />
                    <dd className="text-right font-bold">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {p.lines.length > 0 && (
              <section className="mt-8">
                <h2 className="text-[24px]">{course ? "Сургалтын агуулга" : "Тайлбар"}</h2>
                <ul className="mt-3 grid gap-2 text-[16px] text-ink-2">
                  {p.lines.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Bean size={10} color="#a8693c" className="mt-[7px] shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {p.linesEn.length > 0 && (
              <details className="card mt-6 p-5" open={p.lines.length === 0}>
                <summary className="cursor-pointer font-bold">Брэндийн тайлбар (англиар)</summary>
                <div className="prose-ec mt-3 text-[15px] text-ink-2" lang="en">
                  {p.linesEn.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
              </details>
            )}
            {p.group === "moka" && s.induction !== true && inductionFaq && (
              <div className="mt-6 rounded-[16px] bg-verde-3 p-5 text-[15px]">
                <b className="block text-verde">{inductionFaq.q}</b>
                <p className="mt-1 text-ink-2">{inductionFaq.a}</p>
                <Link href="/moka" className="mt-2 inline-block font-bold text-verde underline">
                  Мока пот сонгогч →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wrap mt-20">
          <p className="script text-[26px] leading-none text-crema">{p.group === "moka" ? "тохирох сэлбэг, кофе" : "хамт авдаг"}</p>
          <h2 className="mt-1 text-[30px] leading-tight md:text-[38px]">Үүнтэй хамт</h2>
          <Scroller label="Үүнтэй хамт" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
            {related.map((x) => (
              <div key={x.slug} className="w-[220px] shrink-0 snap-start md:w-[250px]">
                <ProductCard p={x} />
              </div>
            ))}
          </Scroller>
        </section>
      )}
    </>
  );
}
