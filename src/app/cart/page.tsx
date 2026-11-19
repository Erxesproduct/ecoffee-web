import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Сагс", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap pt-12 pb-10 md:pt-16">
      <p className="script text-[26px] leading-none text-crema">аяга кофе шиг амархан</p>
      <h1 className="mt-1 mb-6 text-[38px] leading-tight md:text-[52px]">Сагс, захиалга</h1>
      <Checkout />
    </div>
  );
}
