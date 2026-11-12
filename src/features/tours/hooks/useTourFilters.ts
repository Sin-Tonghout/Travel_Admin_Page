import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { tourCategories } from "@/features/tours/lib/constants";
import { destinationNames } from "@/mocks/destinations";
import type { TourCategory, TourFilters } from "@/types/tour";

export function useTourFilters() {
  const [params, setParams] = useSearchParams();

  const statusParam = params.get("status");
  const destinationParam = params.get("destination");
  const categoryParam = params.get("category");

  const status = statusParam === "published" || statusParam === "draft" ? statusParam : undefined;
  const destination = destinationParam && destinationNames.includes(destinationParam) ? destinationParam : undefined;
  const category = tourCategories.some((c) => c.value === categoryParam) ? (categoryParam as TourCategory) : undefined;

  const filters = useMemo<TourFilters>(() => ({ status, destination, category }), [status, destination, category]);

  const update = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setParams(next, { replace: true });
  };

  return {
    filters,
    status,
    destination,
    category,
    activeCount: [status, destination, category].filter(Boolean).length,
    setStatus: (value: "published" | "draft" | undefined) => update({ status: value }),
    setDestination: (value: string | undefined) => update({ destination: value }),
    setCategory: (value: TourCategory | undefined) => update({ category: value }),
    clear: () => setParams(new URLSearchParams(), { replace: true }),
  };
}

export type TourFilterState = ReturnType<typeof useTourFilters>;