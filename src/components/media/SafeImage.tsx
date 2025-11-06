"use client";
import Image, { ImageProps } from "next/image";
import { safeAlt } from "@/lib/safe";

type Props = Omit<ImageProps, "alt"> & { alt?: string | null; titleFallback?: string };

export default function SafeImage({ alt, titleFallback, ...rest }: Props) {
  return <Image alt={safeAlt(alt, titleFallback)} {...rest} />;
}
