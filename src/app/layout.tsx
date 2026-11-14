import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ScrollProgress } from "@/components/site/Motion";

const display = Barlow_Condensed({ variable: "--f-display", subsets: ["latin"], weight: ["600", "800"] });
const body = Inter({ variable: "--f-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--f-mono", subsets: ["latin"] });

const title = "Road to QHLAN 2028 — Brazil";
const description =
  "Four Brazilian QuakeWorld players. One dream. One community. Help us cross the ocean to QHLAN 2028 in Sweden — with every cost shown in the open.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: title, template: "%s · Road to QHLAN 2028" },
  description,
  openGraph: { title, description, type: "website", siteName: "Road to QHLAN 2028" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#05060a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:bg-ember focus:px-3 focus:py-2 focus:text-black">Skip to content</a>
        <ScrollProgress />
        <Nav />
        <main id="main" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
