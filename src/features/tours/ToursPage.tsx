import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { ErrorState } from "@/components/ui/empty-state/EmptyState";
import { DeleteTourDialog } from "@/features/tours/components/DeleteTourDialog";
import { TourCard } from "@/features/tours/components/TourCard";
import { TourFiltersBar } from "@/features/tours/components/TourFiltersBar";
import { buildTourColumns } from "@/features/tours/components/tourColumns";
import { useTourFilters } from "@/features/tours/hooks/useTourFilters";
import { useTours } from "@/features/tours/hooks/useTours";
import { cn } from "@/lib/utils";
import type { TourListItem } from "@/types/tour";

const NO_TOURS: TourListItem[] = [];

export function ToursPage() {
  const navigate = useNavigate();
  const filterState = useTourFilters();
  const { data, isLoading, isError, isFetching, refetch } = useTours(filterState.filters);
  const [deleteTarget, setDeleteTarget] = useState<TourListItem | null>(null);
  const columns = useMemo(() => buildTourColumns(setDeleteTarget), []);

  const filtered = filterState.activeCount > 0;

  return (
    <>
      <PageHeader
        title="Tours"
        description="Manage the tours and packages you sell."
        actions={
          <Button asChild>
            <Link to="/admin/tours/new">
              <Plus className="size-4" />
              Add tour
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <TourFiltersBar state={filterState} />

        {isError ? (
          <ErrorState
            title="We couldn't load the tours"
            description="Check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <div aria-busy={isFetching} className={cn("transition-opacity duration-150", isFetching && !isLoading && "opacity-60")}>
            <DataTable<TourListItem>
              columns={columns}
              data={data ?? NO_TOURS}
              loading={isLoading}
              pageSize={10}
              searchPlaceholder="Search by tour name or destination"
              emptyTitle={filtered ? "No tours match these filters" : "No tours yet"}
              emptyDescription={filtered ? "Try clearing some filters." : "Add your first tour to get started."}
              onRowClick={(row) => navigate(`/admin/tours/${row.id}`)}
              renderCard={(tour) => <TourCard tour={tour} onDelete={setDeleteTarget} />}
            />
          </div>
        )}
      </div>

      <DeleteTourDialog tour={deleteTarget} onClose={() => setDeleteTarget(null)} />
    </>
  );
}