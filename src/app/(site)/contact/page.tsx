import { getContactPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return metaDefaults({
    title: page.seo.title,
    description: page.seo.description,
  });
}

export default async function ContactPage() {
    const page = await getContactPage();

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
