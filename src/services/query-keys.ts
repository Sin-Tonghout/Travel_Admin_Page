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
};