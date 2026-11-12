import type { TourImage } from "@/types/tour";

export const imageSrc = (image: TourImage): string => image.url;
export const imageAlt = (image: TourImage, fallback: string): string =>
  (image as { alt?: string }).alt || fallback;