import { getContactPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { buildSeo } from "@/lib/seo";
import type { Metadata } from 'next';
import { ContactPageSchema } from "@/lib/schemas";
import { safeStr } from "@/lib/safe";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const rawPage = await getContactPage();
  const page = ContactPageSchema.parse(rawPage || {});

  return buildSeo({
    title: safeStr(page.seo?.title, page.title),
    description: safeStr(page.seo?.description, page.subtitle),
  });
}

export default async function ContactPage() {
    const rawPage = await getContactPage();
    const page = ContactPageSchema.parse(rawPage || {});

    return (
        <div className="py-16 md:py-24">
            <Container>
                <div className="max-w-2xl mx-auto">
                    <SectionHeading 
                        title={page.title}
                        subtitle={page.subtitle}
                        textCenter
                        className="mb-12"
                    />
                    <ContactForm />
                </div>
            </Container>
        </div>
    )
}
