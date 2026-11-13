import { eachDayOfInterval, endOfMonth, format, parseISO, startOfMonth } from "date-fns";
import { clearOverride, getOverride, setOverride } from "@/features/availability/lib/overrides";
import { snapshotBookings } from "@/features/bookings/services/bookingService";
import { tours } from "@/mocks/tours";
import { ApiError } from "@/services/api-error";
import type { AvailabilityTour, DayAvailability, DayAvailabilityInput } from "@/types/availability";
import type { BookingRecord } from "@/types/booking";
import type { Tour } from "@/types/tour";

// Mock "database". Phase 10 replaces these functions with API calls.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const today = () => format(new Date(), "yyyy-MM-dd");

function tourOrThrow(id: string): Tour {
  const tour = tours.find((t) => t.id === id);
  if (!tour) throw new ApiError(404, `Tour ${id} was not found.`);
  return tour;
}

function assertDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parseISO(date).getTime())) {
    throw new ApiError(422, "Enter a valid date.");
  }
}

function buildDay(tour: Tour, date: string, bookingsOnDate: BookingRecord[]): DayAvailability {
  const override = getOverride(tour.id, date);
  const active = bookingsOnDate.filter((b) => b.status !== "cancelled");
  return {
    date,
    capacity: override?.capacity ?? tour.capacity,
    defaultCapacity: tour.capacity,
    booked: active.reduce((sum, b) => sum + b.adults + b.children, 0),
    blocked: override?.blocked ?? false,
    note: override?.note ?? "",
    hasOverride: Boolean(override),
    bookings: bookingsOnDate
      .map((b) => ({ id: b.id, customer: b.customer, travelers: b.adults + b.children, status: b.status }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  };
}

function bookingsFor(tourId: string, date?: string): BookingRecord[] {
  return snapshotBookings().filter((b) => b.tourId === tourId && (!date || b.date === date));
}

export async function listAvailabilityTours(): Promise<AvailabilityTour[]> {
  await delay(200);
  return tours
    .filter((t) => t.published)
    .map((t) => ({ id: t.id, name: t.name, capacity: t.capacity }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getMonthAvailability(tourId: string, month: string): Promise<DayAvailability[]> {
  await delay();
  const tour = tourOrThrow(tourId);
  if (!/^\d{4}-\d{2}$/.test(month)) throw new ApiError(422, "Enter a valid month.");

  const start = startOfMonth(parseISO(`${month}-01`));
  const byDate = new Map<string, BookingRecord[]>();
  for (const b of bookingsFor(tourId)) byDate.set(b.date, [...(byDate.get(b.date) ?? []), b]);

  return eachDayOfInterval({ start, end: endOfMonth(start) }).map((d) => {
    const date = format(d, "yyyy-MM-dd");
    return buildDay(tour, date, byDate.get(date) ?? []);
  });
}

export async function setDayAvailability(
  tourId: string,
  date: string,
  input: DayAvailabilityInput,
): Promise<DayAvailability> {
  await delay();
  const tour = tourOrThrow(tourId);
  assertDate(date);
  if (date < today()) throw new ApiError(422, "Past dates can't be edited.");
  if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > 500) {
    throw new ApiError(422, "Capacity must be a whole number between 1 and 500.");
  }

  const day = buildDay(tour, date, bookingsFor(tourId, date));
  const activeCount = day.bookings.filter((b) => b.status !== "cancelled").length;
  if (input.blocked && activeCount > 0) {
    throw new ApiError(
      409,
      `${activeCount} active ${activeCount === 1 ? "booking is" : "bookings are"} on this date. Cancel or move them before blocking it.`,
    );
  }
  if (input.capacity < day.booked) {
    throw new ApiError(422, `${day.booked} seats are already booked, so the capacity can't go below that.`);
  }

  const note = input.note.trim();
  if (!input.blocked && input.capacity === tour.capacity && !note) {
    clearOverride(tourId, date); // back to the defaults, nothing worth storing
  } else {
    setOverride(tourId, date, {
      blocked: input.blocked,
      capacity: input.capacity === tour.capacity ? undefined : input.capacity,
      note,
    });
  }
  return buildDay(tour, date, bookingsFor(tourId, date));
}

export async function clearDayAvailability(tourId: string, date: string): Promise<DayAvailability> {
  await delay();
  const tour = tourOrThrow(tourId);
  assertDate(date);
  if (date < today()) throw new ApiError(422, "Past dates can't be edited.");
  clearOverride(tourId, date);
  return buildDay(tour, date, bookingsFor(tourId, date));
}