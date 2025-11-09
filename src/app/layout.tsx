
import type { Metadata } from 'next';
import './globals.css';
import '@/styles/bluebook.css';
import { Toaster } from '@/components/ui/toaster';
import DesignTokensClient from '@/components/providers/design-tokens-client';
import { getSiteSettings } from "@/lib/cms-server";
import { buildSeo } from '@/lib/seo';
import { SITE_DEFAULTS } from '@/lib/defaults/siteDefaults';

export async function generateMetadata(): Promise<Metadata> {
  // buildSeo is now null-safe thanks to getSiteSettings' resilience
  const site = await getSiteSettings();
  return buildSeo({
    title: {
      default: site.siteTitle || SITE_DEFAULTS.siteTitle,
      template: `%s | ${site.siteTitle || SITE_DEFAULTS.siteTitle}`
    },
    description: site.defaultSeo?.description || SITE_DEFAULTS.defaultSeo.description
  });
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();
  const faviconSrc = site.brand?.favicon?.src || SITE_DEFAULTS.brand.favicon.src;

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
