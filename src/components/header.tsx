import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { formatPrice } from "@/lib/format";
import { HeaderTools } from "./header-tools";
import { CapIcon, MokaIcon, PhoneIcon, TruckIcon } from "./icons";
import { Scroller } from "./scroller";

export const NAV = [
  { href: "/shop?g=beans", label: "Кофе" },
  { href: "/shop?g=moka", label: "Мока пот" },
  { href: "/shop?g=brewers", label: "Машин" },
  { href: "/shop?g=cups", label: "Аяга" },
  { href: "/shop?g=syrups", label: "Сироп" },
  { href: "/shop?g=barista", label: "Бариста" },
  { href: "/shop?g=cafe", label: "Кофе шопт" },
];

export function Header() {
  const city = business.delivery[0];
  return (
    <header className="sticky top-0 z-40">
      <div className="tricolor" aria-hidden />
      <div className="bg-verde text-white">
        <div className="wrap flex h-9 items-center justify-between gap-4 text-[13.5px] font-bold">
          <span className="flex min-w-0 items-center gap-2">
            <TruckIcon size={16} className="shrink-0" />
            <span className="truncate">
              Хүргэлт {formatPrice(city.fee)} · <span className="text-crema-2">{formatPrice(city.freeFrom)}-өөс дээш үнэгүй</span>
            </span>
          </span>
          <a href={`tel:${business.phone.tel}`} className="hidden shrink-0 items-center gap-1.5 hover:text-crema-2 sm:flex">
            <PhoneIcon size={15} /> {business.phone.display}
          </a>
        </div>
      </div>
      <div className="relative border-b border-line bg-foam/95 backdrop-blur-md">
        <div className="wrap flex h-[64px] items-center gap-3 md:h-[76px]">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label={`${business.name}: нүүр хуудас`}>
            <Image src="/brand/logo.png" alt="" width={480} height={480} priority className="hidden h-[50px] w-[50px] rounded-full transition duration-700 group-hover:rotate-[20deg] sm:block xl:hidden 2xl:block" />
            <Image src="/brand/wordmark.png" alt="ecoffee.mn" width={702} height={127} priority className="h-auto w-[132px] md:w-[158px]" />
          </Link>
          <nav aria-label="Үндсэн цэс" className="ml-4 hidden flex-1 items-center gap-0.5 xl:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-[10px] px-2.5 py-2 text-[15.5px] font-bold whitespace-nowrap text-ink transition hover:bg-latte hover:text-verde">
                {n.label}
              </Link>
            ))}
            <Link href="/moka" className="ml-1 flex items-center gap-1.5 rounded-[10px] bg-verde-3 px-3 py-2 whitespace-nowrap text-[15.5px] font-bold text-verde transition hover:bg-verde hover:text-white">
              <MokaIcon size={18} /> Мока сонгогч
            </Link>
            <Link href="/academy" className="flex items-center gap-1.5 rounded-[10px] px-3 py-2 whitespace-nowrap text-[15.5px] font-bold text-rosso transition hover:bg-rosso-3">
              <CapIcon size={18} /> Сургалт
            </Link>
          </nav>
          <HeaderTools />
        </div>
        <Scroller as="nav" label="Ангилал" small className="no-bar wrap flex gap-2 overflow-x-auto pb-3 xl:hidden">
          <Link href="/moka" className="chip shrink-0 !bg-verde-3 !text-verde">
            <MokaIcon size={17} /> Мока сонгогч
          </Link>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="chip shrink-0">
              {n.label}
            </Link>
          ))}
          <Link href="/academy" className="chip shrink-0 !text-rosso">
            <CapIcon size={17} /> Сургалт
          </Link>
        </Scroller>
        <div className="awning pointer-events-none absolute inset-x-0 top-full" aria-hidden />
      </div>
    </header>
  );
}
