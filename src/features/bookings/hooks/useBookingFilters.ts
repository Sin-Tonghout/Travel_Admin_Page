import { format } from "date-fns";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";
import { bookingStatuses, paymentOptions } from "@/features/bookings/lib/workflow";
import type { BookingFilters, BookingStatus } from "@/types/booking";
import type { PaymentStatus } from "@/types/payment";

const toParam = (d: Date) => format(d, "yyyy-MM-dd");

export function useBookingFilters() {
  const [params, setParams] = useSearchParams();

  const statusParam = params.get("status");
  const paymentParam = params.get("payment");
  const from = params.get("from") ?? undefined;
  const to = params.get("to") ?? undefined;

  const statuses = useMemo(
    () =>
      (statusParam?.split(",") ?? []).filter((s): s is BookingStatus =>
        bookingStatuses.includes(s as BookingStatus),
      ),
    [statusParam],
  );
  const payment = paymentOptions.some((p) => p.value === paymentParam)
    ? (paymentParam as PaymentStatus)
    : undefined;

  const filters = useMemo<BookingFilters>(() => ({ status: statuses, payment, from, to }), [statuses, payment, from, to]);

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  return {
    filters,
    statuses,
    payment,
    from,
    to,
    activeCount: (statuses.length ? 1 : 0) + (payment ? 1 : 0) + (from || to ? 1 : 0),
    setStatuses: (value: BookingStatus[]) => update({ status: value.length ? value.join(",") : undefined }),
    setPayment: (value: PaymentStatus | undefined) => update({ payment: value }),
    setDates: (range: DateRange | undefined) =>
      update({ from: range?.from ? toParam(range.from) : undefined, to: range?.to ? toParam(range.to) : undefined }),
    clear: () => setParams(new URLSearchParams(), { replace: true }),
  };
}

export type BookingFilterState = ReturnType<typeof useBookingFilters>;