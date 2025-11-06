import Image, { type ImageProps } from "next/image";

type MediaImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt?: string | null;
  className?: string;
  hint?: string;
};

export function MediaImage({ src, alt, className = "", hint, ...props }: MediaImageProps) {
  const finalSrc = src?.startsWith?.("http") ? src : `/media/${src}`;
  const safeAlt = (alt && String(alt).trim().length > 0) ? String(alt) : "Image";

  const imageProps: ImageProps = {
    src: finalSrc,
    alt: safeAlt,
    className: `object-cover ${className}`,
    ...props,
  };

  if (hint) {
    // @ts-ignore data attribute for AI hinting
    imageProps["data-ai-hint"] = hint;
  }

  return <Image {...imageProps} />;
}
