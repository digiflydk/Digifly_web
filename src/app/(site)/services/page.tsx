import { getServicesPage } from "@/lib/cms";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicesPage();
  if (!page) {
    return metaDefaults({
      title: "Services • Digifly",
      description: "Our services.",
    });
  }
  return metaDefaults({
    title: page.seo?.title ?? page.title ?? "Services • Digifly",
    description: page.seo?.description ?? "Our services.",
  });
}

export default async function ServicesPage() {
    const page = await getServicesPage();

    if (!page) {
      return (
        <div className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl font-semibold mb-4">Services</h1>
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
                <div className="space-y-12 max-w-4xl mx-auto">
                    {page.content.services.map(service => (
                        <Card key={service.id} id={service.id} className="scroll-mt-24 shadow-lg border-2">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.bullets.map(bullet => (
                                        <li key={bullet} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-primary" />
                                            <span className="text-foreground/90">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Container>
        </div>
    )
}
