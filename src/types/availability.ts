import type { BookingStatus } from "./booking";

export interface DayBooking {
  id: string;
  customer: string;
  travelers: number;
  status: BookingStatus;
}

export interface DayAvailability {
  /** yyyy-MM-dd */
  date: string;
  /** Seats for this date: the override if there is one, otherwise the tour's default. */
  capacity: number;
  defaultCapacity: number;
  /** Seats taken by non-cancelled bookings. */
  booked: number;
  blocked: boolean;
  note: string;
  hasOverride: boolean;
  bookings: DayBooking[];
}

export interface DayAvailabilityInput {
  blocked: boolean;
  capacity: number;
  note: string;
}

export interface AvailabilityTour {
  id: string;
  name: string;
  capacity: number;
}