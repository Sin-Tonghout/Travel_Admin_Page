import { FilterBar } from "@/components/ui/filter-bar/FilterBar";
import { Select } from "@/components/ui/select/Select";
import type { TourFilterState } from "@/features/tours/hooks/useTourFilters";
import { tourCategories } from "@/features/tours/lib/constants";
import { destinationNames } from "@/mocks/destinations";
import type { TourCategory } from "@/types/tour";

export function TourFiltersBar({ state }: { state: TourFilterState }) {
  const { status, destination, category, activeCount, setStatus, setDestination, setCategory, clear } = state;

  return (
    <FilterBar activeCount={activeCount} onClear={clear}>
      <div className="w-44">
        <Select
          value={status ?? "all"}
          onValueChange={(v) => setStatus(v === "all" ? undefined : (v as "published" | "draft"))}
          options={[
            { value: "all", label: "All statuses" },
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" },
          ]}
        />
      </div>
      <div className="w-48">
        <Select
          value={destination ?? "all"}
          onValueChange={(v) => setDestination(v === "all" ? undefined : v)}
          options={[
            { value: "all", label: "All destinations" },
            ...destinationNames.map((d) => ({ value: d, label: d })),
          ]}
        />
      </div>
      <div className="w-44">
        <Select
          value={category ?? "all"}
          onValueChange={(v) => setCategory(v === "all" ? undefined : (v as TourCategory))}
          options={[{ value: "all", label: "All categories" }, ...tourCategories]}
        />
      </div>
    </FilterBar>
  );
}