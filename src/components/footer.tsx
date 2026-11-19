import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Beans, Steam } from "./deco";
import { FacebookIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative mt-24 pb-24 md:pb-0">
      <div className="tricolor" aria-hidden />
      <div className="relative overflow-hidden bg-board text-[#f6ecdc]">
        <Beans color="#4a3226" />
        <div className="wrap relative grid gap-10 py-14 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <span className="flex items-center gap-4">
              <Image src="/brand/logo.png" alt="" width={480} height={480} className="h-20 w-20 rounded-full" />
              <span>
                <span className="script block text-[34px] leading-none text-crema-2">Ecoffee</span>
                <span className="mt-1 block text-[14px] text-[#cdb9a3]">{business.company}</span>
              </span>
            </span>
            <p className="script mt-6 flex items-end gap-2 text-[26px] leading-snug">
              {business.tagline} <Steam width={34} color="#c98a4b" className="-mb-1" />
            </p>
            <p className="mt-3 max-w-sm text-[15px] text-[#cdb9a3]">2015 оноос Bialetti, Lavazza, 1883 Maison Routin зэрэг брэндийг албан ёсны эрхтэйгээр худалдаалж байна.</p>
            <div className="mt-6 flex gap-3">
              <a href={business.facebook} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-[12px] bg-board-2 transition hover:-translate-y-1 hover:bg-verde" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="grid h-12 w-12 place-items-center rounded-[12px] bg-board-2 transition hover:-translate-y-1 hover:bg-rosso" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={`tel:${business.phone.tel}`} className="lift flex items-center gap-4 rounded-[18px] bg-foam p-5 text-ink">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-verde text-white">
                <PhoneIcon size={22} />
              </span>
              <span>
                <span className="block text-[13.5px] text-ink-2">Утас</span>
                <b className="display text-[23px]">{business.phone.display}</b>
              </span>
            </a>
            <a href={`mailto:${business.email}`} className="lift flex items-center gap-4 rounded-[18px] bg-foam p-5 text-ink">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] bg-rosso text-white">
                <MailIcon size={22} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13.5px] text-ink-2">Имэйл</span>
                <b className="block truncate text-[15.5px]">{business.email}</b>
              </span>
            </a>
            {business.stores.map((s, i) => (
              <Link key={s.name} href="/info#stores" className="lift flex items-start gap-4 rounded-[18px] bg-foam p-5 text-ink">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] ${i ? "bg-crema" : "bg-ink"} text-white`}>
                  <PinIcon size={22} />
                </span>
                <span>
                  <span className="block text-[13.5px] text-ink-2">Салбар {i + 1}</span>
                  <b className="block text-[16px] leading-snug">{s.name}</b>
                  <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">
                    {s.place}, {s.line}
                  </span>
                  <span className="mt-1 block text-[14px] font-bold text-verde">{s.phone.display}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="wrap relative flex flex-wrap items-center justify-between gap-3 border-t border-white/10 py-6 text-[14.5px] text-[#cdb9a3]">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Доод холбоос">
            <Link href="/shop" className="hover:text-white">
              Дэлгүүр
            </Link>
            <Link href="/moka" className="hover:text-white">
              Мока пот сонгогч
            </Link>
            <Link href="/academy" className="hover:text-white">
              Бариста сургалт
            </Link>
            <Link href="/info#delivery" className="hover:text-white">
              Хүргэлт, төлбөр
            </Link>
            <Link href="/info#faq" className="hover:text-white">
              Түгээмэл асуулт
            </Link>
            <Link href="/info#about" className="hover:text-white">
              Бидний тухай
            </Link>
          </nav>
          <span>
            © {new Date().getFullYear()} {business.name} · {business.domain}
          </span>
        </div>
      </div>
    </footer>
  );
}
