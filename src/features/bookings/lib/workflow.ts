import { format } from "date-fns";
import type { BookingRecord, BookingStatus } from "@/types/booking";
import type { PaymentStatus } from "@/types/payment";

export const bookingStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export const bookingStatusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const paymentOptions: { value: PaymentStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Payment pending" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

/** Which statuses a booking may move to from each status. */
export const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export const isEditable = (booking: Pick<BookingRecord, "status">) =>
  booking.status === "pending" || booking.status === "confirmed";

/**
 * Returns why a booking can't move to `next` right now, or null when it can.
 * The mock service uses this too, standing in for the rules a real backend enforces.
 */
export function transitionBlocker(
  booking: Pick<BookingRecord, "status" | "payment" | "date">,
  next: BookingStatus,
): string | null {
  if (!allowedTransitions[booking.status].includes(next)) {
    return `A ${bookingStatusLabels[booking.status].toLowerCase()} booking can't become ${bookingStatusLabels[next].toLowerCase()}.`;
  }
  if (next === "confirmed" && booking.payment !== "paid") {
    return "Verify the payment before confirming this booking.";
  }
  if (next === "completed" && booking.date > format(new Date(), "yyyy-MM-dd")) {
    return "A booking can only be completed on or after its travel date.";
  }
  return null;
}