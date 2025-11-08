import { z } from "zod";

const ImageSchema = z.object({
  src: z.string()
    .trim()
    .refine(
      (v) =>
        v === "" ||
        v.startsWith("http://") ||
        v.startsWith("https://") ||
        v.startsWith("/"),
      "Must be an absolute URL (https://...) or root-relative path (/...)."
    )
    .refine((v) => {
      if (v === "") return true;
      const ok = /\.(png|jpg|jpeg|svg|ico|webp)$/i.test(v.split("?")[0] || "");
      return ok;
    }, "Allowed extensions: .png, .jpg, .jpeg, .svg, .ico, .webp"),
  alt: z.string().default(""),
});

export const CaseSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().default(""),
  body: z.string().default(""),
  coverImage: ImageSchema.default({ src: "", alt: "" }),
  gallery: z.array(ImageSchema).default([]),
  client: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  metrics: z.record(z.string(), z.string().or(z.number())).optional(),
  dates: z
    .object({
      start: z.string().optional(),
      end: z.string().optional(),
    })
    .optional(),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z
        .string()
        .trim()
        .optional()
        .default("")
        .transform((v) => v || ""),
    })
    .default({}),
});

export type CaseDoc = z.infer<typeof CaseSchema>;
