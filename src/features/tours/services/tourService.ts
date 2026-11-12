import { countBookingsByTour } from "@/features/bookings/services/bookingService";
import { destinationNames } from "@/mocks/destinations";
import { tours } from "@/mocks/tours";
import { ApiError } from "@/services/api-error";
import type { Tour, TourFilters, TourInput, TourListItem } from "@/types/tour";

// Mock "database": this mutates the shared `tours` array in place, so the booking forms see changes too.
// Phase 10 replaces these functions with real API calls.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => structuredClone(value);

function find(id: string): Tour {
  const tour = tours.find((t) => t.id === id);
  if (!tour) throw new ApiError(404, `Tour ${id} was not found.`);
  return tour;
}

function withCounts(list: Tour[]): TourListItem[] {
  const counts = countBookingsByTour();
  return list.map((t) => ({ ...clone(t), bookingCount: counts[t.id] ?? 0 }));
}

function assertPublishable(t: Pick<Tour, "description" | "images">) {
  if (t.description.trim().length < 20) {
    throw new ApiError(409, "Add a description (at least 20 characters) before publishing.");
  }
  if (t.images.length < 1) {
    throw new ApiError(409, "Add at least one image before publishing.");
  }
}

function validate(input: TourInput, existingId?: string) {
  const name = input.name.trim();
  if (name.length < 3) throw new ApiError(422, "Enter a tour name (at least 3 characters).");
  if (!destinationNames.includes(input.destination)) throw new ApiError(422, "Choose a destination.");
  if (!(input.price >= 1)) throw new ApiError(422, "The price must be at least $1.");
  if (!(input.durationDays >= 1)) throw new ApiError(422, "The duration must be at least 1 day.");
  if (!(input.capacity >= 1)) throw new ApiError(422, "The capacity must be at least 1 traveler.");
  if (!(input.childDiscountPercent >= 0 && input.childDiscountPercent <= 90)) {
    throw new ApiError(422, "The child discount must be between 0% and 90%.");
  }
  if (tours.some((t) => t.id !== existingId && t.name.toLowerCase() === name.toLowerCase())) {
    throw new ApiError(409, "A tour with this name already exists.");
  }
  if (input.published) assertPublishable(input);
}

export async function listTours(filters: TourFilters = {}): Promise<TourListItem[]> {
  await delay();
  const result = tours
    .filter((t) => !filters.status || (filters.status === "published") === t.published)
    .filter((t) => !filters.destination || t.destination === filters.destination)
    .filter((t) => !filters.category || t.category === filters.category)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return withCounts(result);
}

export async function getTour(id: string): Promise<TourListItem> {
  await delay();
  return withCounts([find(id)])[0];
}

export async function createTour(input: TourInput): Promise<Tour> {
  await delay();
  validate(input);
  const nextNumber = Math.max(0, ...tours.map((t) => Number(t.id.replace("t", "")) || 0)) + 1;
  const now = new Date().toISOString();

  const tour: Tour = { ...clone(input), name: input.name.trim(), id: `t${nextNumber}`, createdAt: now, updatedAt: now };
  tours.push(tour);
  return clone(tour);
}

export async function updateTour(id: string, input: TourInput): Promise<Tour> {
  await delay();
  const existing = find(id);
  validate(input, id);
  Object.assign(existing, clone(input), { name: input.name.trim(), updatedAt: new Date().toISOString() });
  return clone(existing);
}

export async function setTourPublished(id: string, published: boolean): Promise<Tour> {
  await delay();
  const tour = find(id);
  if (published) assertPublishable(tour);
  tour.published = published;
  tour.updatedAt = new Date().toISOString();
  return clone(tour);
}

export async function setTourFeatured(id: string, featured: boolean): Promise<Tour> {
  await delay();
  const tour = find(id);
  if (featured && !tour.published) {
    throw new ApiError(409, "Only published tours can be featured.");
  }
  tour.featured = featured;
  tour.updatedAt = new Date().toISOString();
  return clone(tour);
}

export async function deleteTour(id: string): Promise<void> {
  await delay();
  const tour = find(id);
  const bookings = countBookingsByTour()[id] ?? 0;
  if (bookings > 0) {
    throw new ApiError(
      409,
      `This tour has ${bookings} ${bookings === 1 ? "booking" : "bookings"}. Unpublish it instead of deleting it.`,
    );
  }
  tours.splice(tours.indexOf(tour), 1);
}