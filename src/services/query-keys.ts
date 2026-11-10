export const queryKeys = {
  dashboard: (from: string, to: string, flags: string) => ["dashboard", from, to, flags] as const,
  bookings: {
    all: ["bookings"] as const,
    list: (filters: string) => ["bookings", "list", filters] as const,
    detail: (id: string) => ["bookings", "detail", id] as const,
  },
};