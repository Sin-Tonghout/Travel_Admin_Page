import { tours } from "@/mocks/tours";
import type { BookingRecord } from "@/types/booking";
import type { Tour } from "@/types/tour";

export const CHILD_PRICE_RATE = 0.7;

export interface PriceLine {
  label: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PriceSummary {
  lines: PriceLine[];
  total: number;
}

export function calculatePrice(tour: Pick<Tour, "price">, adults: number, children: number): PriceSummary {
  const lines: PriceLine[] = [];
  const childUnit = Math.round(tour.price * CHILD_PRICE_RATE);

  if (adults > 0) {
    lines.push({ label: "Adults", quantity: adults, unitPrice: tour.price, amount: adults * tour.price });
  }
  if (children > 0) {
    lines.push({ label: "Children (30% off)", quantity: children, unitPrice: childUnit, amount: children * childUnit });
  }
  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0) };
}

/** Price lines for a saved booking. Falls back to a single line if the tour no longer exists. */
export function priceForBooking(booking: Pick<BookingRecord, "tourId" | "adults" | "children" | "total">): PriceSummary {
  const tour = tours.find((t) => t.id === booking.tourId);
  if (!tour) {
    return {
      lines: [{ label: "Booking total", quantity: 1, unitPrice: booking.total, amount: booking.total }],
      total: booking.total,
    };
  }
  return calculatePrice(tour, booking.adults, booking.children);
}