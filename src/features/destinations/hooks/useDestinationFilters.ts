import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { DestinationFilters } from "@/types/destination";

export function useDestinationFilters() {
  const [params, setParams] = useSearchParams();
  const statusParam = params.get("status");
  const status = statusParam === "published" || statusParam === "draft" ? statusParam : undefined;

  const filters = useMemo<DestinationFilters>(() => ({ status }), [status]);

  const setStatus = (value: "published" | "draft" | undefined) => {
    const next = new URLSearchParams(params);
    if (value) next.set("status", value);
    else next.delete("status");
    setParams(next, { replace: true });
  };

  return {
    filters,
    status,
    activeCount: status ? 1 : 0,
    setStatus,
    clear: () => setParams(new URLSearchParams(), { replace: true }),
  };
}

export type DestinationFilterState = ReturnType<typeof useDestinationFilters>;