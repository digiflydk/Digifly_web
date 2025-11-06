import { getAboutPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RichText } from "@/components/ui/rich-text";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { AboutPageSchema } from "@/lib/schemas";
import { safeStr } from "@/lib/safe";
import SafeImage from "@/components/media/SafeImage";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const rawPage = await getAboutPage();
  const page = AboutPageSchema.parse(rawPage || {});
  
  return metaDefaults({
    title: safeStr(page.seo?.title, page.title),
    description: safeStr(page.seo?.description, page.subtitle),
  });
}

export default async function AboutPage() {
    const rawPage = await getAboutPage();
    const page = AboutPageSchema.parse(rawPage || {});

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
                    <RichText content={page.body} />
                </div>
            </Container>
        </div>
    )
}
