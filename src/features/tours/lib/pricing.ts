import { tours } from "@/mocks/tours";
import type { BookingRecord } from "@/types/booking";
import type { Tour } from "@/types/tour";

export const DEFAULT_CHILD_DISCOUNT_PERCENT = 30;

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

type Priced = Pick<Tour, "price"> & Partial<Pick<Tour, "childDiscountPercent">>;

export function calculatePrice(tour: Priced, adults: number, children: number): PriceSummary {
  const discount = tour.childDiscountPercent ?? DEFAULT_CHILD_DISCOUNT_PERCENT;
  const childUnit = Math.round(tour.price * (1 - discount / 100));
  const lines: PriceLine[] = [];

  if (adults > 0) {
    lines.push({ label: "Adults", quantity: adults, unitPrice: tour.price, amount: adults * tour.price });
  }
  if (children > 0) {
    lines.push({
      label: discount > 0 ? `Children (${discount}% off)` : "Children",
      quantity: children,
      unitPrice: childUnit,
      amount: children * childUnit,
    });
  }
  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0) };
}

/**
 * Price lines for a saved booking. If the tour's price has changed since the booking was made,
 * the lines wouldn't add up to what the customer was charged, so show the stored total instead.
 */
export function priceForBooking(booking: Pick<BookingRecord, "tourId" | "adults" | "children" | "total">): PriceSummary {
  const fallback: PriceSummary = {
    lines: [{ label: "Booking total (price at time of booking)", quantity: 1, unitPrice: booking.total, amount: booking.total }],
    total: booking.total,
  };

  const tour = tours.find((t) => t.id === booking.tourId);
  if (!tour) return fallback;

  const summary = calculatePrice(tour, booking.adults, booking.children);
  return summary.total === booking.total ? summary : fallback;
}