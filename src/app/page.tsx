import Image from "next/image";
import Link from "next/link";
import { BannerDeck } from "@/components/banner-deck";
import { Bean, Beans, CupArt, CupsRow, MokaArt, RoastMeter, Steam } from "@/components/deco";
import { ArrowIcon, CapIcon, MokaIcon, PhoneIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { Scroller } from "@/components/scroller";
import { business } from "@/content/business";
import { available, banners, brands, coffees, courses, fromPrice, groups, journal, mokaPots, onSale, popular, products, ROAST, type Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

function Shelf({ items, label }: { items: Product[]; label: string }) {
  return (
    <Scroller label={label} className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
      {items.map((p) => (
        <div key={p.slug} className="w-[220px] shrink-0 snap-start md:w-[250px]">
          <ProductCard p={p} />
        </div>
      ))}
    </Scroller>
  );
}

function Heading({ script, title, href, more }: { script: string; title: string; href?: string; more?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="script text-[26px] leading-none text-crema">{script}</p>
        <h2 className="mt-1 text-[32px] leading-tight md:text-[42px]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="btn btn-cream !min-h-11 !text-[15px]">
          {more ?? "Бүгдийг үзэх"} <ArrowIcon size={16} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const best = popular.filter(available).slice(0, 12);
  const pots = [...mokaPots].filter(available).sort((a, b) => a.best - b.best || b.orders - a.orders).slice(0, 10);
  const sale = products.filter((p) => onSale(p) && available(p));
  const sizes = [...new Set(mokaPots.map((p) => p.specs.cups!))].sort((a, b) => a - b);
  const roasts = (["light", "medium", "dark"] as const).map((r) => ({ r, items: coffees.filter((p) => p.specs.roast === r && available(p)) }));
  const menu = groups.filter((g) => g.id !== "academy");

  return (
    <>
      {/* hero: the tagline, the shop's own banners, a steaming cup */}
      <section className="relative overflow-hidden">
        <Beans />
        <div className="wrap relative grid items-center gap-10 pt-14 pb-12 md:pt-20 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div className="rise">
            <p className="script flex items-end gap-2 text-[30px] leading-none text-verde md:text-[36px]">
              {business.tagline} <Steam width={40} color="#c98a4b" className="-mb-1" />
            </p>
            <h1 className="mt-4 text-[40px] leading-[1.08] md:text-[60px]">
              Италийн кофе, <span className="text-rosso">мока пот</span>, бариста хэрэгсэл
            </h1>
            <p className="mt-5 max-w-xl text-[18px] text-ink-2">{business.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-verde">
                Дэлгүүр орох <ArrowIcon size={18} />
              </Link>
              <Link href="/moka" className="btn btn-cream">
                <MokaIcon size={19} /> Мока пот сонгогч
              </Link>
            </div>
            <dl className="mt-9 grid max-w-lg grid-cols-3 gap-3">
              {business.facts.map((f) => (
                <div key={f.big} className="rounded-[16px] bg-white p-3 shadow-[0_0_0_1px_var(--color-line)]">
                  <dt className="display text-[30px] leading-none text-verde">{f.big}</dt>
                  <dd className="mt-1 text-[13.5px] leading-snug text-ink-2">{f.line}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="fade-in relative">
            <BannerDeck banners={banners} />
            <CupArt width={150} className="absolute -bottom-10 -left-6 hidden drop-shadow-[0_18px_20px_rgb(42_26_18/0.25)] md:block" />
          </div>
        </div>
      </section>

      {/* brands ticker */}
      <section aria-label="Брэндүүд" className="mt-6 overflow-hidden bg-verde py-4 text-white">
        <div className="marquee flex w-max gap-10 whitespace-nowrap">
          {[0, 1].map((k) => (
            <div key={k} className="flex gap-10" aria-hidden={k === 1}>
              {[...brands, ...brands].map((b, i) => (
                <Link key={`${b.id}-${i}`} href={`/shop?b=${b.id}`} tabIndex={k === 1 ? -1 : undefined} className="display flex items-center gap-10 text-[22px] hover:text-crema-2">
                  {b.name} <Bean size={12} color="#ecc99a" />
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* the menu board */}
      <section className="wrap mt-20">
        <Reveal>
          <div className="board relative overflow-hidden p-7 md:p-12">
            <Steam width={60} color="#c98a4b" className="absolute top-6 right-8" />
            <p className="script chalk text-[30px] leading-none text-crema-2">Menu</p>
            <h2 className="chalk mt-1 text-[34px] md:text-[44px]">Өнөөдрийн цэс</h2>
            <ul className="mt-8 grid gap-x-14 gap-y-3 md:grid-cols-2">
              {menu.map((g) => {
                const from = Math.min(...products.filter((p) => p.group === g.id).map(fromPrice));
                return (
                  <li key={g.id}>
                    <Link href={`/shop?g=${g.id}`} className="group flex items-baseline text-[18px]">
                      <span className="display chalk transition group-hover:text-crema-2">{g.name}</span>
                      <span className="leader" aria-hidden />
                      <span className="shrink-0 text-[15px] text-[#cdb9a3]">
                        {formatPrice(from)}-өөс · {g.count}
                      </span>
                    </Link>
                    <span className="block text-[14px] text-[#a99482]">{g.line}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-20">
        <Heading script="хамгийн их захиалдаг" title="Эрэлттэй бараа" href="/shop" />
        <Shelf items={best} label="Эрэлттэй бараа" />
      </section>

      {/* moka pots */}
      <section className="mt-14 bg-verde-3 py-16">
        <div className="wrap">
          <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
            <div className="relative mx-auto">
              <Steam width={56} color="#17714a" className="absolute -top-12 left-7" />
              <MokaArt width={140} fill="#d7dade" className="swing" />
            </div>
            <div>
              <p className="script text-[26px] leading-none text-verde">Bialetti Moka Express</p>
              <h2 className="mt-1 text-[32px] leading-tight md:text-[42px]">Хэдэн аяганыхыг авах вэ?</h2>
              <p className="mt-2 max-w-2xl text-[17px] text-ink-2">{business.faq.find((f) => /хэмжээ/i.test(f.q))?.a}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {sizes.map((n) => (
                  <Link key={n} href="/moka" className="chip !bg-white">
                    <CupsRow n={Math.min(n, 6)} size={11} className="text-verde" /> {n} аяга
                  </Link>
                ))}
                <Link href="/moka" className="btn btn-verde !min-h-[42px] !text-[15px]">
                  Сонгогч <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </div>
          <Shelf items={pots} label="Мока пот" />
        </div>
      </section>

      {/* coffee by roast */}
      <section className="wrap mt-20">
        <Heading script="үрлэн, нунтаг, под" title="Кофегоо хууралтаар нь" href="/shop?g=beans" more="Бүх кофе" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {roasts.map(({ r, items }, i) => (
            <Reveal key={r} delay={i * 90} className="card p-6">
              <RoastMeter level={ROAST[r].level} size={22} />
              <h3 className="mt-3 text-[24px]">{ROAST[r].name}</h3>
              <ul className="mt-4 space-y-2.5">
                {items.slice(0, 5).map((p) => (
                  <li key={p.slug}>
                    <Link href={`/p/${p.slug}`} className="group flex items-center gap-3">
                      <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-white ring-1 ring-line">
                        {p.images[0] && <Image src={p.images[0].thumb.src} alt="" fill sizes="48px" className="object-contain" />}
                      </span>
                      <span className="min-w-0 flex-1 leading-snug">
                        <b className="line-clamp-2 text-[15px] group-hover:text-verde">{p.title}</b>
                      </span>
                      <span className="shrink-0 text-[14.5px] font-bold">{formatPrice(fromPrice(p))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {sale.length > 0 && (
        <section className="wrap mt-20">
          <Heading script="улаан шошготой" title="Хямдралтай" href="/shop?sale=1" />
          <Shelf items={sale} label="Хямдралтай" />
        </section>
      )}

      {/* academy */}
      <section className="mt-16 bg-board py-16 text-[#f6ecdc]">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="script text-[28px] leading-none text-crema-2">Ecoffee Academy</p>
            <h2 className="mt-1 text-[34px] leading-tight md:text-[44px]">Бариста болъё</h2>
            <p className="mt-3 text-[17px] text-[#e4d5c2]">Эспрессо, сүүний текстур, латте арт, cupping, гараар шүүх аргаас кофе бизнес хүртэл, гурван шатаар.</p>
            <Link href="/academy" className="btn btn-rosso mt-6">
              <CapIcon size={19} /> Сургалтууд
            </Link>
          </div>
          <ol className="grid gap-3 sm:grid-cols-3">
            {courses.map((c, i) => (
              <li key={c.slug}>
                <Link href={`/p/${c.slug}`} className="lift block h-full rounded-[18px] bg-board-2 p-5 ring-1 ring-white/10 hover:ring-crema">
                  <span className="display text-[40px] leading-none text-crema">{i + 1}</span>
                  <b className="mt-2 block text-[18px] leading-snug">{c.title.replace(/\s*\(.*\)$/, "")}</b>
                  <span className="block text-[14px] text-[#cdb9a3]">{c.lines[0]}</span>
                  <span className="display mt-3 block text-[22px]">{formatPrice(fromPrice(c))}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* journal: the shop's own posts */}
      {journal.length > 0 && (
        <section id="journal" className="wrap mt-20 scroll-mt-40">
          <Heading script="Lavazza, Bialetti, эспрессо" title="Кофены тэмдэглэл" />
          <Scroller label="Кофены тэмдэглэл" className="no-bar -mx-4 mt-6 flex snap-x gap-4 overflow-x-auto px-4 pt-2 pb-6">
            {journal.map((j) => (
              <Link key={j.slug} href={`/journal/${j.slug}`} className="card lift w-[270px] shrink-0 snap-start overflow-hidden md:w-[300px]">
                <span className="relative block aspect-[4/3] bg-white">{j.image && <Image src={j.image.src} alt="" fill sizes="300px" className="object-cover" />}</span>
                <span className="block p-5">
                  <b className="display block text-[19px] leading-snug">{j.title}</b>
                  <span className="mt-2 line-clamp-3 text-[14.5px] text-ink-2">{j.lines.join(" ")}</span>
                </span>
              </Link>
            ))}
          </Scroller>
        </section>
      )}

      {/* business services */}
      <section className="wrap mt-16">
        <Reveal>
          <div className="paper relative overflow-hidden rounded-[22px] p-7 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
              <div>
                <p className="script text-[26px] leading-none text-crema">HORECA · оффис · кофе шоп</p>
                <h2 className="mt-1 text-[32px] leading-tight md:text-[40px]">Бизнест кофе</h2>
                <p className="mt-3 text-[16.5px] text-ink-2">{business.company}: 2015 оноос кофены салбарт.</p>
                <a href={`tel:${business.phone.tel}`} className="btn btn-verde mt-6">
                  <PhoneIcon size={18} /> {business.phone.display}
                </a>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {business.services.map((s) => (
                  <li key={s.title} className="rounded-[14px] bg-white/85 p-4">
                    <b className="block">{s.title}</b>
                    <span className="text-[15px] text-ink-2">{s.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
