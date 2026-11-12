import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { TourForm } from "@/features/tours/components/TourForm";
import { TourLoadError } from "@/features/tours/components/TourLoadError";
import { useTour, useUpdateTour } from "@/features/tours/hooks/useTours";

export function EditTourPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: tour, isLoading, isError, error, refetch } = useTour(id);
  const update = useUpdateTour(id);

  if (isLoading) {
    return (
      <div role="status" className="space-y-4">
        <span className="sr-only">Loading tour…</span>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  if (isError || !tour) return <TourLoadError error={error} onRetry={() => refetch()} />;

  return (
    <>
      <PageHeader title={`Edit ${tour.name}`} description={`${tour.destination} · last updated ${new Date(tour.updatedAt).toLocaleDateString()}`} />
      <TourForm
        mode="edit"
        initial={tour}
        cancelTo={`/admin/tours/${tour.id}`}
        isSubmitting={update.isPending}
        onSubmit={(input) => update.mutate(input, { onSuccess: () => navigate(`/admin/tours/${tour.id}`) })}
      />
    </>
  );
}