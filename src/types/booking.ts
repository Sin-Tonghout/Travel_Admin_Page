import type { PaymentStatus } from "./payment";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

/** The summary shape used by the dashboard's recent bookings. */
export interface Booking {
  id: string;
  customer: string;
  tour: string;
  /** Travel date, yyyy-MM-dd. */
  date: string;
  total: number;
  status: BookingStatus;
  payment: PaymentStatus;
}

export type BookingEventType = "created" | "status" | "payment" | "edited";

export interface BookingEvent {
  id: string;
  /** ISO timestamp. */
  at: string;
  type: BookingEventType;
  title: string;
  detail?: string;
  actor: string;
}

/** The full record used by the Bookings module. */
export interface BookingRecord extends Booking {
  customerEmail: string;
  customerPhone: string;
  tourId: string;
  destination: string;
  adults: number;
  children: number;
  notes: string;
  /** ISO timestamp. */
  createdAt: string;
  history: BookingEvent[];
}

/** What the create and edit forms submit. */
export interface BookingInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tourId: string;
  /** yyyy-MM-dd */
  travelDate: string;
  adults: number;
  children: number;
  notes: string;
}

export interface BookingFilters {
  status?: BookingStatus[];
  payment?: PaymentStatus;
  /** Travel date range, yyyy-MM-dd. */
  from?: string;
  to?: string;
}