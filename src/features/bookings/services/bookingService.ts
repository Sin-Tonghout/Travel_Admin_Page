import { format } from "date-fns";
import { buildSeed } from "@/features/bookings/data/seed";
import { calculatePrice } from "@/features/bookings/lib/pricing";
import { transitionBlocker } from "@/features/bookings/lib/workflow";
import { tours } from "@/mocks/tours";
import { ApiError } from "@/services/api-error";
import type { BookingEvent, BookingFilters, BookingInput, BookingRecord, BookingStatus } from "@/types/booking";
import type { Tour } from "@/types/tour";
import type { PaymentStatus } from "@/types/payment";
import { getOverride } from "@/features/availability/lib/overrides";

// In-memory "database". It resets when the page reloads. Phase 10 replaces these functions with API calls.
let store: BookingRecord[] = buildSeed();

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => structuredClone(value);
const today = () => format(new Date(), "yyyy-MM-dd");

/** How many bookings each tour has. Used by the Tours module (mock only). */
export function countBookingsByTour(): Record<string, number> {
  return store.reduce<Record<string, number>>((acc, b) => {
    acc[b.tourId] = (acc[b.tourId] ?? 0) + 1;
    return acc;
  }, {});
}

/** A copy of every booking. Used by the Customers module (mock only). */
export function snapshotBookings(): BookingRecord[] {
  return clone(store);
}

/** Used by the Payments module (mock only): logs a payment event and can change the payment status. */
export function recordPaymentEvent(
  id: string,
  actor: string,
  title: string,
  detail?: string,
  payment?: PaymentStatus,
): BookingRecord {
  const record = find(id);
  if (payment) record.payment = payment;
  record.history.push(makeEvent("payment", title, actor, detail));
  return clone(record);
}

function makeEvent(type: BookingEvent["type"], title: string, actor: string, detail?: string): BookingEvent {
  return {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
    type,
    title,
    detail,
    actor,
  };
}

function find(id: string): BookingRecord {
  const record = store.find((b) => b.id === id);
  if (!record) throw new ApiError(404, `Booking ${id} was not found.`);
  return record;
}

/** Why a tour can't take `travelers` more people on `date`, or null when it can. */
function dateBlocker(tour: Tour, date: string, travelers: number, excludeId?: string): string | null {
  const override = getOverride(tour.id, date);
  if (override?.blocked) {
    return `${tour.name} is not available on ${date}.${override.note ? ` (${override.note})` : ""}`;
  }
  const capacity = override?.capacity ?? tour.capacity;
  const booked = store
    .filter((b) => b.tourId === tour.id && b.date === date && b.status !== "cancelled" && b.id !== excludeId)
    .reduce((sum, b) => sum + b.adults + b.children, 0);
  if (booked + travelers > capacity) {
    const left = Math.max(0, capacity - booked);
    return left === 0
      ? `${tour.name} is fully booked on ${date}.`
      : `Only ${left} ${left === 1 ? "seat is" : "seats are"} left on ${date}.`;
  }
  return null;
}

function validateInput(input: BookingInput, existing?: BookingRecord): { tour: Tour; total: number } {
  const tour = tours.find((t) => t.id === input.tourId && (t.published || existing?.tourId === t.id));
  if (!tour) throw new ApiError(422, "Choose a published tour.");
  if (input.adults < 1) throw new ApiError(422, "At least one adult is required.");
  const travelers = input.adults + input.children;
  if (travelers > tour.capacity) {
    throw new ApiError(422, `This tour holds at most ${tour.capacity} travelers.`);
  }
  const dateChanged = !existing || existing.date !== input.travelDate;
  if (dateChanged && input.travelDate < today()) {
    throw new ApiError(422, "The travel date can't be in the past.");
  }
  // Existing bookings are never rejected; only changes to the tour, date or group size are checked.
  const changed =
    !existing ||
    existing.tourId !== tour.id ||
    existing.date !== input.travelDate ||
    existing.adults + existing.children !== travelers;
  if (changed) {
    const blocker = dateBlocker(tour, input.travelDate, travelers, existing?.id);
    if (blocker) throw new ApiError(409, blocker);
  }
  return { tour, total: calculatePrice(tour, input.adults, input.children).total };
}

export async function listBookings(filters: BookingFilters = {}): Promise<BookingRecord[]> {
  await delay();
  const result = store
    .filter((b) => !filters.status?.length || filters.status.includes(b.status))
    .filter((b) => !filters.payment || b.payment === filters.payment)
    .filter((b) => !filters.from || b.date >= filters.from)
    .filter((b) => !filters.to || b.date <= filters.to)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return clone(result);
}

export async function getBooking(id: string): Promise<BookingRecord> {
  await delay();
  return clone(find(id));
}

export async function createBooking(input: BookingInput, actor: string): Promise<BookingRecord> {
  await delay();
  const { tour, total } = validateInput(input);
  const nextNumber = Math.max(...store.map((b) => Number(b.id.replace("BK-", "")))) + 1;

  const record: BookingRecord = {
    id: `BK-${nextNumber}`,
    customer: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    tour: tour.name,
    tourId: tour.id,
    destination: tour.destination,
    date: input.travelDate,
    adults: input.adults,
    children: input.children,
    total,
    status: "pending",
    payment: "pending",
    notes: input.notes,
    createdAt: new Date().toISOString(),
    history: [makeEvent("created", "Booking created", actor)],
  };
  store = [record, ...store];
  return clone(record);
}

export async function updateBooking(id: string, input: BookingInput, actor: string): Promise<BookingRecord> {
  await delay();
  const existing = find(id);
  if (existing.status !== "pending" && existing.status !== "confirmed") {
    throw new ApiError(409, `A ${existing.status} booking can't be edited.`);
  }
  const { tour, total } = validateInput(input, existing);

  const changes: string[] = [];
  if (existing.tourId !== tour.id) changes.push(`tour → ${tour.name}`);
  if (existing.date !== input.travelDate) changes.push(`travel date → ${input.travelDate}`);
  if (existing.adults !== input.adults || existing.children !== input.children) {
    changes.push(`travelers → ${input.adults} adult(s), ${input.children} child(ren)`);
  }
  if (
    existing.customer !== input.customerName ||
    existing.customerEmail !== input.customerEmail ||
    existing.customerPhone !== input.customerPhone
  ) {
    changes.push("customer details");
  }
  if (existing.notes !== input.notes) changes.push("notes");
  if (existing.total !== total) changes.push(`total → $${total}`);

  Object.assign(existing, {
    customer: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    tour: tour.name,
    tourId: tour.id,
    destination: tour.destination,
    date: input.travelDate,
    adults: input.adults,
    children: input.children,
    total,
    notes: input.notes,
  });
  if (changes.length > 0) {
    existing.history.push(makeEvent("edited", "Booking edited", actor, changes.join(", ")));
  }
  return clone(existing);
}

export async function changeBookingStatus(
  id: string,
  next: BookingStatus,
  actor: string,
  reason?: string,
): Promise<BookingRecord> {
  await delay();
  const record = find(id);

  const blocker = transitionBlocker(record, next);
  if (blocker) throw new ApiError(409, blocker);
  if (next === "cancelled" && (reason?.trim().length ?? 0) < 3) {
    throw new ApiError(422, "A reason is required to cancel a booking.");
  }

  record.status = next;
  const titles: Record<BookingStatus, string> = {
    pending: "Moved back to pending",
    confirmed: "Booking confirmed",
    completed: "Marked as completed",
    cancelled: "Booking cancelled",
  };
  record.history.push(makeEvent("status", titles[next], actor, next === "cancelled" ? reason?.trim() : undefined));
  return clone(record);
}

export async function markBookingPaid(id: string, actor: string): Promise<BookingRecord> {
  await delay();
  const record = find(id);
  if (record.payment !== "pending" && record.payment !== "failed") {
    throw new ApiError(409, "Only pending or failed payments can be marked as paid.");
  }
  record.payment = "paid";
  record.history.push(makeEvent("payment", "Payment verified", actor));
  return clone(record);
}