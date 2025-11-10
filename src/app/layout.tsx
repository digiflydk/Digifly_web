

import type { Metadata } from 'next';
import './globals.css';
import '@/styles/bluebook.css';
import { Toaster } from '@/components/ui/toaster';
import DesignTokensClient from '@/components/providers/design-tokens-client';
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";
import { buildSeo } from '@/lib/seo';

export const revalidate = 60; // refresh settings every 60s

export async function generateMetadata(): Promise<Metadata> {
  const s = await readSiteSettings();
  return buildSeo({
    // Root layout uses site-wide defaults
  }, s);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await readSiteSettings();
  const faviconSrc = site?.general?.faviconUrl;

  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {faviconSrc && <link rel="icon" href={faviconSrc} sizes="any" />}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
            <script id="ga4" dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date()); gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}} />
          </>
        ) : null}
      </head>
      <body className="font-body antialiased text-[var(--color-graphite)] bg-white overflow-x-hidden">
        <DesignTokensClient settings={site} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
