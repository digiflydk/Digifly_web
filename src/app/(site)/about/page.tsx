import { getAboutPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RichText } from "@/components/ui/rich-text";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  if (!page) {
    return metaDefaults({
      title: "About • Digifly",
      description: "Learn more about Digifly.",
    });
  }
  return metaDefaults({
    title: page.seo?.title ?? page.title ?? "About • Digifly",
    description: page.seo?.description ?? "Learn more about Digifly.",
  });
}

export default async function AboutPage() {
    const page = await getAboutPage();

    if (!page) {
        return (
            <div className="py-16 md:py-24">
              <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-2xl font-semibold mb-4">About</h1>
                <p>Content coming soon.</p>
              </div>
            </div>
        );
    }

    return (
        <div className="py-16 md:py-24">
            <Container>
                <SectionHeading 
                    title={page.title}
                    subtitle={page.subtitle}
                    textCenter
                    className="mb-12"
                />
                <div className="max-w-3xl mx-auto">
                    <RichText content={page.content.body} />
                </div>
            </Container>
        </div>
    )
}
