import type { DesignSettings, Navigation, HomePage, CaseDoc, Page, RichTextContent } from './types';
import { PlaceHolderImages } from './placeholder-images';

function getImage(id: string) {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    src: image?.imageUrl || `https://picsum.photos/seed/${id}/800/600`,
    alt: image?.description || 'Placeholder image',
    hint: image?.imageHint,
  };
}


export const designSettings = {
  colors: {
    primary: '#1E90FF',
    accent: '#6A5ACD',
    bg: '#F9F9F9',
    muted: '#E5E5E5',
  },
  typography: {
    headline: 'Space Grotesk',
    body: 'Inter',
  },
  brand: {
    name: 'Digifly',
    logo: {
      src: '/logo.svg',
      width: 140,
      height: 28,
      alt: 'Digifly Logo'
    },
    favicon: {
      src: '/favicon.ico'
    }
  }
};

export const navigation: Navigation = {
  header: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Cases', href: '/cases' },
  ],
  footer: {
    columns: [
        {
            title: "Company",
            links: [
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
            ]
        },
        {
            title: "Work",
            links: [
                { label: 'Case Studies', href: '/cases' },
            ]
        },
        {
            title: "Legal",
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Cookie Policy', href: '/cookies' },
            ]
        }
    ]
  },
};

export const homePage: HomePage = {
  hero: {
    title: 'From Idea to Intelligent Solution',
    subtitle: 'Digifly bridges strategy, technology and AI to build digital solutions that deliver measurable results.',
    primaryCta: { label: 'Start Your Project', href: '/contact' },
    image: getImage('hero-1.jpg'),
  },
  intro: {
    tagline: 'Why • How • What',
    heading: 'We turn complexity into clarity.',
    body: "We combine analytical strength with deep technological expertise to create elegant, effective solutions. Our process is transparent, collaborative, and always focused on delivering measurable results for your business.",
    image: getImage('intro-1.jpg'),
  },
  servicesPreview: [
    {
      title: 'Strategy & Process Optimization',
      bullets: ['Process mapping', 'Prioritization & roadmaps', 'Linking business, data & tech'],
      href: '/services#strategy',
    },
    {
      title: 'Software & Platform Development',
      bullets: ['SaaS, web apps', 'Real-time & scalable', 'APIs & integrations'],
      href: '/services#software',
    },
    {
      title: 'Automation & AI',
      bullets: ['Workflow automation', 'AI assistants', 'ML features'],
      href: '/services#automation',
    },
  ],
  featuredCases: ['case-001', 'case-002'],
  cta: {
    text: 'Let’s build something intelligent together.',
    button: { label: 'Book a Call', href: '/contact' },
  },
  seo: {
    title: 'Digifly – From Idea to Intelligent Solution',
    description: 'Strategy, Software & Automation with AI.',
  },
};

export const cases: CaseDoc[] = [
  {
    slug: 'case-001',
    title: 'Automation that saves hours daily',
    summary: 'Reduced manual ops by 60%, improved SLAs.',
    seo: { title: "Case — Automation", description: "How we removed manual work with AI agents." },
    cover: getImage('case-001.jpg'),
    body: [
      { type: 'p', text: 'The challenge was a highly manual and error-prone client onboarding process that took days to complete. Our approach was to build a central platform that automated data collection, verification, and system setup.' },
      { type: 'list', items: ['Automated data validation against external APIs.', 'AI-powered document analysis to extract key information.', 'Generated user-friendly summaries and flagged exceptions for manual review.'] },
      { type: 'p', text: 'The result was a drastic reduction in onboarding time, improved data accuracy, and a significantly better experience for new clients.' },
    ],
    metrics: [{ label: 'Ops time', value: '-60%' }, { label: "SLA", value: "↑ 35%" }],
  },
  {
    slug: 'case-002',
    title: 'Real-Time Logistics Dashboard',
    summary: 'Centralized supply chain visibility, improving delivery estimates by 45%.',
    seo: { title: "Case — Logistics Dashboard", description: "Centralized supply chain visibility improved estimates by 45%." },
    cover: getImage('case-002.jpg'),
    body: [
        { type: 'p', text: 'A major logistics provider lacked a unified view of their shipments, leading to inefficiencies and poor customer communication. We developed a real-time dashboard to track assets across multiple carriers and systems.' },
        { type: 'list', items: ['Integrated multiple data sources via APIs into a single data stream.', 'Developed a map-based visualization with real-time location updates.', 'Implemented predictive analytics for more accurate delivery time estimates.'] },
    ],
    metrics: [{ label: 'Delivery estimate accuracy', value: '+45%' }, { label: "Customer support queries", value: "-30%" }],
  },
  {
    slug: 'case-003',
    title: 'Customer Service AI Assistant',
    summary: 'Resolved 78% of tier-1 support tickets instantly.',
    cover: getImage('case-003.jpg'),
    seo: { title: "Case — AI Assistant", description: "Resolved 78% of tier-1 support tickets instantly." },
    body: [
      { type: 'p', text: 'A fast-growing e-commerce brand was struggling with a high volume of repetitive customer support queries. We built and integrated an AI assistant into their help center and chat widget.' },
      { type: 'list', items: ['Trained on historical support tickets and company documentation.', 'Integrated with their e-commerce platform to provide order-specific information.', 'Provided instant answers to common questions about shipping, returns, and product details.'] },
    ],
    metrics: [{ label: 'Instant resolution rate', value: '78%' }, { label: "Agent response time", value: "-50%" }],
  },
];

export const aboutPage: Page<{ body: RichTextContent[] }> = {
    title: "We design growth with AI + product thinking",
    subtitle: "Strategy, build and operations – one team.",
    content: {
        body: [
            { type: 'p', text: 'Founded on the principle that technology should be a powerful enabler, not a complex barrier, Digifly was created to help businesses navigate the digital landscape with confidence. We believe in building partnerships, not just projects.' },
            { type: 'p', text: 'Our team is our greatest asset. We bring together diverse experience from various industries, allowing us to see challenges from every angle and devise solutions that are both innovative and practical.' },
            { type: 'list', items: ['Commitment to measurable results.', 'Passion for clean, scalable technology.', 'Focus on user-centric design.', 'Transparent and collaborative process.'] }
        ]
    },
    seo: {
        title: "About — Digifly",
        description: "Who we are and how we build outcomes."
    }
}

export const servicesPage: Page<{ services: {id: string, title: string, description: string, bullets: string[]}[] }> = {
    title: "Services",
    subtitle: "From discovery to delivery",
    content: {
        services: [
            {
                id: "strategy",
                title: 'AI Automation',
                description: "Workflow automation, agents, data pipelines.",
                bullets: [],
            },
            {
                id: "software",
                title: 'Product & Web',
                description: "Next.js apps, CMS, e-commerce, analytics.",
                bullets: [],
            },
            {
                id: "automation",
                title: 'Growth Ops',
                description: "Funnels, CRM, lifecycle, reporting.",
                bullets: [],
            }
        ]
    },
    seo: {
        title: "Services — Digifly",
        description: "AI automation, product, and go-to-market."
    }
}

export const casesIndexPage: Page<{}> = {
    title: "Selected work",
    subtitle: "A few outcomes we’re proud of",
    content: {},
    seo: {
        title: "Cases — Digifly",
        description: "Case studies and results."
    }
}

export const contactPage: Page<{}> = {
    title: "Contact",
    subtitle: "Let’s build something useful",
    content: {},
    seo: {
        title: "Contact — Digifly",
        description: "Get in touch with Digifly."
    }
}
