
import type { SiteSettings, HomePage, HeroSlide, Page, Navigation, CaseDoc, CmsLink, NavLink, Services, ServiceItem } from '@/lib/types';
import { HeroSlideSchema, NavigationSchema, AboutPageSchema, ServicesPageSchema, CasesIndexSchema, ContactPageSchema, CaseSchema, HomepageSchema } from '../schemas';
import { z } from 'zod';
import { emptySiteSettings } from '@/components/dadmin/site-seo/utils/formDefaults';
import deepmerge from "deepmerge";

export const SITE_DEFAULTS: SiteSettings = {
  general: {
    brandName: 'Digifly',
    logoUrl: 'https://i.postimg.cc/yxjNkX5M/digifly-logo.png',
    faviconUrl: 'https://i.postimg.cc/VvP3vfcP/favicon.png',
  },
  seo: {
    allowIndexing: true,
    defaultTitle: 'Digifly',
    defaultDescription: "Digifly builds intelligent digital solutions.",
    ogImage: '',
    canonicalBase: '',
  },
  contact: {
    email: '',
    phone: '',
    company: '',
    street: '',
    zip: '',
    city: '',
    country: ''
  },
  hours: {
    sunday:   { enabled: false, from: '09:00', to: '17:00' },
    monday:   { enabled: true,  from: '09:00', to: '17:00' },
    tuesday:  { enabled: true,  from: '09:00', to: '17:00' },
    wednesday:{ enabled: true,  from: '09:00', to: '17:00' },
    thursday: { enabled: true,  from: '09:00', to: '17:00' },
    friday:   { enabled: true,  from: '09:00', to: '17:00' },
    saturday: { enabled: false, from: '09:00', to: '17:00' },
  },
};


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
  cta: { type: 'internal', label: 'Learn More', internalRef: 'home', newTab: false },
  visible: true,
};

export const defaultServiceItem: ServiceItem = {
    icon: "Workflow", 
    title: "", 
    body: "", 
    link: { type: 'internal', label: '', internalRef: null, newTab: false }
};

export const defaultServices: Services = {
    enabled: true,
    title: "Our Core Services",
    subtitle: "What we do best",
    items: [
        { icon: "Workflow", title: "Automation", body: "Save time with flows", link: { type: "internal", label: "Learn More", internalRef: "services", newTab: false } },
        { icon: "Sparkles", title: "AI Assist", body: "Ship smarter products", link: { type: "internal", label: "Learn More", internalRef: "services", newTab: false } },
        { icon: "Bolt", title: "MVP Builds", body: "Go live fast", link: { type: "internal", label: "Learn More", internalRef: "cases-index", newTab: false } },
    ],
};

export const defaultHomepage: HomePage = HomepageSchema.parse({
  hero: { 
    slides: [
      {
        image: { src: "/media/hero-1.jpg", alt: "Abstract hero image" },
        heading: "From Idea to Intelligent Solution",
        subheading: "Digifly bridges strategy, technology and AI to build digital solutions that deliver measurable results.",
        body: "",
        cta: { type: 'internal', label: 'Start Your Project', internalRef: 'contact', newTab: false },
        visible: true,
      }
    ],
    rotationDelaySec: 5 
  },
  whatWeDo: {
    enabled: true,
    subtitle: "WHY, HOW, WHAT",
    title: "What We Do",
    body: "Strategy, software development, and AI-driven automation. We help businesses identify opportunities for growth and efficiency, then build the technology to make it happen.",
    image: {
      src: "/media/intro-1.jpg",
      alt: "Team collaborating on product strategy"
    },
    cta: {
      label: "Start Your Project",
      type: "internal", internalRef: "contact", newTab: false
    }
  },
  services: defaultServices,
  featuredCases: ['autostream-ai', 'connect-app'],
  cta: {
    text: "Let's build something intelligent together.",
    button: { type: 'internal', label: 'Book a Call', internalRef: 'contact', newTab: false }
  },
   seo: {
    title: 'Digifly | Strategy, Software & Automation with AI',
    description: 'We partner with you to build intelligent digital solutions that drive real-world results.'
  }
});

// Central normalization function
export function normalizeHome(data: any): Partial<HomePage> {
    if (!data || typeof data !== 'object') {
        return defaultHomepage;
    }
    return deepmerge(defaultHomepage, data);
}

const defaultNavLink = (label: string, ref: string, external = false): NavLink => ({
  id: crypto.randomUUID(),
  link: {
    label,
    type: external ? 'external' : 'internal',
    internalRef: external ? null : ref,
    externalUrl: external ? ref : '',
    newTab: external,
  },
});

export const defaultNavigation: Navigation = NavigationSchema.parse({
  header: [
    defaultNavLink("Services", "services"),
    defaultNavLink("Cases", "cases-index"),
    defaultNavLink("About", "about"),
  ],
  footer: {
    columns: [
      {
        title: "Company",
        links: [
          defaultNavLink("About", "about"),
          defaultNavLink("Contact", "contact"),
        ],
      },
      {
        title: "Legal",
        links: [
          defaultNavLink("Privacy", "privacy"),
          defaultNavLink("Cookies", "cookies"),
        ],
      },
    ],
  },
});

export const defaultAboutPage: Page<{ body: any[] }> = {
  title: 'About Digifly',
  subtitle: 'We are a digital innovation partner, helping businesses leverage technology and AI to achieve their strategic goals.',
  content: {
    body: [
      { type: 'p', text: 'Our mission is to transform complex challenges into elegant, effective digital solutions.' },
      { type: 'list', items: ['Strategy', 'Software Development', 'AI-driven Automation'] }
    ]
  },
  seo: { title: 'About Us', description: 'Learn about Digifly\'s mission and values.'}
};

export const defaultServicesPage = ServicesPageSchema.parse({
    title: 'Our Services',
    subtitle: 'From strategic planning to software delivery, we provide end-to-end solutions.',
    content: {
        services: [
            { id: 'strategy', title: 'Strategy & Process Automation', description: 'We help you identify opportunities for growth and efficiency, then implement AI-powered automation to get you there.' },
            { id: 'software', title: 'Software & SaaS Development', description: 'Custom web and mobile applications, built on a modern, scalable cloud architecture.' },
            { id: 'design', title: 'Design & User Experience', description: 'From user research to final UI, we create intuitive and engaging digital experiences.' },
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

export const defaultCases: z.infer<typeof CaseSchema>[] = [
  CaseSchema.parse({
    slug: 'autostream-ai',
    title: 'AutoStream AI: Automation Platform',
    excerpt: 'A SaaS platform for automating content workflows using generative AI, reducing manual effort by 90%.',
    cover: { src: '/media/case-001.jpg', alt: 'AI Automation Dashboard' },
    client: 'AutoStream',
    featured: true,
    published: true,
  }),
  CaseSchema.parse({
    slug: 'connect-app',
    title: 'ConnectApp: Social Mobile App',
    excerpt: 'A cross-platform mobile application designed to connect local communities, reaching 50k active users in 6 months.',
    cover: { src: '/media/case-003.jpg', alt: 'Mobile app interface' },
    client: 'ConnectApp Inc.',
    featured: true,
    published: true,
  })
];

export const ALL_DEFAULTS = {
  'site/settings': SITE_DEFAULTS,
  'site/navigation': defaultNavigation, // Use the new single doc path
  'pages/home': defaultHomepage,
  'pages/about': defaultAboutPage,
  'pages/services': defaultServicesPage,
  'pages/contact': defaultContactPage,
  'pages/cases-index': defaultCasesIndexPage,
};
