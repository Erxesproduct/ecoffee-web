import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Greeter } from "@/components/greeter";
import { Header } from "@/components/header";
import { BottomBar } from "@/components/header-tools";
import { business } from "@/content/business";
import { siteUrl } from "@/lib/site-url";
import { body, display, script } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${business.name}: Италийн кофе, мока пот, бариста хэрэгсэл`, template: `%s · ${business.name}` },
  description: business.description,
  openGraph: { type: "website", siteName: business.name, locale: "mn_MN", images: [{ url: "/og.jpg", width: 1200, height: 630 }] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#17714a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${display.variable} ${body.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        {/* scroll-reveal hides blocks only when JS runs */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-[10px] focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Үндсэн агуулга руу
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BottomBar />
        <Greeter />
      </body>
    </html>
  );
}
