import type { BookingStatus } from "./booking";

export type PaymentStatus = "paid" | "pending" | "failed" | "refunded";

export type PaymentMethod = "card" | "bank_transfer" | "khqr" | "cash";

export interface Refund {
  id: string;
  /** ISO timestamp. */
  at: string;
  amount: number;
  reason: string;
  actor: string;
}

export interface PaymentEvent {
  id: string;
  /** ISO timestamp. */
  at: string;
  title: string;
  detail?: string;
  actor: string;
}

/** One payment per booking (mock). Phase 10 replaces this with real transactions. */
export interface PaymentRecord {
  /** e.g. PAY-1001, derived from the booking id. */
  id: string;
  /** Gateway-style reference, e.g. TXN-9F3K2A1B. */
  reference: string;
  bookingId: string;
  bookingStatus: BookingStatus;
  customer: string;
  customerEmail: string;
  tour: string;
  destination: string;
  /** yyyy-MM-dd */
  travelDate: string;
  adults: number;
  children: number;
  amount: number;
  /** Total refunded so far. */
  refundedAmount: number;
  refunds: Refund[];
  timeline: PaymentEvent[];
  status: PaymentStatus;
  method: PaymentMethod;
  /** ISO timestamp of the payment or, for unpaid bookings, of the booking. */
  date: string;
}

export interface RefundInput {
  amount: number;
  reason: string;
}

export interface PaymentFilters {
  status?: PaymentStatus;
  method?: PaymentMethod;
  /** Payment date range, yyyy-MM-dd. */
  from?: string;
  to?: string;
}

export interface PaymentSummary {
  byStatus: Record<PaymentStatus, { count: number; amount: number }>;
}