import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { CustomerFilters, CustomerStatus } from "@/types/customer";

type Segment = NonNullable<CustomerFilters["segment"]>;

export function useCustomerFilters() {
  const [params, setParams] = useSearchParams();
  const statusParam = params.get("status");
  const segmentParam = params.get("segment");
  const status: CustomerStatus | undefined = statusParam === "active" || statusParam === "blocked" ? statusParam : undefined;
  const segment: Segment | undefined = segmentParam === "new" || segmentParam === "returning" ? segmentParam : undefined;

  const filters = useMemo<CustomerFilters>(() => ({ status, segment }), [status, segment]);

  const update = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  return {
    filters,
    status,
    segment,
    activeCount: (status ? 1 : 0) + (segment ? 1 : 0),
    setStatus: (value: CustomerStatus | undefined) => update("status", value),
    setSegment: (value: Segment | undefined) => update("segment", value),
    clear: () => setParams(new URLSearchParams(), { replace: true }),
  };
}

export type CustomerFilterState = ReturnType<typeof useCustomerFilters>;