import { snapshotBookings } from "@/features/bookings/services/bookingService";
import { ApiError } from "@/services/api-error";
import type { BookingRecord } from "@/types/booking";
import type { CustomerFilters, CustomerListItem, CustomerStatus } from "@/types/customer";

// Mock "database". Customers are derived from bookings; only the profile extras live here.
// Phase 10 replaces these functions with API calls.
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

interface Profile {
  status: CustomerStatus;
  notes: string;
  name?: string;
  phone?: string;
}
const profiles = new Map<string, Profile>();

export interface CustomerContactInput {
  name: string;
  phone: string;
  notes: string;
}

const keyOf = (email: string) => email.trim().toLowerCase();

export function customerId(email: string): string {
  let hash = 5381;
  for (const char of keyOf(email)) hash = ((hash * 33) ^ char.charCodeAt(0)) >>> 0;
  return `cu-${hash.toString(36)}`;
}

function buildAll(): CustomerListItem[] {
  const groups = new Map<string, BookingRecord[]>();
  for (const booking of snapshotBookings()) {
    const key = keyOf(booking.customerEmail);
    if (!key) continue; // bookings without an email can't be tied to a customer
    groups.set(key, [...(groups.get(key) ?? []), booking]);
  }

  return [...groups.entries()].map(([key, list]) => {
    const sorted = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const latest = sorted[0];
    const profile = profiles.get(key);
    return {
      id: customerId(key),
      name: profile?.name ?? latest.customer,
      email: latest.customerEmail.trim(),
      phone: profile?.phone ?? latest.customerPhone,
      status: profile?.status ?? "active",
      notes: profile?.notes ?? "",
      bookingCount: list.length,
      totalSpent: list.filter((b) => b.payment === "paid").reduce((sum, b) => sum + b.total, 0),
      lastBookingAt: latest.createdAt,
      firstBookingAt: sorted[sorted.length - 1].createdAt,
    };
  });
}

function find(id: string): CustomerListItem {
  const customer = buildAll().find((c) => c.id === id);
  if (!customer) throw new ApiError(404, `Customer ${id} was not found.`);
  return customer;
}

function saveProfile(customer: CustomerListItem, patch: Partial<Profile>) {
  const key = keyOf(customer.email);
  const current: Profile = profiles.get(key) ?? { status: customer.status, notes: customer.notes };
  profiles.set(key, { ...current, ...patch });
}

export async function listCustomers(filters: CustomerFilters = {}): Promise<CustomerListItem[]> {
  await delay();
  return buildAll()
    .filter((c) => !filters.status || c.status === filters.status)
    .filter((c) => !filters.segment || (filters.segment === "new" ? c.bookingCount === 1 : c.bookingCount >= 2))
    .sort((a, b) => b.lastBookingAt.localeCompare(a.lastBookingAt));
}

export async function getCustomer(id: string): Promise<CustomerListItem> {
  await delay();
  return find(id);
}

export async function getCustomerBookings(id: string): Promise<BookingRecord[]> {
  await delay();
  const customer = find(id);
  const key = keyOf(customer.email);
  return snapshotBookings()
    .filter((b) => keyOf(b.customerEmail) === key)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function setCustomerStatus(id: string, status: CustomerStatus): Promise<CustomerListItem> {
  await delay();
  saveProfile(find(id), { status });
  return find(id);
}

export async function updateCustomer(id: string, input: CustomerContactInput): Promise<CustomerListItem> {
  await delay();
  const customer = find(id);
  const name = input.name.trim();
  if (name.length < 2) throw new ApiError(422, "Enter a name (at least 2 characters).");
  const phone = input.phone.trim();
  if (phone && !/^[+\d][\d\s().-]{5,}$/.test(phone)) {
    throw new ApiError(422, "Enter a valid phone number, or leave it empty.");
  }
  saveProfile(customer, { name, phone, notes: input.notes.trim() });
  return find(id);
}