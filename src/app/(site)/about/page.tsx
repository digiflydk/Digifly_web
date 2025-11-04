import { getAboutPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RichText } from "@/components/ui/rich-text";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return metaDefaults({
    title: page.seo.title,
    description: page.seo.description,
  });
}

export default async function AboutPage() {
    const page = await getAboutPage();

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
