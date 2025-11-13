
"use server";
// This file is now intended for re-exporting Zod types, not schemas.
// The Zod schema objects have been moved to src/data/schemas.ts to
// resolve Next.js "use server" build errors.

import { z } from "zod";
import {
    CmsLinkSchema,
    NavLinkSchema,
    SiteSettingsSchema,
    NavigationSchema,
    HeroSlideSchema,
    HomepageSchema,
    AboutPageSchema,
    ServicesPageSchema,
    CasesIndexSchema,
    ContactPageSchema,
    CaseSeoSchema,
    CaseMetricSchema,
    CaseSchema,
    BrandSchema
} from '@/data/schemas';

// --- Re-exporting Zod schemas for validation ---
// We keep these here so server-side validation logic that imports from /lib
// doesn't break. The object definitions themselves are in /data.
export {
    CmsLinkSchema,
    NavLinkSchema,
    SiteSettingsSchema,
    NavigationSchema,
    HeroSlideSchema,
    HomepageSchema,
    AboutPageSchema,
    ServicesPageSchema,
    CasesIndexSchema,
    ContactPageSchema,
    CaseSeoSchema,
    CaseMetricSchema,
    CaseSchema,
    BrandSchema
};

// --- TYPE INFERENCE ONLY ---
// Components and pages should import types from here or from src/lib/types.ts

// Audit Log schema (remains here as it's only used in server-only context)
export type AdminAction = "site-seo.save" | "site-seo.preview" | "site-seo.deploy" | "homepage.save" | "cases.save" | "playwright.run";
export interface AuditLog {
  action: AdminAction;
  actorUid: string | null;
  actorEmail?: string | null;
  path?: string;
  payloadSummary?: string;
  status: "ok" | "error";
  errorMessage?: string;
  ts: any; // Using `any` for Firebase's serverTimestamp()
  version?: string;
}

// Shim old names to satisfy imports and avoid breaking changes
export const BasePageSchema = z.object({ slug: z.string(), title: z.string().optional() });
export const NavItemSchema  = NavLinkSchema;
export const DesignSettingsSchema = SiteSettingsSchema; // alias to satisfy imports
