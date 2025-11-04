import { siteConfig } from "@/config/site";

export function metaDefaults({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return {
    title: title ?? siteConfig.name,
    description: description ?? siteConfig.description,
  };
}
