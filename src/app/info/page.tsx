import type { Metadata } from "next";
import Image from "next/image";
import { Steam } from "@/components/deco";
import { BankIcon, PhoneIcon, PinIcon, QrIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { business, ORDER_STATUSES } from "@/content/business";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Мэдээлэл: хүргэлт, төлбөр, салбар",
  description: `${business.rules.delivery} QPay эсвэл дансаар. Салбар: Гурван гал ХТ B1, Ecoffee mall.`,
  alternates: { canonical: "/info" },
};

const LINKS = [
  ["about", "Бидний тухай"],
  ["stores", "Салбарууд"],
  ["delivery", "Хүргэлт"],
  ["payment", "Төлбөр"],
  ["ebarimt", "И-баримт"],
  ["faq", "Асуулт"],
] as const;

export default function InfoPage() {
  const city = business.delivery[0];
  return (
    <div className="wrap pt-12 md:pt-16">
      <p className="script flex items-end gap-2 text-[26px] leading-none text-crema">
        {business.tagline} <Steam width={28} color="#c98a4b" />
      </p>
      <h1 className="mt-2 text-[38px] leading-tight md:text-[54px]">Мэдээлэл</h1>
      <nav className="no-bar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Хэсгүүд">
        {LINKS.map(([id, name]) => (
          <a key={id} href={`#${id}`} className="chip shrink-0">
            {name}
          </a>
        ))}
      </nav>

      <section id="about" className="mt-12 grid scroll-mt-40 items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-7 md:p-9">
          <h2 className="text-[28px]">Бидний тухай</h2>
          <div className="prose-ec mt-4 text-[16.5px] text-ink-2">
            {business.about.map((l) => (
              <p key={l}>{l.replace(/Web address;.*$/i, "").trim()}</p>
            ))}
          </div>
        </div>
        <div className="board p-7 md:p-9">
          <h2 className="script chalk text-[30px]">Бид юу хийдэг вэ</h2>
          <ul className="mt-4 space-y-3 text-[15.5px]">
            {business.services.map((s) => (
              <li key={s.title}>
                <b className="block text-crema-2">{s.title}</b>
                <span className="text-[#e4d5c2]">{s.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="stores" className="mt-14 scroll-mt-40">
        <h2 className="text-[30px]">Салбарууд</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {business.stores.map((s, i) => (
            <div key={s.name} className="card relative overflow-hidden p-6">
              <span className={`absolute inset-y-0 left-0 w-2 ${i ? "bg-rosso" : "bg-verde"}`} aria-hidden />
              <p className="eyebrow !text-[11.5px] text-crema">Салбар {i + 1}</p>
              <h3 className="mt-1 text-[24px]">{s.name}</h3>
              <p className="mt-2 flex gap-2 text-[16px]">
                <PinIcon size={19} className="mt-1 shrink-0 text-verde" />
                <span>
                  {s.place}
                  <span className="block text-ink-2">{s.line}</span>
                </span>
              </p>
              <a href={`tel:${s.phone.tel}`} className="btn btn-cream mt-4 !min-h-11">
                <PhoneIcon size={17} /> {s.phone.display}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[14px] text-ink-3">Цагийн хуваарь Zochil дэлгүүрт бичигдээгүй тул утсаар лавлана уу.</p>
      </section>

      <section id="delivery" className="mt-14 grid scroll-mt-40 gap-6 lg:grid-cols-2">
        <div className="card p-7">
          <h2 className="flex items-center gap-2 text-[28px]">
            <TruckIcon size={26} className="text-verde" /> Хүргэлт
          </h2>
          <div className="mt-5 flex items-center justify-between gap-3 rounded-[14px] bg-verde-3 p-4">
            <span>
              <b className="display block text-[20px]">{city.name}</b>
              <span className="text-[15px] text-ink-2">{city.note}</span>
            </span>
            <span className="text-right">
              <b className="display block text-[22px]">{formatPrice(city.fee)}</b>
              <span className="text-[14px] text-verde">{formatPrice(city.freeFrom)}-өөс дээш үнэгүй</span>
            </span>
          </div>
          <p className="mt-4 text-[16px]">{business.rules.delivery}</p>
          <p className="mt-2 text-[15px] text-ink-2">{business.rules.countryside}</p>
          <p className="mt-2 text-[15px] text-ink-2">{business.rules.preorder}</p>
        </div>
        <div className="card p-7">
          <h2 className="text-[28px]">Захиалгын явц</h2>
          <ol className="mt-5 space-y-3">
            {ORDER_STATUSES.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className={`display grid h-9 w-9 shrink-0 place-items-center rounded-full text-[15px] ${s.id === "cancelled" ? "bg-rosso-3 text-rosso" : "bg-latte"}`}>{s.id === "cancelled" ? "×" : i + 1}</span>
                <span>
                  <b className="block">{s.name}</b>
                  <span className="text-[14.5px] text-ink-2">{s.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="payment" className="mt-14 scroll-mt-40">
        <h2 className="text-[30px]">Төлбөр</h2>
        <p className="mt-2 text-[16.5px] text-ink-2">{business.rules.payment}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="card flex gap-4 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-rosso text-white">
              <QrIcon size={24} />
            </span>
            <span>
              <b className="display block text-[21px]">QPay</b>
              <span className="text-[15px] text-ink-2">{business.payments[0].note}</span>
            </span>
          </div>
          <div className="card flex gap-4 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-verde text-white">
              <BankIcon size={24} />
            </span>
            <span>
              <b className="display block text-[21px]">Дансаар</b>
              <span className="text-[15px] text-ink-2">
                {business.bank.bank} {business.bank.account}, {business.bank.holder}. Гүйлгээний утгад захиалгын кодоо бичнэ.
              </span>
            </span>
          </div>
        </div>
      </section>

      <section id="ebarimt" className="mt-14 scroll-mt-40">
        <div className="card flex gap-4 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-latte text-ink">
            <ShieldIcon size={24} />
          </span>
          <span>
            <b className="display block text-[21px]">И-баримт</b>
            <span className="text-[15.5px] text-ink-2">{business.rules.ebarimt}</span>
          </span>
        </div>
      </section>

      <section id="faq" className="mt-14 scroll-mt-40">
        <h2 className="text-[30px]">Түгээмэл асуулт</h2>
        <div className="mt-5 grid gap-3">
          {business.faq.map((f, i) => (
            <details key={f.q} className="card group p-5" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-bold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-latte transition group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="mt-3 text-[16px] text-ink-2">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-4">
          <Image src="/brand/logo.png" alt="" width={480} height={480} className="h-14 w-14 rounded-full" />
          <p className="text-[15.5px] text-ink-2">
            Өөр асуулт байвал{" "}
            <a href={`tel:${business.phone.tel}`} className="font-bold text-verde underline">
              {business.phone.display}
            </a>{" "}
            эсвэл{" "}
            <a href={`mailto:${business.email}`} className="font-bold text-verde underline">
              {business.email}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
