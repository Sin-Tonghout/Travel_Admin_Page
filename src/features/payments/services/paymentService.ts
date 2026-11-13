import { addHours, format, parseISO } from "date-fns";
import { markBookingPaid, recordPaymentEvent, snapshotBookings } from "@/features/bookings/services/bookingService";
import { ApiError } from "@/services/api-error";
import type { BookingEvent, BookingRecord } from "@/types/booking";
import type {
  PaymentEvent,
  PaymentFilters,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  PaymentSummary,
  Refund,
  RefundInput,
} from "@/types/payment";

// Mock "database": payments are derived from bookings, so a booking's payment status
// and its payment record can never disagree. Phase 10 replaces these functions with API calls.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));
const round2 = (n: number) => Math.round(n * 100) / 100;
const usd = (n: number) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

// Refunds issued through the admin. Older refunded bookings get one synthesized refund instead.
const refundStore = new Map<string, Refund[]>();

// Card appears twice so it is the most common method.
const METHODS: PaymentMethod[] = ["card", "bank_transfer", "khqr", "card", "cash"];

function hash(value: string): number {
  let h = 5381;
  for (const char of value) h = ((h * 33) ^ char.charCodeAt(0)) >>> 0;
  return h;
}

const paymentIdOf = (bookingId: string) => `PAY-${bookingId.replace("BK-", "")}`;

function refundsFor(b: BookingRecord, id: string): Refund[] {
  const stored = refundStore.get(id);
  if (stored?.length) return stored;
  if (b.payment !== "refunded") return [];
  const cancelled = b.history.find((e) => e.type === "status" && e.title === "Booking cancelled");
  return [
    {
      id: `${id}-R0`,
      at: cancelled?.at ?? b.createdAt,
      amount: b.total,
      reason: cancelled?.detail ?? "Booking cancelled",
      actor: cancelled?.actor ?? "System",
    },
  ];
}

function buildTimeline(b: BookingRecord, refunds: Refund[], verified?: BookingEvent): PaymentEvent[] {
  const events: PaymentEvent[] = [
    { id: `${b.id}-p0`, at: b.createdAt, title: "Payment requested", detail: usd(b.total), actor: "Online booking form" },
  ];
  if (b.payment === "failed") {
    events.push({
      id: `${b.id}-pf`,
      at: addHours(parseISO(b.createdAt), 1).toISOString(),
      title: "Payment attempt failed",
      actor: "Payment gateway",
    });
  }
  if (verified) {
    events.push({ id: verified.id, at: verified.at, title: "Payment verified", actor: verified.actor });
  }
  for (const r of refunds) {
    events.push({
      id: r.id,
      at: r.at,
      title: r.amount >= b.total ? "Full refund issued" : "Partial refund issued",
      detail: `${usd(r.amount)} · ${r.reason}`,
      actor: r.actor,
    });
  }
  return events.sort((a, b2) => a.at.localeCompare(b2.at));
}

function toRecord(b: BookingRecord): PaymentRecord {
  const id = paymentIdOf(b.id);
  const refunds = refundsFor(b, id);
  const verified = b.history.find((e) => e.type === "payment" && e.title === "Payment verified");
  const settled = b.payment === "paid" || b.payment === "refunded";
  return {
    id,
    reference: `TXN-${hash(b.id).toString(36).toUpperCase().padStart(8, "0").slice(0, 8)}`,
    bookingId: b.id,
    bookingStatus: b.status,
    customer: b.customer,
    customerEmail: b.customerEmail,
    tour: b.tour,
    destination: b.destination,
    travelDate: b.date,
    adults: b.adults,
    children: b.children,
    amount: b.total,
    refundedAmount: round2(refunds.reduce((sum, r) => sum + r.amount, 0)),
    refunds,
    timeline: buildTimeline(b, refunds, verified),
    status: b.payment,
    method: METHODS[hash(`method-${b.id}`) % METHODS.length],
    date: settled && verified ? verified.at : b.createdAt,
  };
}

const all = () => snapshotBookings().map(toRecord);

function findOrThrow(id: string): PaymentRecord {
  const payment = all().find((p) => p.id === id);
  if (!payment) throw new ApiError(404, `Payment ${id} was not found.`);
  return payment;
}

function applyFilters(list: PaymentRecord[], filters: PaymentFilters): PaymentRecord[] {
  return list
    .filter((p) => !filters.status || p.status === filters.status)
    .filter((p) => !filters.method || p.method === filters.method)
    .filter((p) => {
      const day = format(parseISO(p.date), "yyyy-MM-dd");
      return (!filters.from || day >= filters.from) && (!filters.to || day <= filters.to);
    });
}

export async function listPayments(filters: PaymentFilters = {}): Promise<PaymentRecord[]> {
  await delay();
  return applyFilters(all(), filters).sort((a, b) => b.date.localeCompare(a.date));
}

/** Totals per status. The status filter is ignored so every tile always shows its own total. */
export async function getPaymentSummary(filters: PaymentFilters = {}): Promise<PaymentSummary> {
  await delay();
  const byStatus: PaymentSummary["byStatus"] = {
    paid: { count: 0, amount: 0 },
    pending: { count: 0, amount: 0 },
    failed: { count: 0, amount: 0 },
    refunded: { count: 0, amount: 0 },
  };
  for (const p of applyFilters(all(), { ...filters, status: undefined })) {
    const tile = byStatus[p.status as PaymentStatus];
    tile.count += 1;
    tile.amount += p.amount;
  }
  return { byStatus };
}

export async function getPayment(id: string): Promise<PaymentRecord> {
  await delay();
  return findOrThrow(id);
}

export async function markPaymentPaid(id: string, actor: string): Promise<PaymentRecord> {
  const payment = findOrThrow(id);
  await markBookingPaid(payment.bookingId, actor); // validates that the payment is pending or failed
  return findOrThrow(id);
}

export async function refundPayment(id: string, input: RefundInput, actor: string): Promise<PaymentRecord> {
  await delay();
  const payment = findOrThrow(id);

  if (payment.status !== "paid") throw new ApiError(409, "Only paid payments can be refunded.");

  const remaining = round2(payment.amount - payment.refundedAmount);
  const amount = round2(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new ApiError(422, "Enter a refund amount greater than 0.");
  if (amount > remaining) throw new ApiError(422, `You can refund at most ${usd(remaining)}.`);
  if (input.reason.trim().length < 3) throw new ApiError(422, "A reason is required to refund a payment.");

  const full = amount === remaining;
  if (full && payment.bookingStatus !== "cancelled") {
    throw new ApiError(
      409,
      "Cancel the booking before refunding the remaining balance in full. A partial refund keeps the booking active.",
    );
  }

  const stored = refundStore.get(id) ?? [];
  const refund: Refund = {
    id: `${id}-R${stored.length + 1}`,
    at: new Date().toISOString(),
    amount,
    reason: input.reason.trim(),
    actor,
  };
  refundStore.set(id, [...stored, refund]);

  recordPaymentEvent(
    payment.bookingId,
    actor,
    full ? "Payment refunded" : "Partial refund issued",
    `${usd(amount)} · ${refund.reason}`,
    full ? "refunded" : undefined,
  );
  return findOrThrow(id);
}