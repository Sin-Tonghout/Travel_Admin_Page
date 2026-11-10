import { eachDayOfInterval, format, getDay, getDayOfYear, startOfWeek, subDays } from "date-fns";
import { bookings } from "@/mocks/bookings";
import { recentActivity } from "@/mocks/activity";
import { recentCustomers } from "@/mocks/customers";
import { previousWindow } from "@/features/dashboard/lib/date-range";
import type { DateWindow, ResolvedRange } from "@/features/dashboard/lib/date-range";
import type { DashboardData, SeriesPoint } from "@/types/dashboard";

export interface DashboardOptions {
  /** Development helpers: ?fail=1 and ?empty=1 on the dashboard URL. */
  fail?: boolean;
  empty?: boolean;
}

/* ---------- Deterministic mock numbers (the same date always gives the same result) ---------- */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dayMetrics(date: Date) {
  const rand = rng(Number(format(date, "yyyyMMdd")));
  const dow = getDay(date);
  const weekend = dow === 0 || dow === 6 ? 1.25 : 1;
  const season = 1 + 0.25 * Math.sin((getDayOfYear(date) / 365) * Math.PI * 2);
  const bookingCount = Math.round((10 + rand() * 14) * weekend * season);
  const revenue = Math.round(bookingCount * (190 + rand() * 170));
  return {
    bookings: bookingCount,
    revenue,
    cancelled: Math.round(bookingCount * (0.06 + rand() * 0.07)),
    pendingRevenue: Math.round(revenue * (0.08 + rand() * 0.1)),
  };
}

function sumWindow(win: DateWindow) {
  return eachDayOfInterval({ start: win.from, end: win.to }).reduce(
    (acc, date) => {
      const m = dayMetrics(date);
      acc.bookings += m.bookings;
      acc.revenue += m.revenue;
      acc.cancelled += m.cancelled;
      acc.pendingRevenue += m.pendingRevenue;
      return acc;
    },
    { bookings: 0, revenue: 0, cancelled: 0, pendingRevenue: 0 },
  );
}

function buildSeries(from: Date, to: Date): SeriesPoint[] {
  const days = eachDayOfInterval({ start: from, end: to });

  // A single day is shown by hour.
  if (days.length === 1) {
    const m = dayMetrics(days[0]);
    const weights = Array.from({ length: 24 }, (_, h) => 0.15 + Math.max(0, Math.sin(((h - 5) / 18) * Math.PI)));
    const total = weights.reduce((a, b) => a + b, 0);
    return weights.map((w, h) => ({
      label: format(new Date(2000, 0, 1, h), "ha").toLowerCase(),
      revenue: Math.round((m.revenue * w) / total),
      bookings: Math.round((m.bookings * w) / total),
    }));
  }

  const granularity = days.length <= 31 ? "day" : days.length <= 120 ? "week" : "month";
  const multiYear = from.getFullYear() !== to.getFullYear();
  const buckets = new Map<string, SeriesPoint>();

  days.forEach((date) => {
    const m = dayMetrics(date);
    let key: string;
    let label: string;
    if (granularity === "day") {
      key = format(date, "yyyy-MM-dd");
      label = format(date, "MMM d");
    } else if (granularity === "week") {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      key = format(weekStart, "yyyy-MM-dd");
      label = format(weekStart, "MMM d");
    } else {
      key = format(date, "yyyy-MM");
      label = format(date, multiYear ? "MMM yy" : "MMM");
    }
    const bucket = buckets.get(key) ?? { label, revenue: 0, bookings: 0 };
    bucket.revenue += m.revenue;
    bucket.bookings += m.bookings;
    buckets.set(key, bucket);
  });

  return Array.from(buckets.values());
}

const destinationShares = [
  { name: "Siem Reap", share: 34 },
  { name: "Phnom Penh", share: 22 },
  { name: "Sihanoukville", share: 16 },
  { name: "Kampot", share: 12 },
  { name: "Battambang", share: 9 },
  { name: "Kep", share: 7 },
];

const tourShares = [
  { id: "t1", name: "Angkor Sunrise Tour", destination: "Siem Reap", share: 0.26, price: 420, rating: 4.9 },
  { id: "t2", name: "Kulen Mountain", destination: "Siem Reap", share: 0.18, price: 280, rating: 4.8 },
  { id: "t3", name: "Tonle Sap Village", destination: "Siem Reap", share: 0.15, price: 180, rating: 4.6 },
  { id: "t4", name: "Banteay Srei Day Trip", destination: "Siem Reap", share: 0.13, price: 240, rating: 4.7 },
  { id: "t5", name: "Beng Mealea Explorer", destination: "Siem Reap", share: 0.1, price: 310, rating: 4.5 },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Swap the body of this function for a real API call in Phase 10. */
export async function fetchDashboard(range: ResolvedRange, options: DashboardOptions = {}): Promise<DashboardData> {
  await delay(700);
  if (options.fail) throw new Error("Simulated network error");

  const period = { from: range.from.toISOString(), to: range.to.toISOString() };

  if (options.empty) {
    const zero = { value: 0, previous: 0 };
    return {
      period,
      kpis: {
        totalBookings: zero,
        todayBookings: zero,
        revenue: zero,
        pendingPayments: zero,
        confirmedBookings: zero,
        cancelledBookings: zero,
      },
      series: [],
      topDestinations: [],
      popularTours: [],
      recentBookings: [],
      recentCustomers: [],
      recentActivity: [],
    };
  }

  const current = sumWindow(range);
  const previous = sumWindow(previousWindow(range));
  const pendingCount = (n: number) => Math.round(n * 0.14);
  const confirmed = (s: typeof current) => Math.max(0, s.bookings - s.cancelled - pendingCount(s.bookings));

  const now = new Date();
  const today = dayMetrics(now).bookings;
  const yesterday = dayMetrics(subDays(now, 1)).bookings;

  return {
    period,
    kpis: {
      totalBookings: { value: current.bookings, previous: previous.bookings },
      todayBookings: { value: today, previous: yesterday },
      revenue: { value: current.revenue, previous: previous.revenue },
      pendingPayments: { value: current.pendingRevenue, previous: previous.pendingRevenue },
      confirmedBookings: { value: confirmed(current), previous: confirmed(previous) },
      cancelledBookings: { value: current.cancelled, previous: previous.cancelled },
    },
    series: buildSeries(range.from, range.to),
    topDestinations: destinationShares.map((d) => ({
      name: d.name,
      share: d.share,
      bookings: Math.round((current.bookings * d.share) / 100),
    })),
    popularTours: tourShares.map((t) => {
      const count = Math.round(current.bookings * t.share);
      return {
        id: t.id,
        name: t.name,
        destination: t.destination,
        bookings: count,
        revenue: count * t.price,
        rating: t.rating,
      };
    }),
    recentBookings: [...bookings].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 6),
    recentCustomers,
    recentActivity,
  };
}