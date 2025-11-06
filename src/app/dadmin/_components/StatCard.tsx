import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase, Newspaper, Link2, LucideProps } from "lucide-react";
import React from "react";

const icons: { [key: string]: React.ElementType<LucideProps> } = {
  Briefcase,
  Newspaper,
  Link2,
};

type StatCardProps = {
  title: string;
  value: number;
  href: string;
  icon: string;
  cta: string;
};

export function StatCard({ title, value, href, icon, cta }: StatCardProps) {
  const Icon = icons[icon];
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium text-slate-600">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{value}</p>
        <Link href={href} className="text-sm text-blue-600 hover:underline mt-1 block">{cta}</Link>
      </CardContent>
    </Card>
  );
}
