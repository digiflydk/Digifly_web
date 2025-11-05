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


export const designSettings: DesignSettings = {
  colors: {
    primary: '#000000',
    electricBlue: '#1E90FF',
    digitalPurple: '#6A5ACD',
    graphiteGrey: '#2B2B2B',
    platinumGrey: '#E5E5E5',
    softWhite: '#F9F9F9',
    success: '#00B894',
    error: '#FF4D4D',
  },
  typography: {
    headlineFont: 'Space Grotesk',
    bodyFont: 'Inter',
    h1: 56,
    h2: 40,
    h3: 28,
    body: 16,
    caption: 13,
    lineHeight: 1.4,
  },
  buttons: {
    shape: 'pill',
    radius: 50,
    primary: { bg: '#1E90FF', text: '#FFFFFF', hoverBg: '#6A5ACD' },
    secondary: { border: '#1E90FF', text: '#1E90FF', hoverBg: '#E5F1FF' },
    ghost: { text: '#2B2B2B', hoverBg: '#E5E5E5' },
  },
};

export const navigation: Navigation = {
  header: [
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Cases', href: '/cases' },
  ],
  footer: {
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
    ],
    company: {
      name: 'Digifly',
      email: 'hello@digifly.dk',
      phone: '+45 12 34 56 78',
      address: 'Copenhagen, Denmark',
    },
    social: [{ label: 'LinkedIn', href: 'https://linkedin.com/company/digifly' }],
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
    title: 'Smart Onboarding Platform',
    summary: 'Reduced manual steps by 62% with automation + AI assistants.',
    cover: getImage('case-001.jpg'),
    body: [
      { type: 'p', text: 'The challenge was a highly manual and error-prone client onboarding process that took days to complete. Our approach was to build a central platform that automated data collection, verification, and system setup.' },
      { type: 'list', items: ['Automated data validation against external APIs.', 'AI-powered document analysis to extract key information.', 'Generated user-friendly summaries and flagged exceptions for manual review.'] },
      { type: 'p', text: 'The result was a drastic reduction in onboarding time, improved data accuracy, and a significantly better experience for new clients.' },
    ],
    metrics: [{ label: 'Time saved per onboarding', value: '62%' }, { label: "Data entry errors", value: "-95%" }],
    seo: {
      title: 'Case – Smart Onboarding Platform',
      description: 'Automation + AI assistants cut manual work by 62%.',
    },
  },
  {
    slug: 'case-002',
    title: 'Real-Time Logistics Dashboard',
    summary: 'Centralized supply chain visibility, improving delivery estimates by 45%.',
    cover: getImage('case-002.jpg'),
    body: [
        { type: 'p', text: 'A major logistics provider lacked a unified view of their shipments, leading to inefficiencies and poor customer communication. We developed a real-time dashboard to track assets across multiple carriers and systems.' },
        { type: 'list', items: ['Integrated multiple data sources via APIs into a single data stream.', 'Developed a map-based visualization with real-time location updates.', 'Implemented predictive analytics for more accurate delivery time estimates.'] },
    ],
    metrics: [{ label: 'Delivery estimate accuracy', value: '+45%' }, { label: "Customer support queries", value: "-30%" }],
    seo: {
      title: 'Case – Real-Time Logistics Dashboard',
      description: 'Centralized supply chain visibility, improving delivery estimates by 45%.',
    },
  },
  {
    slug: 'case-003',
    title: 'Customer Service AI Assistant',
    summary: 'Resolved 78% of tier-1 support tickets instantly.',
    cover: getImage('case-003.jpg'),
    body: [
      { type: 'p', text: 'A fast-growing e-commerce brand was struggling with a high volume of repetitive customer support queries. We built and integrated an AI assistant into their help center and chat widget.' },
      { type: 'list', items: ['Trained on historical support tickets and company documentation.', 'Integrated with their e-commerce platform to provide order-specific information.', 'Provided instant answers to common questions about shipping, returns, and product details.'] },
    ],
    metrics: [{ label: 'Instant resolution rate', value: '78%' }, { label: "Agent response time", value: "-50%" }],
    seo: {
      title: 'Case – Customer Service AI Assistant',
      description: 'Resolved 78% of tier-1 support tickets instantly.',
    },
  },
];

export const aboutPage: Page<{ body: RichTextContent[] }> = {
    title: "About Digifly",
    subtitle: "We are a collective of strategists, designers, and engineers dedicated to building the future of digital interaction.",
    content: {
        body: [
            { type: 'p', text: 'Founded on the principle that technology should be a powerful enabler, not a complex barrier, Digifly was created to help businesses navigate the digital landscape with confidence. We believe in building partnerships, not just projects.' },
            { type: 'p', text: 'Our team is our greatest asset. We bring together diverse experience from various industries, allowing us to see challenges from every angle and devise solutions that are both innovative and practical.' },
            { type: 'list', items: ['Commitment to measurable results.', 'Passion for clean, scalable technology.', 'Focus on user-centric design.', 'Transparent and collaborative process.'] }
        ]
    },
    seo: {
        title: "About Digifly",
        description: "Learn about our mission to bridge strategy, technology, and AI."
    }
}

export const servicesPage: Page<{ services: {id: string, title: string, description: string, bullets: string[]}[] }> = {
    title: "Our Services",
    subtitle: "We offer end-to-end services to take your digital product from concept to launch and beyond.",
    content: {
        services: [
            {
                id: "strategy",
                title: 'Strategy & Process Optimization',
                description: "Before writing a line of code, we work with you to understand your business goals, map existing processes, and identify the highest-impact opportunities for technology and automation.",
                bullets: ['Business process mapping', 'Technical feasibility studies', 'Product roadmapping & prioritization', 'Linking business goals to technology requirements'],
            },
            {
                id: "software",
                title: 'Software & Platform Development',
                description: "Our core is building robust, scalable, and maintainable software. We specialize in modern web applications, SaaS platforms, and the complex integrations that power them.",
                bullets: ['Custom SaaS and web application development', 'Real-time and event-driven architectures', 'Third-party API integration', 'Scalable cloud infrastructure (GCP, AWS)'],
            },
            {
                id: "automation",
                title: 'Automation & AI',
                description: "We leverage automation and artificial intelligence to make your systems smarter and your teams more efficient. From simple workflows to complex machine learning models, we build intelligent features.",
                bullets: ['Internal tool & workflow automation', 'Custom AI assistants and chatbots', 'Integrating ML models and AI services (e.g., Gemini, OpenAI)', 'Data processing and analysis pipelines'],
            }
        ]
    },
    seo: {
        title: "Our Services | Digifly",
        description: "Explore our services: Strategy, Software Development, and AI & Automation."
    }
}

export const casesIndexPage: Page<{}> = {
    title: "Our Work",
    subtitle: "We partner with ambitious companies to solve complex challenges with technology. Here are a few of our stories.",
    content: {},
    seo: {
        title: "Case Studies | Digifly",
        description: "See how we've helped businesses achieve measurable results."
    }
}

export const contactPage: Page<{}> = {
    title: "Contact Us",
    subtitle: "Have a project in mind? We'd love to hear about it.",
    content: {},
    seo: {
        title: "Contact | Digifly",
        description: "Get in touch with the Digifly team to discuss your project."
    }
}
