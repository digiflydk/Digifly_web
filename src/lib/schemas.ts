import { z } from "zod";
import type { RichTextContent } from './types';

export const SeoSchema = z.object({
  title: z.string().default("Digifly"),
  description: z.string().default("We build digital growth with AI, product thinking and execution."),
});

export const CoverSchema = z.object({
  src: z.string().min(1).default("/media/placeholder.jpg"),
  alt: z.string().default("Image"),
  hint: z.string().optional(),
});

export const MetricSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const RichBlockSchema: z.ZodType<RichTextContent> = z.union([
    z.object({ type: z.literal('p'), text: z.string() }),
    z.object({ type: z.literal('list'), items: z.array(z.string()) }),
]);
export const RichBodySchema = z.array(RichBlockSchema).default([]);

export const PageBaseSchema = z.object({
  title: z.string().default("Untitled"),
  subtitle: z.string().default(""),
  seo: SeoSchema.default({}),
});

export const AboutPageSchema = PageBaseSchema.extend({
  body: RichBodySchema,
});

export const ServicesPageSchema = PageBaseSchema.extend({
  services: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().default(""),
    bullets: z.array(z.string()).default([]),
  })).default([]),
});

export const ContactPageSchema = PageBaseSchema.extend({
  email: z.string().default("hello@digifly.dk"),
  phone: z.string().default("+45 00 00 00 00"),
  address: z.string().default("Copenhagen, Denmark"),
});

export const CasesIndexSchema = PageBaseSchema;

export const CaseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().default("Untitled case"),
  summary: z.string().optional(),
  seo: SeoSchema.default({}),
  cover: CoverSchema.default({}),
  body: RichBodySchema,
  metrics: z.array(MetricSchema).default([]),
  updatedAt: z.number().optional(),
});

export type CaseDoc = z.infer<typeof CaseSchema>;


// Helpers to parse + provide safe defaults
export function parseCase(input: unknown): CaseDoc {
  const parsed = CaseSchema.safeParse(input);
  if (!parsed.success) {
    // In production, you could capture parsed.error
    return {
      slug: "unknown-case",
      title: "Untitled Case",
      seo: {},
      cover: { src: "/media/placeholder.jpg", alt: "Placeholder" },
      body: [],
      metrics: [],
    };
  }
  const v = parsed.data;
  return { ...v, body: v.body ?? [] };
}
