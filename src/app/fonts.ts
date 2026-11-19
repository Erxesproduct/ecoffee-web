import { Alegreya_Sans, Lobster, Yeseva_One } from "next/font/google";

// All three have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Headings and prices: a café sign-painter serif with plain, readable Cyrillic. */
export const display = Yeseva_One({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400"], variable: "--font-display", display: "swap" });
/** Body text: warm humanist sans, easy to read. */
export const body = Alegreya_Sans({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "700", "800"], variable: "--font-body", display: "swap" });
/** Short script words on menus («Caffè», «Кофены ертөнцөд зочил»). */
export const script = Lobster({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400"], variable: "--font-script", display: "swap" });
