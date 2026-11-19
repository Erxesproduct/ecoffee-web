"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cartCount, cartSubtotal, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { getLiteVariant } from "@/lib/lite";
import { useHearts } from "@/lib/wishlist";
import { BagIcon, CheckIcon, CloseIcon, GridIcon, HeartIcon, HomeIcon, MokaIcon, SearchIcon } from "./icons";

const square = "relative grid h-11 w-11 place-items-center rounded-[12px] bg-white shadow-[0_0_0_1.5px_var(--color-line)_inset] transition hover:shadow-[0_0_0_1.5px_var(--color-crema)_inset] hover:text-verde md:h-12 md:w-12";

/** «Сагсанд нэмлээ» toast, shared by the header and the bottom bar. */
function useAdded() {
  const [toast, setToast] = useState<{ n: string; t: string | null } | null>(null);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    let t: number | undefined;
    const onAdd = (e: Event) => {
      const v = getLiteVariant((e as CustomEvent<{ id: string }>).detail.id);
      setToast(v ? { n: [v.n, v.b].filter(Boolean).join(" · "), t: v.t } : { n: "", t: null });
      setBump((b) => b + 1);
      window.clearTimeout(t);
      t = window.setTimeout(() => setToast(null), 2800);
    };
    window.addEventListener("ecoffee:added", onAdd);
    return () => {
      window.removeEventListener("ecoffee:added", onAdd);
      window.clearTimeout(t);
    };
  }, []);
  return { toast, bump, close: () => setToast(null) };
}

export function HeaderTools() {
  const items = useCart();
  const liked = useHearts();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { toast, bump, close } = useAdded();
  const n = cartCount(items);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  return (
    <div className="ml-auto flex items-center gap-2">
      {open ? (
        <form
          role="search"
          className="pop-in flex items-center gap-1 rounded-[12px] bg-white py-1 pr-1 pl-4 shadow-[0_0_0_2px_var(--color-verde)_inset]"
          onSubmit={(e) => {
            e.preventDefault();
            const q = input.current?.value.trim();
            setOpen(false);
            router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
          }}
        >
          <input ref={input} name="q" placeholder="Lavazza, мока пот, аяга…" aria-label="Хайх" className="w-[40vw] max-w-[240px] bg-transparent text-[16px] outline-none" />
          <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-[10px] hover:bg-latte" aria-label="Хаах">
            <CloseIcon size={18} />
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={square} aria-label="Хайх">
          <SearchIcon size={20} />
        </button>
      )}
      <Link href="/hearts" className={`${square} hidden md:grid`} aria-label={`Хадгалсан (${liked.length})`}>
        <HeartIcon size={20} filled={liked.length > 0} className={liked.length ? "text-rosso" : ""} />
      </Link>
      <Link href="/cart" className="btn btn-verde hidden !min-h-12 !px-5 md:inline-flex" aria-label={`Сагс (${n})`}>
        <BagIcon size={19} />
        Сагс
        {n > 0 && (
          <span key={bump} className="pop-in grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-[13px] text-verde">
            {n}
          </span>
        )}
      </Link>
      {toast && (
        <div role="status" className="pop-in card fixed right-4 bottom-44 z-50 flex w-[min(360px,calc(100vw-32px))] items-center gap-3 p-3 md:top-32 md:bottom-auto">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-[12px] bg-white ring-1 ring-line">
            {toast.t ? <Image src={toast.t} alt="" fill sizes="56px" className="object-contain p-1" /> : <CheckIcon size={22} />}
          </span>
          <span className="min-w-0 flex-1">
            <b className="display flex items-center gap-1.5 text-[17px] text-verde">
              <CheckIcon size={16} /> Сагсанд нэмлээ
            </b>
            <span className="block truncate text-[14px] text-ink-2">{toast.n}</span>
          </span>
          <Link href="/cart" onClick={close} className="btn btn-verde !min-h-10 !px-4 !text-[14px]">
            Сагс
          </Link>
        </div>
      )}
    </div>
  );
}

const TABS = [
  { href: "/", label: "Нүүр", Icon: HomeIcon },
  { href: "/shop", label: "Дэлгүүр", Icon: GridIcon },
  { href: "/moka", label: "Мока пот", Icon: MokaIcon },
  { href: "/hearts", label: "Хадгалсан", Icon: HeartIcon },
];

/** Phone bottom bar: the four places people need, plus the cart with its running total. */
export function BottomBar() {
  const items = useCart();
  const path = usePathname();
  const n = cartCount(items);
  const sum = cartSubtotal(items);
  return (
    <nav aria-label="Доод цэс" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-foam/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid grid-cols-5">
        {TABS.map(({ href, label, Icon }) => {
          const on = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href} aria-current={on ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2 text-[12px] font-bold ${on ? "text-verde" : "text-ink-2"}`}>
              <span className={`grid h-8 w-12 place-items-center rounded-[10px] transition ${on ? "bg-verde-3" : ""}`}>
                <Icon size={21} />
              </span>
              {label}
            </Link>
          );
        })}
        <Link href="/cart" aria-current={path === "/cart" ? "page" : undefined} className="flex flex-col items-center gap-0.5 py-2 text-[12px] font-bold">
          <span className="relative grid h-8 w-12 place-items-center rounded-[10px] bg-verde text-white">
            <BagIcon size={20} />
            {n > 0 && (
              <span key={n} className="pop-in absolute -top-1.5 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-rosso px-1 text-[11px] text-white">
                {n}
              </span>
            )}
          </span>
          <span className="text-verde">{n ? formatPrice(sum) : "Сагс"}</span>
        </Link>
      </div>
    </nav>
  );
}
