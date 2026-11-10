import type { Booking } from "@/types/booking";

export const bookings: Booking[] = [
  { id: "BK-1001", customer: "Jane Doe", tour: "Angkor Sunrise Tour", date: "2026-11-12", total: 420, status: "confirmed", payment: "paid" },
  { id: "BK-1002", customer: "Liam Chen", tour: "Tonle Sap Village", date: "2026-11-14", total: 180, status: "pending", payment: "pending" },
  { id: "BK-1003", customer: "Sofia Rossi", tour: "Kulen Mountain", date: "2026-11-15", total: 560, status: "confirmed", payment: "paid" },
  { id: "BK-1004", customer: "Noah Smith", tour: "Banteay Srei Day Trip", date: "2026-11-18", total: 240, status: "cancelled", payment: "refunded" },
  { id: "BK-1005", customer: "Mia Tanaka", tour: "Angkor Sunrise Tour", date: "2026-11-19", total: 840, status: "confirmed", payment: "paid" },
  { id: "BK-1006", customer: "Ethan Brown", tour: "Beng Mealea Explorer", date: "2026-11-21", total: 310, status: "pending", payment: "failed" },
  { id: "BK-1007", customer: "Ava Martin", tour: "Kulen Mountain",   date: "2026-10-22", total: 280, status: "completed", payment: "paid" },
  { id: "BK-1008", customer: "Lucas Weber", tour: "Tonle Sap Village", date: "2026-11-25", total: 360, status: "pending", payment: "pending" },
  { id: "BK-1009", customer: "Emma Wilson", tour: "Angkor Sunrise Tour", date: "2026-11-27", total: 420, status: "confirmed", payment: "paid" },
  { id: "BK-1010", customer: "Oliver Kim", tour: "Banteay Srei Day Trip",  date: "2026-10-28", total: 480, status: "completed", payment: "paid" },
];

export const revenueSeries = [
  { label: "Jun", revenue: 12400 },
  { label: "Jul", revenue: 15800 },
  { label: "Aug", revenue: 14200 },
  { label: "Sep", revenue: 18900 },
  { label: "Oct", revenue: 22100 },
  { label: "Nov", revenue: 19600 },
];

export const bookingsSeries = [
  { label: "Jun", bookings: 38 },
  { label: "Jul", bookings: 46 },
  { label: "Aug", bookings: 41 },
  { label: "Sep", bookings: 58 },
  { label: "Oct", bookings: 67 },
  { label: "Nov", bookings: 59 },
];