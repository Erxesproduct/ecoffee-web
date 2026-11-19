import type { Metadata } from "next";
import Link from "next/link";
import { CardActions } from "@/components/card-actions";
import { Bean, CupArt, Steam } from "@/components/deco";
import { CapIcon, PhoneIcon } from "@/components/icons";
import { business } from "@/content/business";
import { available, courses } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Бариста сургалт",
  description: "Анхан, дунд, гүнзгий шатны бариста сургалт: эспрессо, сүү, латте арт, cupping, гараар шүүх арга, тэмцээний бэлтгэл.",
  alternates: { canonical: "/academy" },
};

const TONE = ["bg-verde", "bg-crema", "bg-rosso"];

export default function AcademyPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-board text-[#f6ecdc]">
        <div className="wrap relative grid items-center gap-8 pt-14 pb-12 md:grid-cols-[1.2fr_1fr] md:pt-20">
          <div>
            <nav className="text-[14px] font-bold text-[#cdb9a3]" aria-label="Зам">
              <Link href="/" className="hover:text-white">
                Нүүр
              </Link>{" "}
              / Бариста сургалт
            </nav>
            <p className="script mt-4 text-[28px] leading-none text-crema-2">Ecoffee Academy</p>
            <h1 className="mt-2 text-[40px] leading-tight md:text-[58px]">Бариста сургалт</h1>
            <p className="mt-4 max-w-xl text-[17.5px] text-[#e4d5c2]">{business.services.find((s) => s.title === "Кофены сургалт")?.text} Гурван шаттай: эхлээд эспрессо, сүүгээ, дараа нь амт үнэр, латте арт, эцэст нь тэмцээн, кофе бизнес.</p>
            <a href={`tel:${business.phone.tel}`} className="btn btn-rosso mt-7">
              <PhoneIcon size={18} /> Хуваарь лавлах: {business.phone.display}
            </a>
          </div>
          <div className="relative mx-auto">
            <CupArt width={300} />
          </div>
        </div>
      </section>

      <section className="wrap mt-14 grid gap-6 lg:grid-cols-3">
        {courses.map((c, i) => {
          const [duration, ...rest] = c.lines;
          const goal = rest.find((l) => /^Сургалтын зорилго/i.test(l))?.replace(/^Сургалтын зорилго:\s*/i, "");
          const topics = rest.filter((l) => !/^Сургалтын зорилго/i.test(l));
          const v = c.variants[0];
          return (
            <article key={c.slug} className="card relative flex flex-col overflow-hidden">
              <div className={`${TONE[i % 3]} relative px-6 pt-6 pb-5 text-white`}>
                <span className="eyebrow !text-[11.5px] text-white/80">{i + 1}-р шат</span>
                <h2 className="mt-1 text-[28px] leading-tight">{c.title.replace(/\s*\(.*\)$/, "")}</h2>
                <p className="text-[14.5px] text-white/85">{c.title.match(/\((.*)\)/)?.[1]}</p>
                <p className="mt-3 flex items-center gap-2 font-bold">
                  <CapIcon size={18} /> {duration}
                </p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                {goal && <p className="rounded-[12px] bg-latte p-3 text-[15px]">{goal}</p>}
                <ul className="mt-4 grid gap-2 text-[15px] text-ink-2">
                  {topics.map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Bean size={9} color="#a8693c" className="mt-[7px] shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <span className="display text-[30px] leading-none">{formatPrice(v.price)}</span>
                  <span className="flex items-center gap-2">
                    <Link href={`/p/${c.slug}`} className="btn btn-cream !min-h-11 !px-4 !text-[14px]">
                      Дэлгэрэнгүй
                    </Link>
                    <CardActions slug={c.slug} variantId={available(c) ? v.id : null} />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="wrap mt-14">
        <div className="paper relative overflow-hidden rounded-[22px] p-7 md:p-10">
          <Steam width={54} color="#c98a4b" className="absolute top-4 right-6" />
          <h2 className="text-[28px] md:text-[34px]">Байгууллага, кофе шопт</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {business.services
              .filter((s) => s.title !== "Кофены сургалт")
              .map((s) => (
                <li key={s.title} className="rounded-[14px] bg-white/80 p-4">
                  <b className="block">{s.title}</b>
                  <span className="text-[15px] text-ink-2">{s.text}</span>
                </li>
              ))}
          </ul>
          <a href={`tel:${business.phone.tel}`} className="btn btn-verde mt-6">
            <PhoneIcon size={18} /> {business.phone.display}
          </a>
        </div>
      </section>
    </>
  );
}
