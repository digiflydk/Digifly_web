import type { DesignSettings, Navigation, HomePage, CaseDoc, Page, RichTextContent } from './types';
import { PlaceHolderImages } from './placeholder-images';

// This file used to contain mock/fallback data.
// It has been removed to ensure the app relies on a live Firestore connection.
// The remaining `getImage` function is a utility for placeholder data that may still be used in default schema values.

function getImage(id: string) {
  const image = PlaceHolderImages.find(img => img.id === id);
  return {
    src: image?.imageUrl || `https://picsum.photos/seed/${id}/800/600`,
    alt: image?.description || 'Placeholder image',
    hint: image?.imageHint,
  };
}
