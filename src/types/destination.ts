import type { TourImage } from "@/types/tour";

export interface Destination {
  id: string;
  name: string;
  /** Province or region, e.g. "Siem Reap Province". */
  region: string;
  description: string;
  highlights: string[];
  /** Free text, e.g. "November to March". */
  bestSeason: string;
  latitude: number;
  longitude: number;
  /** The first image is the cover. */
  images: TourImage[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationListItem extends Destination {
  tourCount: number;
}

/** What the create and edit forms submit. */
export type DestinationInput = Omit<Destination, "id" | "createdAt" | "updatedAt">;

export interface DestinationFilters {
  status?: "published" | "draft";
}