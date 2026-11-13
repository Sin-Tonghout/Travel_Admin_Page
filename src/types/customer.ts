export type CustomerStatus = "active" | "blocked";

export interface Customer {
  /** Stable id derived from the email address. */
  id: string;
  name: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  notes: string;
}

export interface CustomerListItem extends Customer {
  bookingCount: number;
  /** Sum of paid bookings. Refunded, pending and failed payments are not counted. */
  totalSpent: number;
  /** ISO timestamp of the most recent booking. */
  lastBookingAt: string;
  /** ISO timestamp of the first booking. */
  firstBookingAt: string;
}

export interface CustomerFilters {
  status?: CustomerStatus;
  /** new = one booking, returning = two or more. */
  segment?: "new" | "returning";
}