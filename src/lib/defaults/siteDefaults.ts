
import type { SiteSettings, HomePage, HeroSlide, Page, Navigation, CaseDoc } from '@/lib/types';
import { HeroSlideSchema, NavigationSchema, AboutPageSchema, ServicesPageSchema, CasesIndexSchema, ContactPageSchema, CaseSchema } from '../schemas';

export const SITE_DEFAULTS: SiteSettings = {
  siteTitle: 'Digifly',
  brand: {
    name: 'Digifly',
    logo: { src: 'https://i.postimg.cc/yxjNkX5M/digifly-logo.png', alt: 'Digifly Logo', width: 140, height: 28 },
    favicon: { src: 'https://i.postimg.cc/VvP3vfcP/favicon.png' }
  },
  social: { 
    tagline: 'Strategy, Software & Automation with AI.'
  },
  defaultSeo: {
    description: "Digifly builds intelligent digital solutions.",
    title: ''
  }
} as const;


// DGF-109: New normalizer for safely handling image objects
export type Img = { src: string; alt?: string; width?: number; height?: number };

export const safeImage = (img?: Partial<Img> | null): Img => ({
  src: (img?.src ?? '').toString(),
  alt: img?.alt ?? '',
  width: img?.width ?? undefined,
  height: img?.height ?? undefined,
});

export const defaultHeroSlide: HeroSlide = {
  image: { src: "/media/hero-1.jpg", alt: "Abstract hero image" },
  heading: "New Slide",
  subheading: "A compelling subtitle for your new slide.",
  body: "",
  cta: { label: "Learn More", href: "/" },
  visible: true,
};

export const defaultHomepage: HomePage = {
  hero: { 
    slides: [
      {
        image: { src: "/media/hero-1.jpg", alt: "Abstract hero image" },
        heading: "From Idea to Intelligent Solution",
        subheading: "Digifly bridges strategy, technology and AI to build digital solutions that deliver measurable results.",
        body: "",
        cta: { label: "Start Your Project", href: "/contact" },
        visible: true,
      }
    ],
    rotationDelaySec: 5 
  },
  intro: { 
    tagline: 'Why, How, What',
    heading: 'What We Do',
    body: 'Strategy & process optimization, software & automation with AI as an enabler.',
    image: { src: '/media/intro-1.jpg', alt: 'Team collaboration' }
  },
  servicesPreview: [
    { title: "Strategy & Automation", bullets: ["Process Optimization", "AI Integration", "Workflow Automation"], href: "/services#strategy" },
    { title: "Software & SaaS", bullets: ["Web & Mobile Apps", "API Development", "Cloud Architecture"], href: "/services#software" },
    { title: "Design & UX", bullets: ["UI/UX Research", "Prototyping", "Design Systems"], href: "/services#design" }
  ],
  featuredCases: ['autostream-ai', 'connect-app'],
  cta: {
    text: "Let's build something intelligent together.",
    button: { label: 'Book a Call', href: '/contact' }
  },
  seo: {
    title: 'Digifly | Strategy, Software & Automation with AI',
    description: 'We partner with you to build intelligent digital solutions that drive real-world results.'
  }
};


// DGF-125 Fix: Central normalization function
export function normalizeHome(data: any): Partial<HomePage> {
    if (!data || typeof data !== 'object') {
        return defaultHomepage;
    }

    const d = { ...defaultHomepage, ...data };
    
    // Ensure hero object and slides array exist
    d.hero = { ...defaultHomepage.hero, ...(d.hero || {}) };
    d.hero.slides = Array.isArray(d.hero.slides) ? d.hero.slides : [];

    // Normalize rotation delay
    const n = Number(d.hero.rotationDelaySec);
    if (![3, 5, 8, 10, 15].includes(n)) {
        d.hero.rotationDelaySec = 5;
    } else {
        d.hero.rotationDelaySec = n;
    }
    
    // Ensure other top-level fields are at least present
    d.intro = { ...defaultHomepage.intro, ...(d.intro || {}) };
    d.servicesPreview = Array.isArray(d.servicesPreview) ? d.servicesPreview : [];
    d.featuredCases = Array.isArray(d.featuredCases) ? d.featuredCases : [];
    d.cta = { ...defaultHomepage.cta, ...(d.cta || {}) };
    d.seo = { ...defaultHomepage.seo, ...(d.seo || {}) };

    return d;
}

export const defaultNavigation: Navigation = NavigationSchema.parse({
  header: [
    { label: "Services", href: "/services" },
    { label: "Cases", href: "/cases" },
    { label: "About", href: "/about" },
  ],
  footer: {
    columns: [
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy", href: "/privacy" },
          { label: "Cookies", href: "/cookies" },
        ],
      },
    ],
  },
});

export const defaultAboutPage: Page<{ body: any[] }> = AboutPageSchema.parse({
  title: 'About Digifly',
  subtitle: 'We are a digital innovation partner, helping businesses leverage technology and AI to achieve their strategic goals.',
  content: {
    body: [
      { type: 'p', text: 'Our mission is to transform complex challenges into elegant, effective digital solutions.' },
      { type: 'list', items: ['Strategy', 'Software Development', 'AI-driven Automation'] }
    ]
  },
  seo: { title: 'About Us', description: 'Learn about Digifly\'s mission and values.'}
});

export const defaultServicesPage = ServicesPageSchema.parse({
    title: 'Our Services',
    subtitle: 'From strategic planning to software delivery, we provide end-to-end solutions.',
    content: {
        services: [
            { id: 'strategy', title: 'Strategy & Process Automation', description: 'We help you identify opportunities for growth and efficiency, then implement AI-powered automation to get you there.', bullets: [] },
            { id: 'software', title: 'Software & SaaS Development', description: 'Custom web and mobile applications, built on a modern, scalable cloud architecture.', bullets: [] },
            { id: 'design', title: 'Design & User Experience', description: 'From user research to final UI, we create intuitive and engaging digital experiences.', bullets: [] },
        ]
    }
});

export const defaultCasesIndexPage = CasesIndexSchema.parse({
  title: 'Our Work',
  subtitle: 'See how we\'ve helped other companies succeed.'
});

export const defaultContactPage = ContactPageSchema.parse({
  title: 'Contact Us',
  subtitle: 'Let\'s start a conversation about your next project.'
});

export const defaultCases: CaseDoc[] = [
  CaseSchema.parse({
    slug: 'autostream-ai',
    title: 'AutoStream AI: Automation Platform',
    excerpt: 'A SaaS platform for automating content workflows using generative AI, reducing manual effort by 90%.',
    coverImage: { src: '/media/case-001.jpg', alt: 'AI Automation Dashboard' },
    client: 'AutoStream',
    featured: true,
    published: true,
  }),
  CaseSchema.parse({
    slug: 'connect-app',
    title: 'ConnectApp: Social Mobile App',
    excerpt: 'A cross-platform mobile application designed to connect local communities, reaching 50k active users in 6 months.',
    coverImage: { src: '/media/case-003.jpg', alt: 'Mobile app interface' },
    client: 'ConnectApp Inc.',
    featured: true,
    published: true,
  })
];

export const ALL_DEFAULTS = {
    'site/settings': SITE_DEFAULTS,
    'navigation/main': { items: defaultNavigation.header },
    'navigation/footer': { items: defaultNavigation.footer.columns.flatMap(c => c.links) },
    'pages/home': defaultHomepage,
    'pages/about': defaultAboutPage,
    'pages/services': defaultServicesPage,
    'pages/contact': defaultContactPage,
    'pages/cases-index': defaultCasesIndexPage,
};
