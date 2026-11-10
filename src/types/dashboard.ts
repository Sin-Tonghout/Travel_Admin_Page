import type { Booking } from "@/types/booking";

export interface Kpi {
  value: number;
  previous: number;
}

export interface SeriesPoint {
  label: string;
  revenue: number;
  bookings: number;
}

export interface DestinationStat {
  name: string;
  bookings: number;
  share: number;
}

export interface TourStat {
  id: string;
  name: string;
  destination: string;
  bookings: number;
  revenue: number;
  rating: number;
}

export interface CustomerSignup {
  id: string;
  name: string;
  email: string;
  joined: string;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
}

export interface DashboardData {
  period: { from: string; to: string };
  kpis: {
    totalBookings: Kpi;
    todayBookings: Kpi;
    revenue: Kpi;
    pendingPayments: Kpi;
    confirmedBookings: Kpi;
    cancelledBookings: Kpi;
  };
  series: SeriesPoint[];
  topDestinations: DestinationStat[];
  popularTours: TourStat[];
  recentBookings: Booking[];
  recentCustomers: CustomerSignup[];
  recentActivity: ActivityEntry[];
}