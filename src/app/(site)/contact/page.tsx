import { getContactPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/sections/contact-form";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  if (!page) {
    return metaDefaults({
      title: "Contact • Digifly",
      description: "Get in touch.",
    });
  }
  return metaDefaults({
    title: page.seo?.title ?? page.title ?? "Contact • Digifly",
    description: page.seo?.description ?? "Get in touch.",
  });
}

export default async function ContactPage() {
    const page = await getContactPage();

    if (!page) {
        return (
            <div className="py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4">
                    <h1 className="text-2xl font-semibold mb-4">Contact</h1>
                    <p>Content coming soon.</p>
                </div>
            </div>
        );
    }

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
