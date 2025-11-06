
import { getServicesPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { ServicesPageSchema } from "@/lib/schemas";
import { safeStr } from "@/lib/safe";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const rawPage = await getServicesPage();
  const page = ServicesPageSchema.parse(rawPage || {});
  
  return metaDefaults({
    title: safeStr(page.seo?.title, page.title),
    description: safeStr(page.seo?.description, page.subtitle),
  });
}

export default async function ServicesPage() {
    const rawPage = await getServicesPage();
    const page = ServicesPageSchema.parse(rawPage || {});

    return (
        <div className="py-16 md:py-24">
            <Container>
                <SectionHeading 
                    title={page.title}
                    subtitle={page.subtitle}
                    textCenter
                    className="mb-12"
                />
                <div className="space-y-12 max-w-4xl mx-auto">
                    {page.content.services.map(service => (
                        <Card key={service.title} id={service.id} className="scroll-mt-24 shadow-lg border-2">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{service.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    )
}
