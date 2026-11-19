import Link from "next/link";
import { MokaArt, Steam } from "@/components/deco";

export default function NotFound() {
  return (
    <div className="wrap relative py-20 text-center">
      <div className="relative mx-auto w-fit">
        <Steam width={60} color="#c98a4b" className="absolute -top-14 left-1/2 -translate-x-1/2" />
        <MokaArt width={120} fill="#d7dade" />
      </div>
      <p className="script mt-6 text-[30px] text-crema">404</p>
      <h1 className="mt-1 text-[34px] md:text-[48px]">Энэ аяга хоосон байна</h1>
      <p className="mt-2 text-ink-2">Хуудас олдсонгүй. Хаяг буруу эсвэл бараа шилжсэн байж магадгүй.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-verde">
          Дэлгүүр
        </Link>
        <Link href="/" className="btn btn-cream">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}
