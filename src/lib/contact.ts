import { z } from "zod";
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Skriv dit navn.").max(100),
  email: z.string().trim().email("Skriv en gyldig mailadresse.").max(254),
  company: z.string().trim().max(150).optional().default(""),
  subject: z.string().trim().max(100).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Fortæl kort, hvad du gerne vil tale om.")
    .max(5000),
  website: z.string().max(0).optional().default(""),
});
export function contactEnabled() {
  return Boolean(
    process.env.CONTACT_WEBHOOK_URL &&
      process.env.CONTACT_WEBHOOK_TOKEN &&
      process.env.CONTACT_FORM_ENABLED === "true" &&
      process.env.CONTACT_PRIVACY_NOTICE?.trim(),
  );
}
