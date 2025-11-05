import Image, { type ImageProps } from "next/image";

type MediaImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt: string;
  className?: string;
};

export function MediaImage({ src, alt, className="", ...props }: MediaImageProps) {
  const finalSrc = src.startsWith('http') ? src : `/media/${src}`;
  return <Image src={finalSrc} alt={alt || "Image"} className={`object-cover ${className}`} {...props} />;
}
