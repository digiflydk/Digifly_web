import type { Metadata } from 'next';
import './globals.css';
import '@/styles/bluebook.css';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site';
import DesignTokensClient from '@/components/providers/design-tokens-client';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  // TODO: Add other metadata fields
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased text-[var(--color-graphite)] bg-white">
        <DesignTokensClient />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
