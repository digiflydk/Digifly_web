
"use client";
import React from "react";
import Link from "next/link";
import { SectionHeading } from "../ui/section-heading";
import { Container } from "../layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { resolveCmsLink } from "@/lib/links";
import type { CmsLink } from "@/lib/types";

export type ServiceCard = {
  icon?: string;
  title: string;
  description?: string;
  link?: CmsLink;
};

export function Services({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: ServiceCard[];
}) {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900/50">
      <Container>
        <SectionHeading title={title} subtitle={subtitle} textCenter />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12">
          {items?.map((s, idx) => {
            const { href, target, rel } = resolveCmsLink(s.link);

            const CardInner = (
              <Card className="h-full rounded-2xl border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  {s.icon ? (
                    <div className="mb-4">
                      {/* Placeholder for icon */}
                      <div className="text-sm text-slate-500">{s.icon}</div>
                    </div>
                  ) : null}
                  <CardTitle className="text-xl font-semibold mb-2">{s.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {s.description ? (
                    <p className="text-slate-600">{s.description}</p>
                  ) : null}
                </CardContent>
              </Card>
            );

            return href ? (
              <Link key={idx} href={href} target={target} rel={rel} className="block h-full">
                {CardInner}
              </Link>
            ) : (
              <div key={idx}>{CardInner}</div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
