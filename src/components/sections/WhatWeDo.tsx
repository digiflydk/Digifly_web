
"use client";
import React from "react";
import type { Homepage } from "@/lib/schemas";
import Image from "next/image";
import Link from "next/link";
import { resolveCmsLink } from "@/lib/links";
import { Button } from "../ui/button";

export function WhatWeDo({ data }: { data: Homepage["whatWeDo"] }) {
  if (!data) return null;
  const { href, label, target, rel } = resolveCmsLink(data.cta);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          {data.subtitle ? (
            <p className="text-sm font-semibold tracking-widest text-accent mb-4">
              {data.subtitle}
            </p>
          ) : null}
          <h2 className="mt-2 text-3xl md:text-5xl font-semibold text-slate-900">
            {data.title}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            {data.body}
          </p>
          {href && label && (
            <div className="mt-6">
              <Button asChild>
                <Link href={href} target={target} rel={rel}>
                  {label}
                </Link>
              </Button>
            </div>
          )}
        </div>

        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
