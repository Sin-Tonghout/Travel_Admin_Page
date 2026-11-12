import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DestinationForm } from "@/features/destinations/components/DestinationForm";
import { useCreateDestination } from "@/features/destinations/hooks/useDestinations";

export default function NewDestinationPage() {
  const navigate = useNavigate();
  const create = useCreateDestination();

  return (
    <div className="space-y-6">
      <PageHeader title="New destination" description="Add a place travelers can visit." />
      <DestinationForm
        submitLabel="Create destination"
        submitting={create.isPending}
        onCancel={() => navigate("/admin/destinations")}
        onSubmit={(input) => create.mutate(input, { onSuccess: (d) => navigate(`/admin/destinations/${d.id}`) })}
      />
    </div>
  );
}