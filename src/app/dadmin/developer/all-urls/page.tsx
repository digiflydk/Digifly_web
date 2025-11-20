
import { buildSeo } from "@/lib/seo";
import type { Metadata } from 'next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return await buildSeo({
    title: 'URL Reference',
    description: 'A list of all application URLs and their purpose.',
    noIndex: true,
  });
}

const URL_LIST = [
    { type: 'Site', path: '/', description: 'Public homepage.' },
    { type: 'Site', path: '/about', description: 'About Us page.' },
    { type: 'Site', path: '/services', description: 'Services overview page.' },
    { type: 'Site', path: '/cases', description: 'Index page for all case studies.' },
    { type: 'Site', path: '/cases/[slug]', description: 'Detail page for a single case study.' },
    { type: 'Site', path: '/contact', description: 'Contact page with form.' },
    { type: 'Site', path: '/privacy', description: 'Privacy Policy page.' },
    { type: 'Site', path: '/cookies', description: 'Cookie Policy page.' },
    { type: 'Admin', path: '/dadmin', description: 'Main admin dashboard.' },
    { type: 'Admin', path: '/dadmin/login', description: 'Admin login page.' },
    { type: 'Admin', path: '/dadmin/site-seo', description: 'Editor for global site settings and SEO.' },
    { type: 'Admin', path: '/dadmin/navigation', description: 'Editor for header and footer menus.' },
    { type: 'Admin', path: '/dadmin/homepage', description: 'Editor for homepage content sections.' },
    { type: 'Admin', path: '/dadmin/cases', description: 'List and manage all case studies.' },
    { type: 'Admin', path: '/dadmin/cases/new', description: 'Form to create a new case study.' },
    { type: 'Admin', path: '/dadmin/cases/[id]', description: 'Editor for a specific case study.' },
    { type: 'Admin', path: '/dadmin/developer/docs', description: 'Developer documentation portal.' },
    { type: 'Admin', path: '/dadmin/developer/tests', description: 'View and run Playwright acceptance tests.' },
    { type: 'Admin', path: '/dadmin/developer/logs', description: 'Live audit log viewer.' },
    { type: 'API', path: '/api/cms/...', description: 'Public, read-only CMS data endpoints.' },
    { type: 'API', path: '/api/admin/...', description: 'Protected endpoints for admin panel operations.' },
    { type: 'API', path: '/api/health/firebase', description: 'Health check for Firebase Admin SDK connection.' },
];

export default function AllUrlsPage() {
    return (
        <div>
             <div className="border rounded-lg">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[250px]">URL Path</TableHead>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {URL_LIST.map((url) => (
                    <TableRow key={url.path}>
                        <TableCell className="font-mono text-xs">{url.path}</TableCell>
                        <TableCell>
                            <Badge variant={url.type === 'Site' ? 'default' : url.type === 'Admin' ? 'secondary' : 'outline'}>
                                {url.type}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{url.description}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </div>
        </div>
    )
}
