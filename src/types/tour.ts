export type TourCategory = "culture" | "adventure" | "nature" | "city" | "food";

export interface TourImage {
  id: string;
  url: string;
  caption: string;
}

export interface ItineraryItem {
  id: string;
  /** "Day 1", "05:30" … whatever suits the tour. */
  label: string;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  name: string;
  destination: string;
  category: TourCategory;
  description: string;
  highlights: string[];
  durationDays: number;
  /** Adult price in USD. */
  price: number;
  /** Percent taken off the adult price for children (0 to 90). */
  childDiscountPercent: number;
  /** Largest group the tour can take. */
  capacity: number;
  itinerary: ItineraryItem[];
  /** The first image is the cover. */
  images: TourImage[];
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourListItem extends Tour {
  bookingCount: number;
}

/** What the create and edit forms submit. */
export type TourInput = Omit<Tour, "id" | "createdAt" | "updatedAt">;

export interface TourFilters {
  status?: "published" | "draft";
  destination?: string;
  category?: TourCategory;
}