
import AdminForm from "@/components/cms/AdminForm";
import { metaDefaults } from "@/lib/seo";
import type { Metadata } from 'next';

export function generateMetadata(): Metadata {
    return metaDefaults({
      title: 'CMS Admin',
      description: 'Manage site content.',
    });
}

export default function DadminPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Digifly CMS</h1>
      <AdminForm />
    </section>
  );
}
