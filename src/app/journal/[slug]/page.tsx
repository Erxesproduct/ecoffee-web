import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Steam } from "@/components/deco";
import { getPost, journal } from "@/lib/catalog";

export const dynamicParams = false;
export const generateStaticParams = () => journal.map((j) => ({ slug: j.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const j = getPost((await params).slug);
  if (!j) return {};
  return { title: j.title, description: j.lines.join(" ").slice(0, 160), alternates: { canonical: `/journal/${j.slug}` }, openGraph: { images: j.image ? [{ url: j.image.src }] : undefined } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const j = getPost((await params).slug);
  if (!j) notFound();
  const others = journal.filter((x) => x.slug !== j.slug);
  return (
    <article className="wrap max-w-3xl pt-12 md:pt-16">
      <nav className="text-[14px] font-bold text-ink-2" aria-label="Зам">
        <Link href="/" className="hover:text-verde">
          Нүүр
        </Link>{" "}
        /{" "}
        <Link href="/#journal" className="hover:text-verde">
          Кофены тэмдэглэл
        </Link>
      </nav>
      <p className="script mt-4 flex items-end gap-2 text-[26px] leading-none text-crema">
        Кофены тэмдэглэл <Steam width={28} color="#c98a4b" />
      </p>
      <h1 className="mt-2 text-[36px] leading-tight md:text-[50px]">{j.title}</h1>
      {j.image && (
        <div className="relative mt-8 overflow-hidden rounded-[22px] bg-white shadow-[0_0_0_1px_var(--color-line)]">
          <Image src={j.image.src} alt="" width={j.image.w} height={j.image.h} priority className="mx-auto h-auto max-h-[560px] w-auto" />
        </div>
      )}
      <div className="prose-ec mt-8 text-[18px] leading-relaxed">
        {j.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <p className="mt-6 text-[14px] text-ink-3">Ecoffee-ийн Zochil дэлгүүрт нийтэлсэн тэмдэглэл.</p>
      {others.length > 0 && (
        <nav className="mt-12 grid gap-3 sm:grid-cols-2" aria-label="Бусад тэмдэглэл">
          {others.map((o) => (
            <Link key={o.slug} href={`/journal/${o.slug}`} className="card lift flex items-center gap-3 p-3">
              {o.image && (
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[12px] bg-white">
                  <Image src={o.image.src} alt="" fill sizes="64px" className="object-cover" />
                </span>
              )}
              <b className="leading-snug">{o.title}</b>
            </Link>
          ))}
        </nav>
      )}
    </article>
  );
}
