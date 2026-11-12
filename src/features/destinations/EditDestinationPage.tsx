import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { DestinationForm } from "@/features/destinations/components/DestinationForm";
import { DestinationLoadError } from "@/features/destinations/components/DestinationLoadError";
import { useDestination, useUpdateDestination } from "@/features/destinations/hooks/useDestinations";

export default function EditDestinationPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data: d, isLoading, error, refetch } = useDestination(id);
  const update = useUpdateDestination(id);

  if (isLoading) return <Skeleton className="h-96 w-full" />;
  if (error || !d) {
    return <DestinationLoadError error={error} onRetry={() => refetch()} onBack={() => navigate("/admin/destinations")} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`Edit ${d.name}`} description={d.region} />
      <DestinationForm
        initial={{
          name: d.name,
          region: d.region,
          description: d.description,
          highlights: d.highlights,
          bestSeason: d.bestSeason,
          latitude: d.latitude,
          longitude: d.longitude,
          images: d.images,
          published: d.published,
          featured: d.featured,
        }}
        submitLabel="Save changes"
        submitting={update.isPending}
        onCancel={() => navigate(`/admin/destinations/${d.id}`)}
        onSubmit={(input) => update.mutate(input, { onSuccess: () => navigate(`/admin/destinations/${d.id}`) })}
      />
    </div>
  );
}