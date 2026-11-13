import { format } from "date-fns";
import { useMemo } from "react";
import type { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";
import { paymentOptions } from "@/features/bookings/lib/workflow";
import { paymentMethods } from "@/features/payments/lib/methods";
import type { PaymentFilters, PaymentMethod, PaymentStatus } from "@/types/payment";

const toParam = (d: Date) => format(d, "yyyy-MM-dd");

export function usePaymentFilters() {
  const [params, setParams] = useSearchParams();

  const statusParam = params.get("status");
  const methodParam = params.get("method");
  const from = params.get("from") ?? undefined;
  const to = params.get("to") ?? undefined;

  const status = paymentOptions.some((p) => p.value === statusParam) ? (statusParam as PaymentStatus) : undefined;
  const method = paymentMethods.some((m) => m.value === methodParam) ? (methodParam as PaymentMethod) : undefined;

  const filters = useMemo<PaymentFilters>(() => ({ status, method, from, to }), [status, method, from, to]);
  /** What the summary tiles use: everything except the status filter. */
  const summaryFilters = useMemo<PaymentFilters>(() => ({ method, from, to }), [method, from, to]);

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  return {
    filters,
    summaryFilters,
    status,
    method,
    from,
    to,
    activeCount: (status ? 1 : 0) + (method ? 1 : 0) + (from || to ? 1 : 0),
    setStatus: (value: PaymentStatus | undefined) => update({ status: value }),
    setMethod: (value: PaymentMethod | undefined) => update({ method: value }),
    setDates: (range: DateRange | undefined) =>
      update({ from: range?.from ? toParam(range.from) : undefined, to: range?.to ? toParam(range.to) : undefined }),
    clear: () => setParams(new URLSearchParams(), { replace: true }),
  };
}

export type PaymentFilterState = ReturnType<typeof usePaymentFilters>;