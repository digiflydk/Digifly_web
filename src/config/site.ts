export const siteConfig = {
  name: 'Digifly',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  description: 'Strategy, Software & Automation with AI.',
  links: {
    github: 'https://github.com/example/digifly',
    linkedin: 'https://linkedin.com/company/digifly',
  },
};

export type SiteConfig = typeof siteConfig;
