import { destinations, syncDestinationNames } from "@/mocks/destinations";
import { tours } from "@/mocks/tours";
import { ApiError } from "@/services/api-error";
import type { Destination, DestinationFilters, DestinationInput, DestinationListItem } from "@/types/destination";

// Mock "database": mutates the shared arrays in place. Phase 10 replaces these functions with API calls.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => structuredClone(value);

function find(id: string): Destination {
  const destination = destinations.find((d) => d.id === id);
  if (!destination) throw new ApiError(404, `Destination ${id} was not found.`);
  return destination;
}

const toursIn = (name: string) => tours.filter((t) => t.destination === name).length;

function withCounts(list: Destination[]): DestinationListItem[] {
  return list.map((d) => ({ ...clone(d), tourCount: toursIn(d.name) }));
}

function assertPublishable(d: Pick<Destination, "description" | "images">) {
  if (d.description.trim().length < 20) {
    throw new ApiError(409, "Add a description (at least 20 characters) before publishing.");
  }
  if (d.images.length < 1) {
    throw new ApiError(409, "Add at least one image before publishing.");
  }
}

function validate(input: DestinationInput, existingId?: string) {
  const name = input.name.trim();
  if (name.length < 2) throw new ApiError(422, "Enter a destination name (at least 2 characters).");
  if (input.region.trim().length < 2) throw new ApiError(422, "Enter the province or region.");
  if (!Number.isFinite(input.latitude) || input.latitude < -90 || input.latitude > 90) {
    throw new ApiError(422, "Latitude must be a number between -90 and 90.");
  }
  if (!Number.isFinite(input.longitude) || input.longitude < -180 || input.longitude > 180) {
    throw new ApiError(422, "Longitude must be a number between -180 and 180.");
  }
  if (destinations.some((d) => d.id !== existingId && d.name.toLowerCase() === name.toLowerCase())) {
    throw new ApiError(409, "A destination with this name already exists.");
  }
  if (input.published) assertPublishable(input);
}

export async function listDestinations(filters: DestinationFilters = {}): Promise<DestinationListItem[]> {
  await delay();
  const result = destinations
    .filter((d) => !filters.status || (filters.status === "published") === d.published)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return withCounts(result);
}

export async function getDestination(id: string): Promise<DestinationListItem> {
  await delay();
  return withCounts([find(id)])[0];
}

export async function createDestination(input: DestinationInput): Promise<Destination> {
  await delay();
  validate(input);
  const nextNumber = Math.max(0, ...destinations.map((d) => Number(d.id.replace("d", "")) || 0)) + 1;
  const now = new Date().toISOString();

  const destination: Destination = {
    ...clone(input),
    name: input.name.trim(),
    region: input.region.trim(),
    id: `d${nextNumber}`,
    createdAt: now,
    updatedAt: now,
  };
  destinations.push(destination);
  syncDestinationNames();
  return clone(destination);
}

export async function updateDestination(id: string, input: DestinationInput): Promise<Destination> {
  await delay();
  const existing = find(id);
  validate(input, id);

  const oldName = existing.name;
  const newName = input.name.trim();
  Object.assign(existing, clone(input), {
    name: newName,
    region: input.region.trim(),
    updatedAt: new Date().toISOString(),
  });

  // Tours refer to destinations by name, so a rename has to carry over to them.
  if (oldName !== newName) {
    tours.forEach((t) => {
      if (t.destination === oldName) t.destination = newName;
    });
  }
  syncDestinationNames();
  return clone(existing);
}

export async function setDestinationPublished(id: string, published: boolean): Promise<Destination> {
  await delay();
  const destination = find(id);
  if (published) assertPublishable(destination);
  destination.published = published;
  if (!published) destination.featured = false;
  destination.updatedAt = new Date().toISOString();
  return clone(destination);
}

export async function setDestinationFeatured(id: string, featured: boolean): Promise<Destination> {
  await delay();
  const destination = find(id);
  if (featured && !destination.published) {
    throw new ApiError(409, "Only published destinations can be featured.");
  }
  destination.featured = featured;
  destination.updatedAt = new Date().toISOString();
  return clone(destination);
}

export async function deleteDestination(id: string): Promise<void> {
  await delay();
  const destination = find(id);
  const count = toursIn(destination.name);
  if (count > 0) {
    throw new ApiError(409, `${count} ${count === 1 ? "tour uses" : "tours use"} this destination. Move or delete them first.`);
  }
  destinations.splice(destinations.indexOf(destination), 1);
  syncDestinationNames();
}