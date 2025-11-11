
"use client";
import React from "react";
import { SectionHeading } from "../ui/section-heading";
import { Container } from "../layout/container";

export function WhatWeDo({
  eyebrow,
  title,
  subtitle,
  body,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
}) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            tagline={eyebrow}
            title={title}
            subtitle={subtitle}
            textCenter
          />
          {body ? <p className="mt-6 text-lg text-muted-foreground">{body}</p> : null}
        </div>
      </Container>
    </section>
  );
}
