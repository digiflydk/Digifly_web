import Image, { type ImageProps } from "next/image";

type MediaImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt: string;
  className?: string;
  hint?: string;
};

export function MediaImage({ src, alt, className="", hint, ...props }: MediaImageProps) {
  const finalSrc = src.startsWith('http') ? src : `/media/${src}`;
  
  const imageProps: ImageProps = {
    src: finalSrc,
    alt: alt || "Image",
    className: `object-cover ${className}`,
    ...props
  };

  if (hint) {
    // @ts-ignore
    imageProps['data-ai-hint'] = hint;
  }
  
  return <Image {...imageProps} />;
}
