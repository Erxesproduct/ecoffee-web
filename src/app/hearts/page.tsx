import type { Metadata } from "next";
import { HeartsView } from "@/components/hearts-view";

export const metadata: Metadata = { title: "Хадгалсан", robots: { index: false } };

export default function HeartsPage() {
  return (
    <div className="wrap pt-12 md:pt-16">
      <p className="script text-[26px] leading-none text-crema">миний дуртай</p>
      <h1 className="mt-1 text-[38px] leading-tight md:text-[52px]">Хадгалсан</h1>
      <HeartsView />
    </div>
  );
}
