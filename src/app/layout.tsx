import type { Metadata } from "next";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import "@/styles/marketing.css";
import { siteDescription, siteUrl } from "@/lib/marketing";
const base = siteUrl();
export const metadata: Metadata = {
  metadataBase: base ? new URL(base) : undefined,
  title: {
    default: "Digifly | AI, software og digital udvikling",
    template: "%s | Digifly",
  },
  description: siteDescription,
  applicationName: "Digifly",
  appleWebApp: { title: "Digifly", capable: true, statusBarStyle: "default" },
  icons: {
    icon: [
      { url: "/brand/digifly-icon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: [
      { url: "/brand/digifly-icon.png", sizes: "64x64", type: "image/png" },
    ],
  },
  robots:
    process.env.SITE_INDEXABLE === "true" && Boolean(base)
      ? { index: true, follow: true }
      : { index: false, follow: false },
  openGraph: {
    title: "Flow. Digitalize. Scale. | Digifly",
    description: siteDescription,
    locale: "da_DK",
    type: "website",
    siteName: "Digifly",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
