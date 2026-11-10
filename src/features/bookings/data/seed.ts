import { addDays, addHours, format, parseISO, subDays } from "date-fns";
import { calculatePrice } from "@/features/bookings/lib/pricing";
import { createRng } from "@/lib/random";
import { bookings as base } from "@/mocks/bookings";
import { tours } from "@/mocks/tours";
import type { BookingEvent, BookingRecord, BookingStatus } from "@/types/booking";
import type { PaymentStatus } from "@/types/payment";

const NAMES = [
  "Hana Yamada", "Peter Novak", "Isabelle Martin", "Omar Haddad", "Grace Liu", "Daniel Costa",
  "Aiko Sato", "Lucas Meyer", "Chloe Dubois", "Ravi Patel", "Emily Clark", "Marco Bianchi",
  "Sara Lindqvist", "Tom Becker", "Nina Petrova", "Jack Wilson", "Yuki Tanaka", "Olivia Brown",
  "Hugo Lambert", "Mei Chen", "Ben Carter", "Lena Fischer", "Diego Ramos", "Zoe Harris",
];
const ACTORS = ["Jordan Lee", "Sam Rivera", "Casey Park"];
const NOTES = ["", "", "", "Vegetarian meals please.", "Celebrating an anniversary.", "Needs a hotel pickup at 5:00.", "Traveling with a stroller."];
const TODAY = format(new Date(), "yyyy-MM-dd");

const emailFor = (name: string) => `${name.toLowerCase().replace(/[^a-z ]/g, "").trim().replace(/\s+/g, ".")}@example.com`;

function makePhone(rand: () => number) {
  const digits = (n: number) => Array.from({ length: n }, () => Math.floor(rand() * 10)).join("");
  return `+855 ${digits(2)} ${digits(3)} ${digits(3)}`;
}

function buildHistory(r: Omit<BookingRecord, "history">, rand: () => number): BookingEvent[] {
  const created = parseISO(r.createdAt);
  const actor = ACTORS[Math.floor(rand() * ACTORS.length)];
  const events: BookingEvent[] = [
    { id: `${r.id}-1`, at: r.createdAt, type: "created", title: "Booking created", actor: "Online booking form" },
  ];
  if (r.payment === "paid" || r.payment === "refunded") {
    events.push({ id: `${r.id}-2`, at: addHours(created, 5).toISOString(), type: "payment", title: "Payment verified", actor });
  }
  if (r.status === "confirmed" || r.status === "completed") {
    events.push({ id: `${r.id}-3`, at: addHours(created, 7).toISOString(), type: "status", title: "Booking confirmed", actor });
  }
  if (r.status === "completed") {
    events.push({
      id: `${r.id}-4`,
      at: addHours(parseISO(`${r.date}T00:00:00`), 30).toISOString(),
      type: "status",
      title: "Marked as completed",
      actor,
    });
  }
  if (r.status === "cancelled") {
    events.push({
      id: `${r.id}-5`,
      at: addHours(created, 30).toISOString(),
      type: "status",
      title: "Booking cancelled",
      detail: "Customer request",
      actor,
    });
  }
  return events;
}

function pickStatus(date: string, rand: () => number): BookingStatus {
  const r = rand();
  if (date < TODAY) return r < 0.7 ? "completed" : r < 0.85 ? "confirmed" : "cancelled";
  return r < 0.55 ? "confirmed" : r < 0.9 ? "pending" : "cancelled";
}

function pickPayment(status: BookingStatus, rand: () => number): PaymentStatus {
  const r = rand();
  switch (status) {
    case "completed":
    case "confirmed":
      return "paid";
    case "pending":
      return r < 0.7 ? "pending" : "failed";
    case "cancelled":
      return r < 0.5 ? "refunded" : "pending";
  }
}

export function buildSeed(): BookingRecord[] {
  const rand = createRng(20261110);
  const published = tours.filter((t) => t.published);

  // The first ten match the dashboard's recent bookings exactly.
  const fromMocks: BookingRecord[] = base.map((b, i) => {
    const tour = tours.find((t) => t.name === b.tour) ?? tours[0];
    const partial = {
      ...b,
      customerEmail: emailFor(b.customer),
      customerPhone: makePhone(rand),
      tourId: tour.id,
      destination: tour.destination,
      adults: Math.max(1, Math.round(b.total / tour.price)),
      children: 0,
      notes: i % 4 === 0 ? "Vegetarian meals please." : "",
      createdAt: subDays(parseISO(`${b.date}T09:00:00`), 5 + i * 2).toISOString(),
    };
    return { ...partial, history: buildHistory(partial, rand) };
  });

  const generated: BookingRecord[] = Array.from({ length: 24 }, (_, i) => {
    const name = NAMES[i % NAMES.length];
    const tour = published[Math.floor(rand() * published.length)];
    const adults = 1 + Math.floor(rand() * 4);
    const children = rand() < 0.3 ? 1 + Math.floor(rand() * 2) : 0;
    const date = format(addDays(parseISO("2026-09-05"), Math.floor(rand() * 105)), "yyyy-MM-dd");
    const status = pickStatus(date, rand);
    const partial = {
      id: `BK-${1011 + i}`,
      customer: name,
      customerEmail: emailFor(name),
      customerPhone: makePhone(rand),
      tour: tour.name,
      tourId: tour.id,
      destination: tour.destination,
      date,
      adults,
      children,
      total: calculatePrice(tour, adults, children).total,
      status,
      payment: pickPayment(status, rand),
      notes: NOTES[Math.floor(rand() * NOTES.length)],
      createdAt: subDays(parseISO(`${date}T09:00:00`), 3 + Math.floor(rand() * 25)).toISOString(),
    };
    return { ...partial, history: buildHistory(partial, rand) };
  });

  return [...fromMocks, ...generated];
}