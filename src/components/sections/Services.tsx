
"use client";
import React from "react";
import Link from "next/link";
import { resolveCmsLink } from "@/lib/links";
import type { Homepage, ServiceItem } from "@/lib/schemas";

export function Services({ data }: { data: Homepage["services"] }) {
  if (!data) return null;
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto">
        {data.subtitle && (
          <p className="text-sm font-semibold tracking-widest text-accent">
            {data.subtitle}
          </p>
        )}
        <h2 className="mt-2 text-3xl md:text-5xl font-semibold text-slate-900">
          {data.title}
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items?.map((item: ServiceItem, i: number) => {
            const { href } = resolveCmsLink(item.link);
            const Wrapper = href ? Link : 'div';
            const wrapperProps = href ? { href } : {};
            
            return (
              <Wrapper key={i} {...wrapperProps} className="block">
                <div className="h-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-md transition">
                  <div className="text-xl font-semibold">{item.title}</div>
                  <p className="mt-2 text-slate-600">{item.body}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
