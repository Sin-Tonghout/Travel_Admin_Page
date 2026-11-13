export const queryKeys = {
  dashboard: (from: string, to: string, flags: string) => ["dashboard", from, to, flags] as const,
  bookings: {
    all: ["bookings"] as const,
    list: (filters: string) => ["bookings", "list", filters] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
  },
  tours: {
    all: ["tours"] as const,
    list: (filters: string) => ["tours", "list", filters] as const,
    detail: (id: string) => ["tours", "detail", id] as const,
  },
  destinations: {
    all: ["destinations"] as const,
    list: (filters: string) => ["destinations", "list", filters] as const,
    detail: (id: string) => ["destinations", "detail", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: (filters: string) => ["customers", "list", filters] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
    bookings: (id: string) => ["customers", "bookings", id] as const,
  },
  payments: {
    all: ["payments"] as const,
    list: (filters: string) => ["payments", "list", filters] as const,
    detail: (id: string) => ["payments", "detail", id] as const,
    summary: (filters: string) => ["payments", "summary", filters] as const,
  },
  availability: {
    all: ["availability"] as const,
    tours: ["availability", "tours"] as const,
    month: (tourId: string, month: string) => ["availability", "month", tourId, month] as const,
  },
};