'use client';
import Image, { type ImageProps } from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type MediaImageProps = Omit<ImageProps, 'src'> & {
  src: string;
  hint?: string;
};

export function MediaImage({ src, hint, alt, ...props }: MediaImageProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === src);
  
  const imageUrl = placeholder ? placeholder.imageUrl : `/fallback.jpg`;
  const imageHint = hint || placeholder?.imageHint;

  return (
    <Image
      src={imageUrl}
      alt={alt}
      {...props}
      data-ai-hint={imageHint}
    />
  );
}
