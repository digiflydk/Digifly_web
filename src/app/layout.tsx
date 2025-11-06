
import type { Metadata } from 'next';
import './globals.css';
import '@/styles/bluebook.css';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site';
import DesignTokensClient from '@/components/providers/design-tokens-client';
import { getSiteSettings } from "@/lib/cms-server";
import { buildSiteMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSiteMetadata();
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
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
        <DesignTokensClient />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
