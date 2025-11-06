
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';
import { SectionHeading } from "@/components/ui/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Newspaper, Link2 } from "lucide-react";
import Link from "next/link";
import { listCases } from "@/lib/cms";

export function generateMetadata(): Metadata {
    return metaDefaults({
      title: 'CMS Dashboard',
      description: 'Manage site content.',
    });
}

export default async function DadminPage() {
    const cases = await listCases();
    return (
        <div>
            <SectionHeading title="Dashboard" subtitle="Overview of your site's content." />
            
            <div className="mt-8 grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-muted-foreground" />
                            Case Studies
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{cases.length}</p>
                        <Link href="/dadmin/cases" className="text-sm text-primary hover:underline">Manage cases</Link>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Newspaper className="h-5 w-5 text-muted-foreground" />
                            Pages
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">4</p>
                        <span className="text-sm text-muted-foreground">Home, About, Services, Contact</span>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Link2 className="h-5 w-5 text-muted-foreground" />
                            Navigation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">2</p>
                        <Link href="/dadmin/navigation" className="text-sm text-primary hover:underline">Manage menus</Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
