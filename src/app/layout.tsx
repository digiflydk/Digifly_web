import type { Metadata } from 'next';
import './globals.css';
import '@/styles/bluebook.css';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site';
import DesignTokensClient from '@/components/providers/design-tokens-client';

export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/cms/design`, { next: { revalidate: 60 } });
    const design = res.ok ? await res.json() : null;
    const favicon = design?.brand?.favicon?.src;
    const icons = favicon ? { icon: [{ url: favicon }] } : { icon: '/favicon.ico' };

    return {
      metadataBase: new URL(base),
      title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
      },
      description: siteConfig.description,
      openGraph: { 
        title: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        type: "website",
        images: ['/og-default.jpg'] 
      },
      manifest: '/manifest.webmanifest',
      icons
    };
  } catch {
    return {
      metadataBase: new URL(base),
      title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
      },
      description: siteConfig.description,
      openGraph: { images: ['/og-default.jpg'] },
      manifest: '/manifest.webmanifest',
      icons: { icon: '/favicon.ico' }
    };
  }
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
