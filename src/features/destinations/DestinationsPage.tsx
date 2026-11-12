import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { FilterBar } from "@/components/ui/filter-bar/FilterBar";
import { Select } from "@/components/ui/select/Select";
import { DeleteDestinationDialog } from "@/features/destinations/components/DeleteDestinationDialog";
import { DestinationCard } from "@/features/destinations/components/DestinationCard";
import { buildDestinationColumns } from "@/features/destinations/components/destinationColumns";
import { useDestinationFilters } from "@/features/destinations/hooks/useDestinationFilters";
import { useDestinations } from "@/features/destinations/hooks/useDestinations";
import { cn } from "@/lib/utils";
import type { DestinationListItem } from "@/types/destination";

const NO_DESTINATIONS: DestinationListItem[] = [];

export function DestinationsPage() {
  const navigate = useNavigate();
  const filterState = useDestinationFilters();
  const { data, isLoading, isError, isFetching, refetch } = useDestinations(filterState.filters);
  const [deleteTarget, setDeleteTarget] = useState<DestinationListItem | null>(null);
  const columns = useMemo(() => buildDestinationColumns(setDeleteTarget), []);

  const filtered = filterState.activeCount > 0;

  return (
    <>
      <PageHeader
        title="Destinations"
        description="The places your tours go to."
        actions={
          <Button asChild>
            <Link to="/admin/destinations/new">
              <Plus className="size-4" />
              Add destination
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <FilterBar activeCount={filterState.activeCount} onClear={filterState.clear}>
          <div className="w-44">
            <Select
              value={filterState.status ?? "all"}
              onValueChange={(v) => filterState.setStatus(v === "all" ? undefined : (v as "published" | "draft"))}
              options={[
                { value: "all", label: "All statuses" },
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
              ]}
            />
          </div>
        </FilterBar>

        {isError ? (
          <ErrorState
            title="We couldn't load the destinations"
            description="Check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <div aria-busy={isFetching} className={cn("transition-opacity duration-150", isFetching && !isLoading && "opacity-60")}>
            <DataTable<DestinationListItem>
              columns={columns}
              data={data ?? NO_DESTINATIONS}
              loading={isLoading}
              pageSize={10}
              searchPlaceholder="Search by destination or region"
              emptyTitle={filtered ? "No destinations match this filter" : "No destinations yet"}
              emptyDescription={filtered ? "Try clearing the filter." : "Add your first destination to get started."}
              onRowClick={(row) => navigate(`/admin/destinations/${row.id}`)}
              renderCard={(destination) => <DestinationCard destination={destination} onDelete={setDeleteTarget} />}
            />
          </div>
        )}
      </div>

      <DeleteDestinationDialog destination={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </>
  );
}