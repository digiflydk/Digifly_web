import type { Metadata } from "next";
import { VisualHome } from "@/components/marketing/visual-home";
import { siteUrl } from "@/lib/marketing";
import "@/styles/visual-home.css";

export const metadata: Metadata = {
  alternates: siteUrl() ? { canonical: "/" } : undefined,
};
export default function HomePage() {
  return <VisualHome />;
}
